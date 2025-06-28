package com.example.einternmatchback.messagerie.repository;

import com.example.einternmatchback.messagerie.entity.BlockedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {
    boolean existsByBlockerIdAndBlockedId(Integer blockerId, Integer blockedId);

    @Query("SELECT b.blockedId FROM BlockedUser b WHERE b.blockerId = :userId")
    List<Integer> findBlockedUserIdsByBlockerId(@Param("userId") Integer userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM BlockedUser b WHERE b.blockerId = :blockerId AND b.blockedId = :blockedId")
    int deleteByBlockerIdAndBlockedId(@Param("blockerId") Integer blockerId,
                                      @Param("blockedId") Integer blockedId);
}