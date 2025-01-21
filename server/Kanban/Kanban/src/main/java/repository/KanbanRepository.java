package repository;

import models.Kanban;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KanbanRepository extends JpaRepository<Kanban, Long> {

}
