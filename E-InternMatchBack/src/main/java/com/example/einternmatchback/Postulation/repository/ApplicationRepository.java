package com.example.einternmatchback.Postulation.repository;


import com.example.einternmatchback.AjoutOffers.model.Offer;
import com.example.einternmatchback.Postulation.Entity.Application;
import com.example.einternmatchback.stagiaire.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByOfferId(Integer offerId);
    boolean existsByStudentIdAndOfferId(Integer studentId, Integer offerId);
    List<Application> findByStudentUserId(Integer userId);
    //salma
    void deleteByStudent(StudentProfile student);
// hamouda
@Modifying
@Query("DELETE FROM Application a WHERE a.offer = :offer")
void deleteByOffer(@Param("offer") Offer offer);

    @Modifying
    @Query("DELETE FROM Application a WHERE a.offer IN (SELECT o FROM Offer o WHERE o.company.id = :companyId)")
    void deleteAllByCompanyId(@Param("companyId") Integer companyId);

}
