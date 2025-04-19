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

    // 移除所有API端点方法，因为这些已经在NoteApiController中实现
    // 这样可以避免URL映射冲突
}