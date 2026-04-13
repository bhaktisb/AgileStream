package com.testtrack.controller;

import com.testtrack.model.Bug;
import com.testtrack.repository.BugRepository;
import com.testtrack.service.BugAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/bugs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BugController {

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private BugAssignmentService assignmentService;

    // Helper map for Priority Queue ranking (High -> Medium -> Low)
    private static final Map<String, Integer> PRIORITY_RANK = new HashMap<>();
    static {
        PRIORITY_RANK.put("High", 1);
        PRIORITY_RANK.put("Medium", 2);
        PRIORITY_RANK.put("Low", 3);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TESTER')")
    public ResponseEntity<?> addBug(@RequestBody Map<String, String> bugRequest, Authentication authentication) {
        String title = bugRequest.get("title");
        String description = bugRequest.get("description");
        String priority = bugRequest.get("priority");
        String status = bugRequest.getOrDefault("status", "Open");

        if (title == null || description == null || !PRIORITY_RANK.containsKey(priority)) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Missing or invalid fields");
            return ResponseEntity.status(422).body(response);
        }

        Bug bug = new Bug(title, description, priority, status);
        bugRepository.save(bug);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Bug added by " + authentication.getName() + "!");
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<?> getBugs() {
        List<Bug> bugs = bugRepository.findAllByOrderByCreatedAtDesc();

        /*
         * DSA Concept: Using PriorityQueue to dynamically prioritize bugs.
         * The queue guarantees that High priority items come first.
         * For same priority, we preserve chronological order (earliest first or latest first).
         */
        PriorityQueue<Bug> bugQueue = new PriorityQueue<>(
                Comparator.comparingInt((Bug b) -> PRIORITY_RANK.getOrDefault(b.getPriority(), 4))
                          .thenComparing((b1, b2) -> {
                              if (b1.getCreatedAt() != null && b2.getCreatedAt() != null) {
                                  return b2.getCreatedAt().compareTo(b1.getCreatedAt()); // Newest first for same priority
                              }
                              return 0;
                          })
        );

        bugQueue.addAll(bugs);

        List<Bug> prioritizedBugs = new ArrayList<>();
        while (!bugQueue.isEmpty()) {
            prioritizedBugs.add(bugQueue.poll());
        }

        return ResponseEntity.ok(prioritizedBugs);
    }

    @PostMapping("/auto-assign")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVELOPER') or hasRole('TESTER')")
    public ResponseEntity<?> autoAssignBug() {
        String message = assignmentService.assignHighestPriorityBug();
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{bug_id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DEVELOPER') or hasRole('TESTER')")
    public ResponseEntity<?> updateBugStatus(@PathVariable Long bug_id, @RequestBody Map<String, String> updateRequest, Authentication authentication) {
        Optional<Bug> optionalBug = bugRepository.findById(bug_id);
        if (optionalBug.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Bug bug = optionalBug.get();
        bug.setStatus(updateRequest.get("status"));
        bugRepository.save(bug);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Bug status updated by " + authentication.getName());
        return ResponseEntity.ok(response);
    }
}
