package com.testtrack.service;

import com.testtrack.model.Bug;
import com.testtrack.model.User;
import com.testtrack.repository.BugRepository;
import com.testtrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BugAssignmentService {

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private UserRepository userRepository;

    private static final Map<String, Integer> PRIORITY_RANK = Map.of(
            "High", 1, "Medium", 2, "Low", 3
    );

    public String assignHighestPriorityBug() {
        List<Bug> unassignedBugs = bugRepository.findAll().stream()
                .filter(b -> "Open".equals(b.getStatus()) && b.getAssignee() == null)
                .collect(Collectors.toList());

        if (unassignedBugs.isEmpty()) return "No unassigned Open bugs available to route.";

        // PriorityQueue matching the DSA Min-Heap concepts
        PriorityQueue<Bug> bugQueue = new PriorityQueue<>(
                Comparator.comparingInt((Bug b) -> PRIORITY_RANK.getOrDefault(b.getPriority(), 4))
                          .thenComparing((b1, b2) -> {
                              if (b1.getCreatedAt() != null && b2.getCreatedAt() != null) {
                                  return b1.getCreatedAt().compareTo(b2.getCreatedAt()); // Oldest first
                              } return 0;
                          })
        );
        bugQueue.addAll(unassignedBugs);

        Bug topBug = bugQueue.poll();
        if (topBug == null) return "No bugs found.";

        // Find developers to determine workload burdens
        List<User> devs = userRepository.findAll().stream()
                .filter(u -> "Developer".equalsIgnoreCase(u.getRole()))
                .collect(Collectors.toList());

        if (devs.isEmpty()) {
            User adminFallback = userRepository.findAll().stream().filter(u -> "Admin".equalsIgnoreCase(u.getRole())).findFirst().orElse(null);
            if (adminFallback != null) {
               devs.add(adminFallback);
            } else {
               return "No valid personnel found to assign the bug.";
            }
        }

        // Calculate workload (Open/In Progress items assigned)
        List<Bug> allBugs = bugRepository.findAll();
        Map<String, Long> devWorkload = devs.stream().collect(Collectors.toMap(
                User::getUsername,
                dev -> allBugs.stream().filter(b -> dev.getUsername().equals(b.getAssignee()) && !"Resolved".equals(b.getStatus())).count()
        ));

        // Get Least Burdened Developer
        String bestDev = Collections.min(devWorkload.entrySet(), Map.Entry.comparingByValue()).getKey();

        // Assign Bug
        topBug.setAssignee(bestDev);
        topBug.setStatus("In Progress");
        bugRepository.save(topBug);

        return "Successfully auto-assigned critical bug: '" + topBug.getTitle() + "' to " + bestDev + ".";
    }
}
