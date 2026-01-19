package com.jonggeon.now_drop.service;

import com.google.firebase.messaging.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Firebase Cloud Messaging (FCM) 서비스
 *
 * 푸시 알림 전송을 담당합니다.
 */
@Slf4j
@Service
public class FCMService {

    /**
     * 단일 디바이스에 푸시 알림 전송
     *
     * @param deviceToken FCM 디바이스 토큰
     * @param title 알림 제목
     * @param body 알림 내용
     * @return 전송 결과 메시지 ID
     */
    public String sendNotification(String deviceToken, String title, String body) {
        return sendNotification(deviceToken, title, body, null);
    }

    /**
     * 단일 디바이스에 데이터와 함께 푸시 알림 전송
     *
     * @param deviceToken FCM 디바이스 토큰
     * @param title 알림 제목
     * @param body 알림 내용
     * @param data 추가 데이터 (nullable)
     * @return 전송 결과 메시지 ID
     */
    public String sendNotification(String deviceToken, String title, String body, Map<String, String> data) {
        try {
            // 메시지 빌더 생성
            Message.Builder messageBuilder = Message.builder()
                    .setToken(deviceToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());

            // 추가 데이터가 있으면 추가
            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            // Android 설정
            messageBuilder.setAndroidConfig(AndroidConfig.builder()
                    .setPriority(AndroidConfig.Priority.HIGH)
                    .setNotification(AndroidNotification.builder()
                            .setSound("default")
                            .setColor("#3b82f6") // 알림 색상
                            .setChannelId("default") // 알림 채널
                            .build())
                    .build());

            // iOS 설정
            messageBuilder.setApnsConfig(ApnsConfig.builder()
                    .setAps(Aps.builder()
                            .setSound("default")
                            .setBadge(1) // 배지 숫자
                            .setContentAvailable(true) // 백그라운드 처리 가능
                            .build())
                    .build());

            Message message = messageBuilder.build();

            // FCM 전송
            String response = FirebaseMessaging.getInstance().send(message);
            log.info("✅ Successfully sent message: {} to token: {}", response, maskToken(deviceToken));

            return response;

        } catch (FirebaseMessagingException e) {
            log.error("❌ Failed to send FCM message to token: {}", maskToken(deviceToken), e);
            throw new RuntimeException("FCM 전송 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 여러 디바이스에 푸시 알림 전송 (배치)
     *
     * @param deviceTokens FCM 디바이스 토큰 리스트
     * @param title 알림 제목
     * @param body 알림 내용
     * @return 전송 결과 (성공/실패 개수)
     */
    public BatchResponse sendBatchNotification(List<String> deviceTokens, String title, String body) {
        return sendBatchNotification(deviceTokens, title, body, null);
    }

    /**
     * 여러 디바이스에 데이터와 함께 푸시 알림 전송 (배치)
     *
     * @param deviceTokens FCM 디바이스 토큰 리스트
     * @param title 알림 제목
     * @param body 알림 내용
     * @param data 추가 데이터 (nullable)
     * @return 전송 결과 (성공/실패 개수)
     */
    public BatchResponse sendBatchNotification(List<String> deviceTokens, String title, String body, Map<String, String> data) {
        try {
            if (deviceTokens == null || deviceTokens.isEmpty()) {
                log.warn("⚠️ No device tokens provided for batch notification");
                return null;
            }

            // 멀티캐스트 메시지 빌더 생성
            MulticastMessage.Builder messageBuilder = MulticastMessage.builder()
                    .addAllTokens(deviceTokens)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build());

            // 추가 데이터가 있으면 추가
            if (data != null && !data.isEmpty()) {
                messageBuilder.putAllData(data);
            }

            // Android 설정
            messageBuilder.setAndroidConfig(AndroidConfig.builder()
                    .setPriority(AndroidConfig.Priority.HIGH)
                    .setNotification(AndroidNotification.builder()
                            .setSound("default")
                            .setColor("#3b82f6")
                            .setChannelId("default")
                            .build())
                    .build());

            // iOS 설정
            messageBuilder.setApnsConfig(ApnsConfig.builder()
                    .setAps(Aps.builder()
                            .setSound("default")
                            .setBadge(1)
                            .setContentAvailable(true)
                            .build())
                    .build());

            MulticastMessage message = messageBuilder.build();

            // FCM 배치 전송
            BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);

            log.info("✅ Batch notification sent: {} success, {} failures out of {} tokens",
                    response.getSuccessCount(),
                    response.getFailureCount(),
                    deviceTokens.size());

            // 실패한 토큰 로깅
            if (response.getFailureCount() > 0) {
                List<SendResponse> responses = response.getResponses();
                for (int i = 0; i < responses.size(); i++) {
                    if (!responses.get(i).isSuccessful()) {
                        log.error("❌ Failed to send to token {}: {}",
                                maskToken(deviceTokens.get(i)),
                                responses.get(i).getException().getMessage());
                    }
                }
            }

            return response;

        } catch (FirebaseMessagingException e) {
            log.error("❌ Failed to send batch FCM messages", e);
            throw new RuntimeException("FCM 배치 전송 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 데이터 전용 메시지 전송 (알림 없이 데이터만 전송)
     * 백그라운드 처리용
     *
     * @param deviceToken FCM 디바이스 토큰
     * @param data 전송할 데이터
     * @return 전송 결과 메시지 ID
     */
    public String sendDataMessage(String deviceToken, Map<String, String> data) {
        try {
            Message message = Message.builder()
                    .setToken(deviceToken)
                    .putAllData(data)
                    .setAndroidConfig(AndroidConfig.builder()
                            .setPriority(AndroidConfig.Priority.HIGH)
                            .build())
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setContentAvailable(true)
                                    .build())
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("✅ Data message sent: {} to token: {}", response, maskToken(deviceToken));

            return response;

        } catch (FirebaseMessagingException e) {
            log.error("❌ Failed to send data message to token: {}", maskToken(deviceToken), e);
            throw new RuntimeException("FCM 데이터 메시지 전송 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 특정 토픽에 푸시 알림 전송
     *
     * @param topic 토픽 이름 (예: "all", "route-updates")
     * @param title 알림 제목
     * @param body 알림 내용
     * @return 전송 결과 메시지 ID
     */
    public String sendToTopic(String topic, String title, String body) {
        try {
            Message message = Message.builder()
                    .setTopic(topic)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .setAndroidConfig(AndroidConfig.builder()
                            .setPriority(AndroidConfig.Priority.HIGH)
                            .setNotification(AndroidNotification.builder()
                                    .setSound("default")
                                    .setColor("#3b82f6")
                                    .build())
                            .build())
                    .setApnsConfig(ApnsConfig.builder()
                            .setAps(Aps.builder()
                                    .setSound("default")
                                    .build())
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("✅ Topic message sent: {} to topic: {}", response, topic);

            return response;

        } catch (FirebaseMessagingException e) {
            log.error("❌ Failed to send topic message to: {}", topic, e);
            throw new RuntimeException("FCM 토픽 메시지 전송 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 토큰 마스킹 (로그용)
     * 토큰의 앞 10자와 뒤 10자만 표시
     */
    private String maskToken(String token) {
        if (token == null || token.length() < 20) {
            return "***";
        }
        return token.substring(0, 10) + "..." + token.substring(token.length() - 10);
    }
}
