package com.example.einternmatchback.messagerie.Controller;

import com.example.einternmatchback.Authentification.user.User;
import com.example.einternmatchback.Authentification.user.UserRepository;
import com.example.einternmatchback.messagerie.entity.*;
import com.example.einternmatchback.messagerie.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;
import com.example.einternmatchback.messagerie.repository.NotificationRepository;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController

//@RequestMapping("/api/v1")
@RequestMapping("/api/messages")
public class MessageRestController {

    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private BlockedUserRepository blockedUserRepository;
    @Autowired
    private ReportRepository reportRepository;
    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        if (message.isCompletelyDeleted()) {
            throw new IllegalArgumentException("Cannot send a deleted message");
        }
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        message.setEdited(false);
        message.setCompletelyDeleted(false);
        return messageRepository.save(message);
    }


    @GetMapping("/conversation")
    public List<Message> getConversation(@RequestParam Integer user1,
                                         @RequestParam Integer user2) {
        return messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByTimestamp(
                        user1, user2, user1, user2
                ).stream()
                .filter(m -> !m.isCompletelyDeleted())
                .toList();
    }


    @GetMapping("/unread")
    public List<Message> getUnreadMessages(@RequestParam Integer receiverId) {
        return messageRepository.findByReceiverIdAndReadFalse(receiverId);
    }

    @PostMapping("/{messageId}/read")
    public void markAsRead(@PathVariable Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setRead(true);
        messageRepository.save(message);
    }

    @GetMapping("/conversations/history")
    public List<ConversationDTO> getConversationHistory(@RequestParam Integer userId) {
        List<Message> latestMessages = messageRepository.findLatestMessagesByUser(userId);
        List<ConversationDTO> result = new ArrayList<>();

        for (Message message : latestMessages) {
            Integer otherUserId = message.getSenderId().equals(userId)
                    ? message.getReceiverId()
                    : message.getSenderId();

            Optional<User> otherUserOpt = userRepository.findById(otherUserId);

            if (otherUserOpt.isPresent()) {
                User otherUser = otherUserOpt.get();

                String imageUrl = "/api/search/image?userId=" + otherUser.getId()
                        + "&role=" + otherUser.getRole().name();

                boolean isRead = !message.getSenderId().equals(userId) && message.isRead();
                int unreadCount = messageRepository.countUnreadMessages(otherUser.getId(), userId);

                result.add(new ConversationDTO(
                        otherUser.getId(),
                        otherUser.getFirstname(),
                        otherUser.getLastname(),
                        otherUser.getRole().name(),
                        imageUrl,
                        message.getContent(),
                        message.getTimestamp(),
                        isRead,
                        unreadCount
                ));
            }
        }

        return result;
    }


    // hamouda
    @GetMapping("/{messageId}/status")
    public Message getMessageStatus(@PathVariable Long messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }
    @DeleteMapping("/{messageId}")
    public void deleteMessage(@PathVariable Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setCompletelyDeleted(true);
        messageRepository.save(message);
    }

    @PutMapping("/{messageId}/edit/{userId}")
    public Message editMessage(@PathVariable Long messageId,
                               @PathVariable Integer userId,
                               @RequestBody String newContent) {
        messageRepository.updateMessageContent(messageId, userId, newContent);
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }
    @GetMapping("/notifications")
    public List<Notification> getUnreadNotifications(@RequestParam Integer userId) {
        return notificationRepository.findUnreadNotificationsWithSenderDetails(userId);
    }

    @PostMapping("/notifications/{notificationId}/read")
    public void markNotificationAsRead(@PathVariable Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @PostMapping("/notifications/mark-all-read")
    public void markAllNotificationsAsRead(@RequestBody Map<String, Integer> request) {
        Integer userId = request.get("userId");
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        notificationRepository.markAllAsRead(userId);
    }




    @PostMapping("/block")
    public ResponseEntity<?> blockUser(@RequestBody Map<String, Integer> request) {
        Integer blockerId = request.get("blockerId");
        Integer blockedId = request.get("blockedId");

        if (blockerId == null || blockedId == null) {
            return ResponseEntity.badRequest().body("Les IDs sont requis");
        }

        if (blockedUserRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            return ResponseEntity.ok().body("L'utilisateur est déjà bloqué");
        }

        BlockedUser blockedUser = new BlockedUser();
        blockedUser.setBlockerId(blockerId);
        blockedUser.setBlockedId(blockedId);
        blockedUserRepository.save(blockedUser);

        return ResponseEntity.ok().body("Utilisateur bloqué avec succès");
    }

    @PostMapping("/unblock")
    public ResponseEntity<?> unblockUser(@RequestBody Map<String, Integer> request) {
        Integer blockerId = request.get("blockerId");
        Integer blockedId = request.get("blockedId");

        if (blockerId == null || blockedId == null) {
            return ResponseEntity.badRequest().body("Les IDs sont requis");
        }

        // Vérification explicite avant suppression
        if (!blockedUserRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            return ResponseEntity.ok().body("Cet utilisateur n'était pas bloqué");
        }

        // Suppression avec retour du nombre d'entités supprimées
        int deletedCount = blockedUserRepository.deleteByBlockerIdAndBlockedId(blockerId, blockedId);

        if (deletedCount == 0) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Échec de la suppression du blocage");
        }

        return ResponseEntity.ok().body("Utilisateur débloqué avec succès");
    }

    @GetMapping("/blocked-users/{userId}")
    public List<Integer> getBlockedUsers(@PathVariable Integer userId) {
        return blockedUserRepository.findBlockedUserIdsByBlockerId(userId);
    }

    @GetMapping("/is-blocked")
    public boolean isUserBlocked(@RequestParam Integer blockerId,
                                 @RequestParam Integer blockedId) {
        return blockedUserRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId);
    }

    // Dans votre MessageRestController.java - méthode reportMessage
    @PostMapping("/{messageId}/report")
    public ResponseEntity<?> reportMessage(@PathVariable Long messageId,
                                           @RequestBody Map<String, String> request,
                                           Principal principal) {
        try {
            String email = principal.getName();
            User reporter = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new RuntimeException("Message non trouvé"));

            // Vérifier si l'utilisateur a déjà signalé ce message
            if (reportRepository.existsByReporterIdAndMessageId(reporter.getId(), messageId)) {
                return ResponseEntity.badRequest().body("Vous avez déjà signalé ce message");
            }

            // Vérifier que la raison est fournie
            String reason = request.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La raison du signalement est requise");
            }

            Report report = new Report();
            report.setType(Report.ReportType.MESSAGE);
            report.setMessageId(messageId);
            report.setReportedUserId(message.getSenderId());
            report.setReporterId(reporter.getId());
            report.setReason(reason);

            return ResponseEntity.ok(reportRepository.save(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}