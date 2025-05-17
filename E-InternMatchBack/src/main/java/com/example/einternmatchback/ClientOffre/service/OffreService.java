package com.example.einternmatchback.ClientOffre.service;

import com.example.einternmatchback.AjoutOffers.model.Offer;
import com.example.einternmatchback.ClientOffre.entity.Favoris;
import com.example.einternmatchback.ClientOffre.repository.CompanyOfferRepository;
import com.example.einternmatchback.ClientOffre.repository.FavorisRepository;
import com.example.einternmatchback.Authentification.user.User;
import com.example.einternmatchback.Authentification.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OffreService {
    private final CompanyOfferRepository offerRepository;
    private final FavorisRepository favorisRepository;
    private final UserRepository userRepository;

    public List<Offer> getAllOffres() {
        return offerRepository.findAll();
    }

    public List<Offer> getOffresByLocation(String location) {
        return offerRepository.findByLocationContainingIgnoreCase(location);
    }

    public List<Offer> getOffresByStageType(String stageType) {
        return offerRepository.findByStageTypeContainingIgnoreCase(stageType);
    }


    public void addFavoris(String userEmail, Integer offerId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        if (!favorisRepository.existsByUserAndOffer(user, offer)) {
            Favoris favoris = new Favoris();
            favoris.setUser(user);
            favoris.setOffer(offer);
            favorisRepository.save(favoris);
        }
    }

    public List<Offer> getUserFavorites(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return favorisRepository.findByUser(user)
                .stream()
                .map(Favoris::getOffer)
                .collect(Collectors.toList());
    }


    public void removeFavoris(String userEmail, Integer offerId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        Optional<Favoris> favoris = favorisRepository.findByUserAndOffer(user, offer);
        favoris.ifPresent(favorisRepository::delete);
    }


    public List<Offer> searchOffersByKeyword(String keyword) {
        return offerRepository.searchByKeyword(keyword);
    }
    //asssia
    // -------- Recommandation d'offres basée sur les compétences --------

    public List<Offer> getSortedOffersForStudent(Set<String> studentSkills) {


        // Si l'étudiant n'a aucune compétence enregistrée, on peut soit renvoyer toutes les offres, soit les trier différemment
        if (studentSkills == null || studentSkills.isEmpty()) {
            return offerRepository.findAll();  // Retourne toutes les offres sans tri
        }

        List<Offer> allOffers = offerRepository.findAll();

        return allOffers.stream()
                .sorted((o1, o2) -> {
                    double score1 = jaccardSimilarity(studentSkills, parseOfferSkills(o1.getSkillsRequired()));
                    double score2 = jaccardSimilarity(studentSkills, parseOfferSkills(o2.getSkillsRequired()));
                    return Double.compare(score2, score1); // ordre décroissant
                })
                .collect(Collectors.toList());
    }

    private Set<String> parseOfferSkills(String skillsRequired) {
        if (skillsRequired == null || skillsRequired.isBlank()) return new HashSet<>();
        return Arrays.stream(skillsRequired.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    private double jaccardSimilarity(Set<String> set1, Set<String> set2) {
        if (set1.isEmpty() && set2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return union.isEmpty() ? 0.0 : (double) intersection.size() / union.size();
    }





}