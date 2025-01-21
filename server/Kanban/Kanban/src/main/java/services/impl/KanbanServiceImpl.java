package services.impl;

import dto.KanbanDto;
import models.Kanban;
import models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.KanbanRepository;
import repository.UserRepository;
import services.KanbanService;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
public class KanbanServiceImpl implements KanbanService {
    @Autowired
    private KanbanRepository kanbanRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public void addKanban(KanbanDto kanbanDto) {
        User user = userRepository.findById(kanbanDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<String> dates = user.getKanbanDates();
        dates.add(new Date().toString());
        user.setKanbanDates(dates);
        userRepository.save(user);

        Kanban kanban = mapToKanban(kanbanDto);
        kanbanRepository.save(kanban);
    }

    @Override
    public void deleteKanban(Long id) {
        kanbanRepository.deleteById(id);
    }

    @Override
    public List<Kanban> findMyKanbans(Long id) {
        //System.out.println(Arrays.toString(new int[]{1, 2, 3}).length());
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return kanbanRepository.findAll().stream()
                .filter(kanban -> kanban.getUser().equals(user))
                .sorted((k1, k2) -> k2.getCreatedAt().compareTo(k1.getCreatedAt()))
                .toList();
    }

    @Override
    public void updateKanbanStatus(KanbanDto kanbanDto) {
        Kanban kanban  = kanbanRepository.findById(kanbanDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Kanban not found"));
        kanban.setStatus(kanbanDto.getStatus());
        kanbanRepository.save(kanban);

        User user = userRepository.findById(kanbanDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setResolvedKanbans(user.getResolvedKanbans() == null ? 1 : user.getResolvedKanbans() + 1);
        userRepository.save(user);
    }

    private KanbanDto mapToKanbanDto(Kanban kanban) {
        return KanbanDto.builder()
                .id(kanban.getId())
                .userId(kanban.getUser().getId())
                .title(kanban.getTitle())
                .description(kanban.getDescription())
                .deadline(kanban.getDeadline())
                .status(kanban.getStatus())
                .createdAt(kanban.getCreatedAt().toString())
                .updatedAt(kanban.getUpdatedAt().toString())
                .build();
    }
    private Kanban mapToKanban(KanbanDto kanbanDto) {
        User user = userRepository.findById(kanbanDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return Kanban.builder()
                .user(user)
                .title(kanbanDto.getTitle())
                .description(kanbanDto.getDescription())
                .deadline(kanbanDto.getDeadline())
                .status(kanbanDto.getStatus())
                .label(kanbanDto.getLabel())
                //.createdAt(kanbanDto.getCreatedAt())
                //.updatedAt(kanbanDto.getUpdatedAt())
                .build();
    }
}
