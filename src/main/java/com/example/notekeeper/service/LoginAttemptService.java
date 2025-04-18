package com.example.notekeeper.service;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class LoginAttemptService {
  private final int MAX_ATTEMPTS = 5;
  private LoadingCache<String, Integer> attemptsCache;

  public LoginAttemptService() {
    attemptsCache = CacheBuilder.newBuilder()
        .expireAfterWrite(1, TimeUnit.HOURS)
        .build(new CacheLoader<>() {
          @Override
          public Integer load(String key) {
            return 0;
          }
        });
  }

  public void loginSucceeded(String username) {
    attemptsCache.invalidate(username);
  }

  public void loginFailed(String username) {
    int attempts = 0;
    try {
      attempts = attemptsCache.get(username);
    } catch (ExecutionException e) {
      attempts = 0;
    }
    attempts++;
    attemptsCache.put(username, attempts);
  }

  public boolean isBlocked(String username) {
    try {
      return attemptsCache.get(username) >= MAX_ATTEMPTS;
    } catch (ExecutionException e) {
      return false;
    }
  }
}