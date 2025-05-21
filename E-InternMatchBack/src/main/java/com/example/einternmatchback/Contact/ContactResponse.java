package com.example.einternmatchback.Contact;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {
    private Long id;
    private String fullName;
    private String email;
    private String subject;
    private String message;
    private LocalDateTime createdAt;

}