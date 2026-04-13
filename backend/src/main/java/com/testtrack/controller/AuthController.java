package com.testtrack.controller;

import com.testtrack.model.User;
import com.testtrack.repository.UserRepository;
import com.testtrack.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> signUpRequest) {
        if (userRepository.findByUsername(signUpRequest.get("username")).isPresent()) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Username already exists!");
            return ResponseEntity.status(409).body(response);
        }

        // Default role is Tester if not provided
        String role = signUpRequest.getOrDefault("role", "Tester");
        User user = new User(signUpRequest.get("username"),
                encoder.encode(signUpRequest.get("password")),
                role);

        userRepository.save(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.get("username"), loginRequest.get("password")));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            org.springframework.security.core.userdetails.User userDetails = 
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            
            // Extract original role from string list
            String authority = userDetails.getAuthorities().iterator().next().getAuthority();
            String role = authority.replace("ROLE_", "");

            String jwt = jwtUtils.generateJwtToken(userDetails.getUsername(), role);

            Map<String, String> response = new HashMap<>();
            response.put("access_token", jwt);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        return ResponseEntity.ok(response);
    }
}
