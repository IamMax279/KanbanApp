package repository;

import models.Kanban;
import models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KanbanRepository extends JpaRepository<Kanban, Long> {
    void deleteByUser(User user);
}
