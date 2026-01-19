package com.jonggeon.now_drop.controller;

import com.jonggeon.now_drop.service.FCMService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * FCM 푸시 알림 컨트롤러
 *
 * 테스트 및 실제 푸시 알림 전송을 위한 API를 제공합니다.
 */
@Slf4j
@RestController
@RequestMapping("/api/fcm")
@RequiredArgsConstructor
public class FCMController {

    private final FCMService fcmService;

    /**
     * FCM 토큰 등록
     * 프론트엔드에서 FCM 토큰을 서버로 전송할 때 사용
     *
     * POST /api/fcm/register
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerToken(@RequestBody TokenRegistrationRequest request) {
        log.info("📱 FCM token registration request from platform: {}", request.getPlatform());
        log.info("Token: {}...", request.getToken().substring(0, Math.min(20, request.getToken().length())));

        // TODO: DB에 토큰 저장
        // userRepository.saveOrUpdateFCMToken(userId, request.getToken(), request.getPlatform());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "FCM 토큰이 성공적으로 등록되었습니다");

        return ResponseEntity.ok(response);
    }

    /**
     * 테스트 푸시 알림 전송
     * 단일 디바이스에 테스트 알림 전송
     *
     * POST /api/fcm/test
     */
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> sendTestNotification(@RequestBody TestNotificationRequest request) {
        log.info("🧪 Test notification request");

        try {
            String messageId = fcmService.sendNotification(
                    request.getToken(),
                    request.getTitle(),
                    request.getBody()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messageId", messageId);
            response.put("message", "테스트 알림이 성공적으로 전송되었습니다");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Failed to send test notification", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 데이터와 함께 푸시 알림 전송
     *
     * POST /api/fcm/send-with-data
     */
    @PostMapping("/send-with-data")
    public ResponseEntity<Map<String, Object>> sendNotificationWithData(
            @RequestBody NotificationWithDataRequest request) {
        log.info("📤 Sending notification with data");

        try {
            String messageId = fcmService.sendNotification(
                    request.getToken(),
                    request.getTitle(),
                    request.getBody(),
                    request.getData()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messageId", messageId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Failed to send notification with data", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 배치 푸시 알림 전송
     * 여러 디바이스에 동시에 알림 전송
     *
     * POST /api/fcm/batch
     */
    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> sendBatchNotification(
            @RequestBody BatchNotificationRequest request) {
        log.info("📤 Batch notification request for {} devices", request.getTokens().size());

        try {
            var batchResponse = fcmService.sendBatchNotification(
                    request.getTokens(),
                    request.getTitle(),
                    request.getBody()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("successCount", batchResponse.getSuccessCount());
            response.put("failureCount", batchResponse.getFailureCount());
            response.put("totalCount", request.getTokens().size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Failed to send batch notification", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * 토픽에 푸시 알림 전송
     *
     * POST /api/fcm/topic
     */
    @PostMapping("/topic")
    public ResponseEntity<Map<String, Object>> sendToTopic(@RequestBody TopicNotificationRequest request) {
        log.info("📤 Topic notification request to: {}", request.getTopic());

        try {
            String messageId = fcmService.sendToTopic(
                    request.getTopic(),
                    request.getTitle(),
                    request.getBody()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messageId", messageId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ Failed to send topic notification", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // ========== DTO 클래스 ==========

    /**
     * FCM 토큰 등록 요청
     */
    public static class TokenRegistrationRequest {
        private String token;
        private String platform; // "ios" or "android"

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getPlatform() {
            return platform;
        }

        public void setPlatform(String platform) {
            this.platform = platform;
        }
    }

    /**
     * 테스트 알림 전송 요청
     */
    public static class TestNotificationRequest {
        private String token;
        private String title;
        private String body;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }
    }

    /**
     * 데이터와 함께 알림 전송 요청
     */
    public static class NotificationWithDataRequest {
        private String token;
        private String title;
        private String body;
        private Map<String, String> data;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }

        public Map<String, String> getData() {
            return data;
        }

        public void setData(Map<String, String> data) {
            this.data = data;
        }
    }

    /**
     * 배치 알림 전송 요청
     */
    public static class BatchNotificationRequest {
        private List<String> tokens;
        private String title;
        private String body;

        public List<String> getTokens() {
            return tokens;
        }

        public void setTokens(List<String> tokens) {
            this.tokens = tokens;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }
    }

    /**
     * 토픽 알림 전송 요청
     */
    public static class TopicNotificationRequest {
        private String topic;
        private String title;
        private String body;

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }
    }
}
