package com.example.einternmatchback.Authentification.user;

import com.example.einternmatchback.AjoutOffers.model.Company;
import com.example.einternmatchback.AjoutOffers.repo.CompanyRepository;
import com.example.einternmatchback.stagiaire.StudentProfile;
import com.example.einternmatchback.stagiaire.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServicebloquage {

    private final UserRepositoryBloquage userRepositoryBloquage;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;

    // Récupérer un utilisateur à partir d’un ID de profil (étudiant ou entreprise)
    private User getUserFromProfileId(Integer profileId) {
        return studentProfileRepository.findById(profileId)
                .map(StudentProfile::getUser)
                .orElseGet(() ->
                        companyRepository.findById(profileId)
                                .map(company -> userRepositoryBloquage.findById(company.getUserId())
                                        .orElseThrow(() -> new RuntimeException("Utilisateur de l'entreprise introuvable")))
                                .orElseThrow(() -> new RuntimeException("Profil étudiant ou entreprise non trouvé")));
    }

    // Bloquer un utilisateur à partir de l’ID du profil
    public void lockUserByAdmin(Integer profileId, int lockDuration, LockDurationUnit lockDurationUnit) {
        User user = getUserFromProfileId(profileId);
        user.setLockedByAdmin(true);
        user.setLockDate(LocalDateTime.now());
        user.setLockDuration(lockDuration);
        user.setLockDurationUnit(lockDurationUnit);
        userRepositoryBloquage.save(user);
    }

    // Débloquer un utilisateur manuellement à partir de l’ID du profil
    public void unlockUserByAdmin(Integer profileId) {
        User user = getUserFromProfileId(profileId);
        user.setLockedByAdmin(false);
        user.setLockDate(null);
        user.setLockDuration(0);
        user.setLockDurationUnit(null);
        userRepositoryBloquage.save(user);
    }

    // Débloquer automatiquement les comptes expirés
    public void unlockAutomatically() {
        List<User> lockedUsers = userRepositoryBloquage.findByLockedByAdminTrue();

        for (User user : lockedUsers) {
            if (user.getLockDate() != null &&
                    user.getLockDuration() != null && user.getLockDuration() > 0 &&
                    user.getLockDurationUnit() != null) {

                LocalDateTime lockDate = user.getLockDate();
                int duration = user.getLockDuration();
                boolean unlock = false;

                switch (user.getLockDurationUnit()) {
                    case MINUTES:
                        if (ChronoUnit.MINUTES.between(lockDate, LocalDateTime.now()) >= duration) unlock = true;
                        break;
                    case HOURS:
                        if (ChronoUnit.HOURS.between(lockDate, LocalDateTime.now()) >= duration) unlock = true;
                        break;
                    case DAYS:
                        if (ChronoUnit.DAYS.between(lockDate, LocalDateTime.now()) >= duration) unlock = true;
                        break;
                }

                if (unlock) {
                    user.setLockedByAdmin(false);
                    user.setLockDate(null);
                    user.setLockDuration(0);
                    user.setLockDurationUnit(null);
                    userRepositoryBloquage.save(user);
                }
            }
        }
    }

    @Scheduled(fixedRate = 1000)  // toutes les 5 minutes
    public void scheduledUnlockAutomatically() {
        unlockAutomatically();
    }
}