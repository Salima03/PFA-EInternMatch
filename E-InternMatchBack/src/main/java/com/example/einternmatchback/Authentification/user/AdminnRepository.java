package com.example.einternmatchback.Authentification.user;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface AdminnRepository extends JpaRepository<Admin,Integer> {
    Optional<Admin> findById(Integer id);

}