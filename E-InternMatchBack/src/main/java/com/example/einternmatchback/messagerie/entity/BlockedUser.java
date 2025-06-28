package com.example.einternmatchback.messagerie.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class BlockedUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer blockerId;
    private Integer blockedId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}