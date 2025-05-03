package controllers;

import dto.KanbanDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import services.KanbanService;
import services.JWTService;

import java.util.Map;

@RestController
public class KanbanController {
    @Autowired
    private KanbanService kanbanService;
    @Autowired
    private JWTService jwtService;

    @PostMapping("/addkanban")
    public ResponseEntity<Map<String, String>> addKanban(@RequestBody KanbanDto kanbanDto, @RequestHeader("Authorization") String token) {
        if (kanbanDto.getUserId().toString().isEmpty() || kanbanDto.getTitle().isEmpty() || kanbanDto.getLabel().isEmpty() || kanbanDto.getDeadline().isEmpty() || kanbanDto.getStatus().isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("message", "Missing data"));
        }

        if (token == null || !jwtService.validateToken(token.substring(7))) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        kanbanService.addKanban(kanbanDto);
        return ResponseEntity.ok(Map.of("message", "Kanban added successfully"));
    }
    @GetMapping("/getmykanbans")
    public ResponseEntity<?> getMyKanbans(@RequestHeader("Authorization") String token) {
        if (token == null || !jwtService.validateToken(token.substring(7))) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        return ResponseEntity.ok(kanbanService.findMyKanbans(jwtService.extractUserId(token.substring(7))));
    }
    @DeleteMapping("/deletekanban")
    public ResponseEntity<Map<String, String>> deleteKanban(@RequestParam Long id) {
        kanbanService.deleteKanban(id);
        return ResponseEntity.ok(Map.of("message", "Kanban deleted successfully"));
    }
    @PutMapping("/updatekanbanstatus")
    public ResponseEntity<Map<String, String>> updateKanbanStatus(@RequestBody KanbanDto kanbanDto) {
        kanbanService.updateKanbanStatus(kanbanDto);
        return ResponseEntity.ok(Map.of("message", "Kanban status updated successfully"));
    }
}