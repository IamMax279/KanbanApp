package controllers;

import dto.KanbanDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import services.KanbanService;
import services.JWTService;

@RestController
public class KanbanController {
    @Autowired
    private KanbanService kanbanService;
    @Autowired
    private JWTService jwtService;

    @PostMapping("/addkanban")
    public ResponseEntity<String> addKanban(@RequestBody KanbanDto kanbanDto, @RequestHeader("Authorization") String token) {
        if (kanbanDto.getUserId().toString().isEmpty() || kanbanDto.getTitle().isEmpty() || kanbanDto.getLabel().isEmpty() || kanbanDto.getDeadline().isEmpty() || kanbanDto.getStatus().isEmpty()) {
            return ResponseEntity.status(403).body("Missing data");
        }

        if (token == null || !jwtService.validateToken(token.substring(7))) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        kanbanService.addKanban(kanbanDto);
        return ResponseEntity.ok("Kanban added successfully");
    }
    @GetMapping("/getmykanbans")
    public ResponseEntity<?> getMyKanbans(@RequestHeader("Authorization") String token) {
        if (token == null || !jwtService.validateToken(token.substring(7))) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        return ResponseEntity.ok(kanbanService.findMyKanbans(jwtService.extractUserId(token.substring(7))));
    }
    @DeleteMapping("/deletekanban")
    public ResponseEntity<String> deleteKanban(@RequestParam Long id) {
        kanbanService.deleteKanban(id);
        return ResponseEntity.ok("Kanban deleted successfully");
    }
    @PutMapping("/updatekanbanstatus")
    public ResponseEntity<String> updateKanbanStatus(@RequestBody KanbanDto kanbanDto) {
        kanbanService.updateKanbanStatus(kanbanDto);
        return ResponseEntity.ok("Kanban status updated successfully");
    }
}