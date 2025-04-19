package com.example.notekeeper.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/app")
public class VueAppController {

  /**
   * 返回Vue应用页面的控制器方法
   * 所有的/app/**请求都会被转发到Vue的index.html，由Vue Router处理前端路由
   */
  @GetMapping({ "", "/**" })
  public String forwardToVueApp() {
    return "forward:/index.html";
  }
}