package com.example.einternmatchback.messagerie.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ReportType type; // MESSAGE ou USER

    private Long messageId; // null si c'est un signalement d'utilisateur
    private Integer reportedUserId; // l'utilisateur signalé
    private Integer reporterId; // celui qui signale

    private String reason;
    private LocalDateTime createdAt = LocalDateTime.now();
    private boolean handled = false; // pour marquer si le signalement a été traité

    public enum ReportType {
        MESSAGE, USER
    }
}