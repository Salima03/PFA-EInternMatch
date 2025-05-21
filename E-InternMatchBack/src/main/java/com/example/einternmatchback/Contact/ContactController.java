package com.example.einternmatchback.Contact;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    // Endpoint public - accessible sans authentification
    @PostMapping
    public ResponseEntity<ContactResponse> createContact(@RequestBody ContactRequest request) {
        return ResponseEntity.ok(contactService.createContact(request));
    }

    // Endpoints admin - nécessitent le rôle ADMIN
    @GetMapping("/all")
    public ResponseEntity<List<ContactResponse>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<List<ContactResponse>> getContactsByEmail(@PathVariable String email) {
        return ResponseEntity.ok(contactService.getContactsByEmail(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}