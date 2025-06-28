package com.example.einternmatchback.Authentification.user;


import com.example.einternmatchback.messagerie.entity.Report;
import com.example.einternmatchback.messagerie.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController //la class est un controleur qui gère les requêtes HTTP et renvoie des objets JSON au lieu des pages html
//prefixe des routes de ce controlleur
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    //injection de class UserService dans la class UserController sans creer le constructeur c est fait par @RequiredArgsConstructor
    private final UserService service;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;

    // la requete patch pour modifier partielement une ressource(on change que le password )
    @PatchMapping
    //request contient les 3 para currentPassword, newPassword, confirmationPassword
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Principal connectedUser
    ) {
        //on fait appel a la method changePassword de classe userservice responsable de changement de password
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }
    //salma
    @GetMapping("/by-email")
    public ResponseEntity<?> getUserIdByEmail(@RequestParam String email) {
        var user = service.getUserByEmail(email);
        if (user != null) {
            return ResponseEntity.ok().body(Map.of("id", user.getId()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }










    // Nouvelle méthode pour signaler un utilisateur
    // Dans votre UserController.java - méthode reportUser
    @PostMapping("/{userId}/report")
    public ResponseEntity<?> reportUser(@PathVariable Integer userId,
                                        @RequestBody Map<String, String> request,
                                        Principal principal) {
        try {
            // Récupérer l'utilisateur qui signale
            String email = principal.getName();
            User reporter = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Vérifier que l'utilisateur signalé existe
            User reportedUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur signalé non trouvé"));

            // Empêcher de se signaler soi-même
            if (reporter.getId().equals(reportedUser.getId())) {
                return ResponseEntity.badRequest().body("Vous ne pouvez pas vous signaler vous-même");
            }

            // Vérifier que la raison est fournie
            String reason = request.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La raison du signalement est requise");
            }

            // Vérifier si l'utilisateur a déjà signalé cet utilisateur (sans message associé)
            if (reportRepository.existsByReporterIdAndReportedUserIdAndMessageIdIsNull(reporter.getId(), userId)) {
                return ResponseEntity.badRequest().body("Vous avez déjà signalé cet utilisateur");
            }

            // Créer et enregistrer le signalement
            Report report = new Report();
            report.setType(Report.ReportType.USER);
            report.setReportedUserId(userId);
            report.setReporterId(reporter.getId());
            report.setReason(reason);

            return ResponseEntity.ok(reportRepository.save(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Nouvelle méthode pour obtenir les infos d'un utilisateur (utile pour le frontend)
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserInfo(@PathVariable Integer userId) {
        return userRepository.findById(userId)
                .map(user -> ResponseEntity.ok().body(Map.of(
                        "id", user.getId(),
                        "firstname", user.getFirstname(),
                        "lastname", user.getLastname(),
                        "email", user.getEmail(),
                        "role", user.getRole().name()
                )))
                .orElse(ResponseEntity.notFound().build());
    }


}