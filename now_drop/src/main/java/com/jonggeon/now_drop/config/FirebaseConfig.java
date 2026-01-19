package com.jonggeon.now_drop.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

/**
 * Firebase Cloud Messaging (FCM) 설정
 *
 * Firebase Admin SDK를 초기화합니다.
 * firebase-service-account.json 파일이 src/main/resources에 있어야 합니다.
 */
@Slf4j
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            // firebase-service-account.json 파일 로드
            ClassPathResource resource = new ClassPathResource("firebase-service-account.json");

            if (!resource.exists()) {
                log.error("❌ firebase-service-account.json 파일을 찾을 수 없습니다.");
                log.error("src/main/resources/firebase-service-account.json 파일을 추가해주세요.");
                return;
            }

            InputStream serviceAccount = resource.getInputStream();

            // Firebase 옵션 설정
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            // Firebase 앱이 이미 초기화되어 있지 않은 경우에만 초기화
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                log.info("✅ Firebase initialized successfully!");
            } else {
                log.info("✅ Firebase already initialized");
            }

        } catch (IOException e) {
            log.error("❌ Failed to initialize Firebase", e);
            log.error("firebase-service-account.json 파일을 확인해주세요.");
        }
    }
}
