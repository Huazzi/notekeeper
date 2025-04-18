package com.example.notekeeper.repository;

import com.example.notekeeper.model.Note;
import com.example.notekeeper.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    // 查找特定用户的所有笔记并按是否置顶和更新时间排序
    List<Note> findByUserOrderByIsPinnedDescUpdatedAtDesc(User user);

    // 根据标题或内容搜索特定用户的笔记
    List<Note> findByUserAndTitleContainingOrUserAndContentContainingOrderByIsPinnedDescUpdatedAtDesc(
            User user1, String title, User user2, String content);
}