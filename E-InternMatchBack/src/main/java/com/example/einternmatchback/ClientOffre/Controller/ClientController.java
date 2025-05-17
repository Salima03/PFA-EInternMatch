package com.example.einternmatchback.ClientOffre.Controller;

import com.example.einternmatchback.AjoutOffers.model.Offer;
import com.example.einternmatchback.Authentification.user.UserRepository;
import com.example.einternmatchback.ClientOffre.service.OffreService;
import com.example.einternmatchback.stagiaire.StudentProfileRepository;
import com.example.einternmatchback.stagiaire.StudentProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

//ajoute les imports pour partie recommondation

import com.example.einternmatchback.stagiaire.StudentProfile;
import com.example.einternmatchback.stagiaire.StudentProfileRepository;
import com.example.einternmatchback.stagiaire.StudentProfileService;
import com.example.einternmatchback.Authentification.user.User;
import com.example.einternmatchback.Authentification.user.UserRepository;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/student")
@PreAuthorize("hasRole('STUDENT')")
public class ClientController {
    @Autowired
    private OffreService offreService;
     //assia
    //necessaire pour partie recommandation
    // /*
    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentProfileService studentProfileService;

    @Autowired
    private UserRepository userRepository;
    // */

    public void StudentController(OffreService offreService) {
        this.offreService = offreService;
    }
/*
    @GetMapping("/offers")
    public ResponseEntity<List<Offer>> getAllOffers(@RequestParam(required = false) String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return ResponseEntity.ok(offreService.searchOffersByKeyword(keyword));
        }
        return ResponseEntity.ok(offreService.getAllOffres());
    }
*/
@GetMapping("/offers")
public ResponseEntity<List<Offer>> getAllOffers(
        @RequestParam(required = false) String location,
        @RequestParam(required = false) String stageType,
        Principal principal) {

    // Récupération de l'utilisateur connecté
    String email = principal.getName();
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    StudentProfile profile = studentProfileRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Student profile not found"));

    Set<String> studentSkills = studentProfileService.extractSkillNames(profile);

    // Génère d'abord les offres triées par pertinence
    List<Offer> sortedOffers = offreService.getSortedOffersForStudent(studentSkills);

    // Appliquer le filtrage sur la liste recommandée
    List<Offer> filteredOffers = sortedOffers.stream()
            .filter(offer -> location == null || offer.getLocation().toLowerCase().contains(location.toLowerCase()))
            .filter(offer -> stageType == null || offer.getStageType().equalsIgnoreCase(stageType))
            .toList();

    return ResponseEntity.ok(filteredOffers);
}

    @PostMapping("/favorites/{offerId}")
    public ResponseEntity<String> addFavorite(
            @PathVariable int offerId,
            Principal principal) {

        // Vous devrez modifier votre service pour utiliser l'email du principal
        offreService.addFavoris(principal.getName(), offerId);
        return ResponseEntity.ok("Offre ajoutée aux favoris");
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Offer>> getFavorites(Principal principal) {
        // Adaptez cette méthode dans votre service pour retourner List<CompanyOffer>
        return ResponseEntity.ok(offreService.getUserFavorites(principal.getName()));
    }

    @DeleteMapping("/favorites/remove/{offerId}")
    public ResponseEntity<String> removeFavorite(
            @PathVariable int offerId,
            Principal principal) {

        offreService.removeFavoris(principal.getName(), offerId);
        return ResponseEntity.ok("Offre retirée des favoris");
    }

}