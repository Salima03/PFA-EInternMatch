package com.example.einternmatchback.Authentification.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepositoryBloquage extends JpaRepository<User, Integer> {
    List<User> findByLockedByAdminTrue();
}