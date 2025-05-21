package com.example.einternmatchback.Authentification.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserBloquageController {

    private final UserServicebloquage userServicebloquage;

    // Bloquer un utilisateur avec durée et unité (ex: lockDuration=2, lockDurationUnit=HOURS)
    @PostMapping("/{id}/lock")
    public ResponseEntity<String> lockUser(
            @PathVariable Integer id,
            @RequestParam int lockDuration,
            @RequestParam LockDurationUnit lockDurationUnit) {

        userServicebloquage.lockUserByAdmin(id, lockDuration, lockDurationUnit);
        return ResponseEntity.ok("Utilisateur bloqué pendant " + lockDuration + " " + lockDurationUnit.toString().toLowerCase() + ".");
    }

    // Débloquer un utilisateur manuellement
    @PostMapping("/{id}/unlock")
    public ResponseEntity<String> unlockUser(@PathVariable Integer id) {
        userServicebloquage.unlockUserByAdmin(id);
        return ResponseEntity.ok("Utilisateur débloqué avec succès.");
    }

    // Déblocage automatique (à appeler périodiquement via tâche planifiée ou manuellement)
    @PostMapping("/unlock-automatic")
    public ResponseEntity<String> unlockUsersAutomatically() {
        userServicebloquage.unlockAutomatically();
        return ResponseEntity.ok("Déblocage automatique effectué.");
    }
}