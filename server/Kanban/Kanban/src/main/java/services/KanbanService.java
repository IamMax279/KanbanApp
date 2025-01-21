package services;

import dto.KanbanDto;
import models.Kanban;

import java.util.List;

public interface KanbanService {
    void addKanban(KanbanDto kanbanDto);
    void deleteKanban(Long id);
    List<Kanban> findMyKanbans(Long id);
    void updateKanbanStatus(KanbanDto kanbanDto);
}