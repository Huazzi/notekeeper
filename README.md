# 📝 NoteKeeper

📝 NoteKeeper - 标签管理

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