package com.example.einternmatchback.Contact;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactResponse createContact(ContactRequest request) {
        var contact = Contact.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();

        var savedContact = contactRepository.save(contact);
        return mapToResponse(savedContact);
    }

    public List<ContactResponse> getAllContacts() {
        return contactRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ContactResponse> getContactsByEmail(String email) {
        return contactRepository.findByEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    private ContactResponse mapToResponse(Contact contact) {
        return ContactResponse.builder()
                .id(contact.getId())
                .fullName(contact.getFullName())
                .email(contact.getEmail())
                .subject(contact.getSubject())
                .message(contact.getMessage())
                .createdAt(contact.getCreatedAt())
                .build();
    }
}