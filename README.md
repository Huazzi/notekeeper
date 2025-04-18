# 📝 NoteKeeper

📝 NoteKeeper - 在线便签 
> 自己做的一个练手项目，结构功能比较简单，主要用于 Springboot+MySQL 后端的部署练习。

### 预览
1. 主界面
![notekeeper-home](https://cdn.jsdelivr.net/gh/Huazzi/myImg@main/projects/notekeeper-home.png)
2. 查看便签
![notekeeper-papers](https://cdn.jsdelivr.net/gh/Huazzi/myImg@main/projects/notekeeper-papers.png)
3. 个人资料
![notekeeper-profile](https://cdn.jsdelivr.net/gh/Huazzi/myImg@main/projects/notekeeper-profile.png)
4. 登录界面
![notekeeper-login](https://cdn.jsdelivr.net/gh/Huazzi/myImg@main/projects/notekeeper-login.png)
5. 注册界面
![notekeeper-register](https://cdn.jsdelivr.net/gh/Huazzi/myImg@main/projects/notekeeper-register.png)

### 主要项目结构

```text
notekeeper/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── notekeeper/
│   │   │               ├── NoteKeeperApplication.java
│   │   │               ├── controller/
│   │   │               │   └── NoteController.java
│   │   │               ├── model/
│   │   │               │   └── Note.java
│   │   │               ├── repository/
│   │   │               │   └── NoteRepository.java
│   │   │               └── service/
│   │   │                   └── NoteService.java
│   │   └── resources/
│   │       ├── application.properties      # 主配置（共享配置）
│   │       ├── application-dev.properties  # 开发环境配置（基于你提供的配置）
│   │       ├── application-prod.properties # 生产环境配置
│   │       ├── static/
│   │       │   ├── css/
│   │       │   │   └── style.css
│   │       │   └── js/
│   │       │       └── script.js
│   │       └── templates/
│   │           └── index.html
└── pom.xml
```
