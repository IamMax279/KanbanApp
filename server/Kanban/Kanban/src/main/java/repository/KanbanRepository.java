package repository;

import jakarta.transaction.Transactional;
import models.Kanban;
import models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface KanbanRepository extends JpaRepository<Kanban, Long> {
    @Transactional
    @Modifying
    @Query("DELETE FROM Kanban k WHERE k.user = :user") //takes the user param from below
    void deleteByUser(@Param("user") User user);
}
