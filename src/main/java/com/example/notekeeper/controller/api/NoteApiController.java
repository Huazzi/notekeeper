package com.example.notekeeper.controller.api;

import com.example.notekeeper.model.Note;
import com.example.notekeeper.model.User;
import com.example.notekeeper.service.NoteService;
import com.example.notekeeper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteApiController {

  @Autowired
  private NoteService noteService;

  @Autowired
  private UserService userService;

  // 获取当前认证用户
  private User getCurrentUser(Authentication authentication) {
    return userService.findByUsername(authentication.getName())
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  // 获取当前用户的所有笔记
  @GetMapping
  public List<Note> getAllNotes(Authentication authentication) {
    User currentUser = getCurrentUser(authentication);
    return noteService.getAllNotesByUser(currentUser);
  }

  // 根据ID获取笔记
  @GetMapping("/{id}")
  public ResponseEntity<Note> getNoteById(@PathVariable Long id, Authentication authentication) {
    User currentUser = getCurrentUser(authentication);
    Note note = noteService.getNoteById(id)
        .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

    // 检查笔记所有权
    if (!note.getUser().getId().equals(currentUser.getId())) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 禁止访问
    }

    return ResponseEntity.ok(note);
  }

  // 添加新笔记
  @PostMapping
  public Note createNote(@RequestBody Note note, Authentication authentication) {
    User currentUser = getCurrentUser(authentication);
    note.setUser(currentUser);
    return noteService.saveNote(note);
  }

  // 更新笔记
  @PutMapping("/{id}")
  public ResponseEntity<?> updateNote(@PathVariable Long id, @RequestBody Note noteDetails,
      Authentication authentication) {
    try {
      User currentUser = getCurrentUser(authentication);
      Note updatedNote = noteService.updateNote(id, noteDetails, currentUser);
      return ResponseEntity.ok(updatedNote);
    } catch (Exception e) {
      Map<String, String> response = new HashMap<>();
      response.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  // 删除笔记
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteNote(@PathVariable Long id, Authentication authentication) {
    try {
      User currentUser = getCurrentUser(authentication);
      noteService.deleteNote(id, currentUser);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      Map<String, String> response = new HashMap<>();
      response.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  // 搜索笔记
  @GetMapping("/search")
  public List<Note> searchNotes(@RequestParam String query, Authentication authentication) {
    User currentUser = getCurrentUser(authentication);
    return noteService.searchNotes(query, currentUser);
  }

  // 切换置顶状态
  @PutMapping("/{id}/toggle-pin")
  public ResponseEntity<?> togglePinStatus(@PathVariable Long id, Authentication authentication) {
    try {
      User currentUser = getCurrentUser(authentication);
      Note updatedNote = noteService.togglePinStatus(id, currentUser);
      return ResponseEntity.ok(updatedNote);
    } catch (Exception e) {
      Map<String, String> response = new HashMap<>();
      response.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }
}