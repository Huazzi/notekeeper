package com.example.notekeeper.controller;

import com.example.notekeeper.model.Note;
import com.example.notekeeper.model.User;
import com.example.notekeeper.service.NoteService;
import com.example.notekeeper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class NoteController {

    private final NoteService noteService;
    private final UserService userService;

    @Autowired
    public NoteController(NoteService noteService, UserService userService) {
        this.noteService = noteService;
        this.userService = userService;
    }

    // 获取当前认证用户
    private User getCurrentUser(Authentication authentication) {
        return userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 返回主页视图
    @GetMapping("/")
    public String index(Model model, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        model.addAttribute("notes", noteService.getAllNotesByUser(currentUser));
        model.addAttribute("newNote", new Note());
        model.addAttribute("user", currentUser);
        return "index";
    }

    // API: 获取当前用户的所有笔记
    @GetMapping("/api/notes")
    @ResponseBody
    public List<Note> getAllNotes(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        return noteService.getAllNotesByUser(currentUser);
    }

    // API: 根据ID获取笔记
    @GetMapping("/api/notes/{id}")
    @ResponseBody
    public ResponseEntity<Note> getNoteById(@PathVariable Long id, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        Note note = noteService.getNoteById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        // 检查笔记所有权
        if (!note.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(note);
    }

    // API: 添加新笔记
    @PostMapping("/api/notes")
    @ResponseBody
    public Note createNote(@RequestBody Note note, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        note.setUser(currentUser);
        return noteService.saveNote(note);
    }

    // API: 更新笔记
    @PutMapping("/api/notes/{id}")
    @ResponseBody
    public Note updateNote(@PathVariable Long id, @RequestBody Note noteDetails, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        return noteService.updateNote(id, noteDetails, currentUser);
    }

    // API: 删除笔记
    @DeleteMapping("/api/notes/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteNote(@PathVariable Long id, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        noteService.deleteNote(id, currentUser);
        return ResponseEntity.ok().build();
    }

    // API: 搜索笔记
    @GetMapping("/api/notes/search")
    @ResponseBody
    public List<Note> searchNotes(@RequestParam String query, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        return noteService.searchNotes(query, currentUser);
    }

    // API: 切换置顶状态
    @PutMapping("/api/notes/{id}/toggle-pin")
    @ResponseBody
    public Note togglePinStatus(@PathVariable Long id, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        return noteService.togglePinStatus(id, currentUser);
    }
}