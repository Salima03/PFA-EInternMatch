package com.example.einternmatchback.SearchProfile;

import com.example.einternmatchback.AjoutOffers.repo.CompanyRepository;
import com.example.einternmatchback.Authentification.user.Role;
import com.example.einternmatchback.Authentification.user.User;
import com.example.einternmatchback.Authentification.user.UserRepository;
import com.example.einternmatchback.stagiaire.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public List<SearchProfileDTO> searchUsers(String keyword) {
        String loweredKeyword = keyword.trim().toLowerCase();

        // 🔍 Recherche dans les profils étudiants (via User lié)
        List<SearchProfileDTO> studentResults = studentProfileRepository.findAll().stream()
                .filter(student -> {
                    User user = student.getUser();
                    return user != null &&
                            (user.getFirstname().toLowerCase().contains(loweredKeyword)
                                    || user.getLastname().toLowerCase().contains(loweredKeyword));
                })
                .map(student -> {
                    User user = student.getUser();
                    SearchProfileDTO dto = new SearchProfileDTO();
                    dto.setUserId(user.getId());
                    dto.setFirstname(user.getFirstname());
                    dto.setLastname(user.getLastname());
                    dto.setRole(Role.STUDENT.name());
                    dto.setImageUrl("http://localhost:1217/api/search/image?userId=" + user.getId() + "&role=STUDENT");
                    return dto;
                }).collect(Collectors.toList());

        // 🔍 Recherche dans les entreprises
        List<SearchProfileDTO> companyResults = companyRepository.findAll().stream()
                .filter(company -> company.getName().toLowerCase().contains(loweredKeyword))
                .map(company -> {
                    User user = userRepository.findById(company.getUserId()).orElse(null);
                    SearchProfileDTO dto = new SearchProfileDTO();
                    dto.setUserId(company.getUserId());
                    dto.setFirstname(company.getName()); // Le nom de la société
                    dto.setLastname(""); // Vide pour une entreprise
                    dto.setRole(Role.MANAGER.name());
                    dto.setImageUrl("http://localhost:1217/api/search/image?userId=" + company.getUserId() + "&role=COMPANY");
                    return dto;
                }).collect(Collectors.toList());

        // 🔗 Combine les deux
        studentResults.addAll(companyResults);
        return studentResults;
    }
}