package com.testtrack.repository;

import com.testtrack.model.Bug;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BugRepository extends JpaRepository<Bug, Long> {
    List<Bug> findAllByOrderByCreatedAtDesc();
}
