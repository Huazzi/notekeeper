package com.example.notekeeper.controller;

import com.example.notekeeper.model.User;
import com.example.notekeeper.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String loginPage(@RequestParam(required = false) String error,
            @RequestParam(required = false) String logout,
            Model model) {
        if (error != null) {
            model.addAttribute("errorMsg", "用户名或密码错误");
        }

        if (logout != null) {
            model.addAttribute("logoutMsg", "您已成功退出系统");
        }

        return "login";
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute User user, RedirectAttributes redirectAttributes) {
        try {
            userService.registerUser(user);
            redirectAttributes.addFlashAttribute("successMsg", "注册成功，请登录");
            return "redirect:/login";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMsg", e.getMessage());
            return "redirect:/register";
        }
    }

    @GetMapping("/profile")
    public String profile(Model model, Authentication authentication) {
        User currentUser = userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        model.addAttribute("user", currentUser);
        return "profile";
    }

    @PostMapping("/profile/update")
    public String updateProfile(@ModelAttribute User user, RedirectAttributes redirectAttributes,
            Authentication authentication) {
        try {
            User currentUser = userService.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 只更新允许的字段
            currentUser.setEmail(user.getEmail());
            currentUser.setFullName(user.getFullName());

            userService.updateUser(currentUser);
            redirectAttributes.addFlashAttribute("successMsg", "个人资料更新成功");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMsg", e.getMessage());
        }
        return "redirect:/profile";
    }

    @PostMapping("/profile/avatar")
    @ResponseBody
    public Map<String, Object> updateAvatar(@RequestParam("avatar") MultipartFile file, Authentication authentication) {
        try {
            // 验证文件类型
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return Map.of("success", false, "message", "只能上传图片文件");
            }

            // 验证文件大小（比如最大5MB）
            if (file.getSize() > 5 * 1024 * 1024) {
                return Map.of("success", false, "message", "文件大小不能超过5MB");
            }

            User currentUser = userService.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String avatarUrl = handleAvatarUpload(file);
            userService.updateAvatar(currentUser.getId(), avatarUrl);

            return Map.of("success", true, "avatarUrl", avatarUrl);
        } catch (Exception e) {
            return Map.of("success", false, "message", e.getMessage());
        }
    }

    private String handleAvatarUpload(MultipartFile file) throws IOException {
        // 获取项目根目录
        String projectRoot = System.getProperty("user.dir");
        String uploadDir = projectRoot + "/uploads/avatars/";

        // 生成文件名
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileName = UUID.randomUUID().toString() + fileExtension;

        // 创建目录
        Path uploadPath = Paths.get(uploadDir);
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