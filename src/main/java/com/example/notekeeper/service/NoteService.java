package com.example.notekeeper.service;

import com.example.notekeeper.model.Note;
import com.example.notekeeper.model.User;
import com.example.notekeeper.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    @Autowired
    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getAllNotesByUser(User user) {
        return noteRepository.findByUserOrderByIsPinnedDescUpdatedAtDesc(user);
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public Note saveNote(Note note) {
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, Note noteDetails, User currentUser) {
        Note existingNote = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        // 检查笔记是否属于当前用户
        if (!existingNote.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("您无权修改此笔记");
        }

        existingNote.setTitle(noteDetails.getTitle());
        existingNote.setContent(noteDetails.getContent());
        existingNote.setColor(noteDetails.getColor());
        existingNote.setIsPinned(noteDetails.getIsPinned());

        return noteRepository.save(existingNote);
    }

    public void deleteNote(Long id, User currentUser) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        // 检查笔记是否属于当前用户
        if (!note.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("您无权删除此笔记");
        }

        noteRepository.deleteById(id);
    }

    public List<Note> searchNotes(String query, User user) {
        return noteRepository.findByUserAndTitleContainingOrUserAndContentContainingOrderByIsPinnedDescUpdatedAtDesc(
                user, query, user, query);
    }

    public Note togglePinStatus(Long id, User currentUser) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        // 检查笔记是否属于当前用户
        if (!note.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("您无权修改此笔记");
        }

        note.setIsPinned(!note.getIsPinned());
        return noteRepository.save(note);
    }
}