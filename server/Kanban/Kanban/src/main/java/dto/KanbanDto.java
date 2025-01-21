package dto;

import lombok.Builder;
import lombok.Data;
import models.User;

@Data
@Builder
public class KanbanDto {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String deadline;
    private String status;
    private String label;
    private String createdAt;
    private String updatedAt;
}
