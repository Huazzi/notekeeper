package com.example.notekeeper.controller.api;

import com.example.notekeeper.model.User;
import com.example.notekeeper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {

  @Autowired
  private UserService userService;

  @Autowired
  private AuthenticationManager authenticationManager;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
    try {
      String username = credentials.get("username");
      String password = credentials.get("password");

      // 认证用户
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(username, password));

      // 设置认证信息
      SecurityContextHolder.getContext().setAuthentication(authentication);

      // 返回用户信息
      User user = userService.findByUsername(username)
          .orElseThrow(() -> new RuntimeException("User not found"));

      return ResponseEntity.ok(user);
    } catch (AuthenticationException e) {
      Map<String, String> response = new HashMap<>();
      response.put("message", "用户名或密码错误");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody User user) {
    try {
      User registeredUser = userService.registerUser(user);
      return ResponseEntity.ok(registeredUser);
    } catch (Exception e) {
      Map<String, String> response = new HashMap<>();
      response.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  @GetMapping("/current-user")
  public ResponseEntity<?> currentUser(Authentication authentication) {
    if (authentication == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    User user = userService.findByUsername(authentication.getName())
        .orElseThrow(() -> new RuntimeException("User not found"));

    return ResponseEntity.ok(user);
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout() {
    SecurityContextHolder.clearContext();
    return ResponseEntity.ok().build();
  }

  @PostMapping("/profile/update")
  public ResponseEntity<?> updateProfile(@RequestBody User user, Authentication authentication) {
    try {
      User currentUser = userService.findByUsername(authentication.getName())
          .orElseThrow(() -> new RuntimeException("User not found"));

      // 只更新允许的字段
      currentUser.setEmail(user.getEmail());
      currentUser.setFullName(user.getFullName());

      User updatedUser = userService.updateUser(currentUser);
      return ResponseEntity.ok(updatedUser);
    } catch (Exception e) {
      Map<String, String> response = new HashMap<>();
      response.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  @PostMapping("/profile/avatar")
  public ResponseEntity<?> updateAvatar(@RequestParam("avatar") MultipartFile file, Authentication authentication) {
    try {
      // 验证文件类型
      String contentType = file.getContentType();
      if (contentType == null || !contentType.startsWith("image/")) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "只能上传图片文件");
        return ResponseEntity.badRequest().body(response);
      }

      // 验证文件大小（比如最大5MB）
      if (file.getSize() > 5 * 1024 * 1024) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "文件大小不能超过5MB");
        return ResponseEntity.badRequest().body(response);
      }

      User currentUser = userService.findByUsername(authentication.getName())
          .orElseThrow(() -> new RuntimeException("User not found"));

      String avatarUrl = handleAvatarUpload(file);
      userService.updateAvatar(currentUser.getId(), avatarUrl);

      Map<String, String> response = new HashMap<>();
      response.put("avatarUrl", avatarUrl);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, String> response = new HashMap<>();
      response.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  private String handleAvatarUpload(MultipartFile file) throws IOException {
    // 使用uploads目录作为上传目录
    String avatarDir = "uploads/avatars/";

    // 生成文件名
    String originalFilename = file.getOriginalFilename();
    String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf("."))
        : ".jpg";
    String fileName = UUID.randomUUID() + fileExtension;

    // 创建目录
    Path uploadPath = Paths.get(avatarDir);
    if (!Files.exists(uploadPath)) {
      Files.createDirectories(uploadPath);
    }

    // 保存文件
    Path filePath = uploadPath.resolve(fileName);
    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

    // 返回可访问的URL路径
    return "/uploads/avatars/" + fileName;
  }
}