package com.example.einternmatchback.Authentification.user;


import com.example.einternmatchback.Authentification.token.Token;
import com.example.einternmatchback.ClientOffre.entity.Favoris;
import com.example.einternmatchback.stagiaire.StudentProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import static java.util.concurrent.TimeUnit.*;

@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_type")
@Table(name = "_user")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

//implementation de UserDetails pour  permetre a springboot authentification et autorisation
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String firstname;
    private String lastname;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    private List<Token> tokens;

    //pour partie studentprofileid
    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
    @JsonIgnore
    private StudentProfile studentProfile;
/*
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favoris> favoris;
*/
    /*@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getAuthority()));
    }*/

    //salma
    @Column(name = "locked_by_admin", nullable = false)
    private boolean lockedByAdmin = false;

    @Column(name = "lock_date")
    private LocalDateTime lockDate;

    @Column(name = "lock_duration_unit",nullable = true)
    @Enumerated(EnumType.STRING)
    private LockDurationUnit lockDurationUnit;  // null par défaut

    @Column(name = "lock_duration")
    private Integer lockDuration = 0;  // durée du blocage (nombre), 0 = pas de blocage


    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public String getPassword() {
        return password;
    }


    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }




    //salma
    public boolean isLockedByAdmin() {
        if (!lockedByAdmin) return false;

        if (lockDuration != null && lockDuration > 0 && lockDurationUnit != null && lockDate != null) {
            LocalDateTime unlockDate = switch (lockDurationUnit) {
                case MINUTES -> lockDate.plusMinutes(lockDuration);
                case HOURS -> lockDate.plusHours(lockDuration);
                case DAYS -> lockDate.plusDays(lockDuration);
            };

            // Débloque automatiquement si la date est passée
            if (LocalDateTime.now().isAfter(unlockDate)) {
                this.lockedByAdmin = false;
                this.lockDate = null;
                this.lockDuration = 0;
                this.lockDurationUnit = null;
                return false;
            }
        }

        return true;
    }
    //zyada
    @Column(name = "deactivated_by_user")
    private Boolean deactivatedByUser;

    @Override
    public boolean isEnabled() {
        return this.deactivatedByUser == null || !this.deactivatedByUser;
    }

}