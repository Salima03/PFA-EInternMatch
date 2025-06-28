package com.example.einternmatchback.messagerie.repository;

import com.example.einternmatchback.messagerie.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByHandledFalseOrderByCreatedAtDesc();
    boolean existsByReporterIdAndMessageId(Integer reporterId, Long messageId);
    boolean existsByReporterIdAndReportedUserIdAndMessageIdIsNull(Integer reporterId, Integer reportedUserId);
    List<Report> findByReportedUserId(Integer reportedUserId);

    @Query("SELECT new map(r.id as id, u.email as reporterEmail, u2.email as reportedUserEmail, " +
            "r.type as type, r.reason as reason, r.createdAt as createdAt, r.handled as handled, " +
            "m.content as messageContent, u2.lockedByAdmin as userLocked) " +
            "FROM Report r " +
            "LEFT JOIN User u ON u.id = r.reporterId " +
            "LEFT JOIN User u2 ON u2.id = r.reportedUserId " +
            "LEFT JOIN Message m ON m.id = r.messageId " +
            "ORDER BY r.createdAt DESC")
    List<Map<String, Object>> findAllReportsWithDetails();
}