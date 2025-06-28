package com.example.einternmatchback.messagerie.Controller;

import com.example.einternmatchback.messagerie.entity.Report;
import com.example.einternmatchback.messagerie.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @PostMapping
    public ResponseEntity<?> createReport(@RequestBody Report report) {
        try {
            // Pour les signalements de message
            if (report.getType() == Report.ReportType.MESSAGE) {
                if (report.getMessageId() == null) {
                    return ResponseEntity.badRequest().body("L'ID du message est requis pour un signalement de message");
                }
                if (reportRepository.existsByReporterIdAndMessageId(report.getReporterId(), report.getMessageId())) {
                    return ResponseEntity.badRequest().body("Vous avez déjà signalé ce message");
                }
            }
            // Pour les signalements d'utilisateur
            else if (report.getType() == Report.ReportType.USER) {
                if (report.getReportedUserId() == null) {
                    return ResponseEntity.badRequest().body("L'ID de l'utilisateur signalé est requis");
                }
                // On vérifie seulement si l'utilisateur a déjà signalé cet utilisateur SANS message associé
                if (reportRepository.existsByReporterIdAndReportedUserIdAndMessageIdIsNull(
                        report.getReporterId(),
                        report.getReportedUserId())) {
                    return ResponseEntity.badRequest().body("Vous avez déjà signalé cet utilisateur");
                }
            }

            return ResponseEntity.ok(reportRepository.save(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/unhandled")
    public List<Report> getUnhandledReports() {
        return reportRepository.findByHandledFalseOrderByCreatedAtDesc();
    }

    @PostMapping("/{id}/handle")
    public ResponseEntity<?> markAsHandled(@PathVariable Long id) {
        return reportRepository.findById(id)
                .map(report -> {
                    report.setHandled(true);
                    return ResponseEntity.ok(reportRepository.save(report));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<?> getAllReports() {
        try {
            List<Map<String, Object>> reports = reportRepository.findAllReportsWithDetails();
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la récupération des signalements");
        }
    }

    @PostMapping("/user/{userId}/mark-handled")
    public ResponseEntity<?> markAllUserReportsAsHandled(@PathVariable Integer userId) {
        try {
            List<Report> userReports = reportRepository.findByReportedUserId(userId);
            userReports.forEach(report -> {
                report.setHandled(true);
                reportRepository.save(report);
            });
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du marquage des signalements comme traités");
        }
    }
}