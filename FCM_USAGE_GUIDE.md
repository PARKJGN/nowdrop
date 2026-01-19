# FCM 사용 가이드

> 작성일: 2025-12-02
>
> 프론트엔드와 백엔드의 FCM 초기화 코드가 모두 작성되었습니다.

---

## 📁 작성된 파일 목록

### 프론트엔드
```
frontend/
├─ src/services/fcm.js          # FCM 유틸리티 함수들
└─ App.js                        # FCM 초기화 코드 추가됨
```

### 백엔드
```
now_drop/
└─ src/main/java/com/jonggeon/now_drop/
   ├─ config/FirebaseConfig.java      # Firebase 초기화
   ├─ service/FCMService.java         # FCM 전송 서비스
   └─ controller/FCMController.java   # FCM API 컨트롤러
```

---

## 🚀 시작하기

### 1. 필수 패키지 설치

#### 프론트엔드
```bash
cd frontend

# FCM 패키지 설치
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging
npm install @react-native-async-storage/async-storage
```

#### 백엔드 (build.gradle)
```gradle
dependencies {
    // Firebase Admin SDK
    implementation 'com.google.firebase:firebase-admin:9.2.0'

    // Lombok (편의)
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'

    // Spring Boot Web
    implementation 'org.springframework.boot:spring-boot-starter-web'
}
```

### 2. Firebase 서비스 계정 키 추가

1. Firebase Console에서 다운로드한 `firebase-service-account.json` 파일을 다음 위치에 배치:
   ```
   now_drop/src/main/resources/firebase-service-account.json
   ```

2. `.gitignore`에 추가 (중요!):
   ```
   **/firebase-service-account.json
   ```

---

## 📱 테스트 방법

### Step 1: 프론트엔드 앱 실행

```bash
cd frontend
npm start
```

앱이 실행되면 콘솔 로그에서 FCM 토큰을 확인하세요:
```
✅ FCM initialized successfully
📱 New FCM Token: eXXXXXXXXXXXXXXXXXXXX...
📤 Sending FCM token to server: eXXXXXXX...
```

**FCM 토큰을 복사**하세요!

### Step 2: 백엔드 서버 실행

```bash
cd now_drop
./gradlew bootRun
```

서버 로그에서 Firebase 초기화 확인:
```
✅ Firebase initialized successfully!
```

### Step 3: 테스트 푸시 전송

#### Postman 또는 curl 사용

**기본 테스트 푸시:**
```bash
curl -X POST http://localhost:8080/api/fcm/test \
  -H "Content-Type: application/json" \
  -d '{
    "token": "여기에_앱에서_복사한_FCM_토큰_붙여넣기",
    "title": "테스트 알림",
    "body": "FCM 연동이 성공했습니다! 🎉"
  }'
```

**응답 예시:**
```json
{
  "success": true,
  "messageId": "projects/nowdrop/messages/0:1234567890",
  "message": "테스트 알림이 성공적으로 전송되었습니다"
}
```

### Step 4: 앱에서 알림 확인

- **포그라운드 (앱 실행 중)**: Alert 팝업으로 표시
- **백그라운드/종료**: 알림 센터에 표시

---

## 🔧 API 엔드포인트

### 1. FCM 토큰 등록
프론트엔드에서 자동으로 호출됩니다.

```http
POST /api/fcm/register
Content-Type: application/json

{
  "token": "FCM_DEVICE_TOKEN",
  "platform": "ios" // or "android"
}
```

### 2. 테스트 알림 전송
```http
POST /api/fcm/test
Content-Type: application/json

{
  "token": "FCM_DEVICE_TOKEN",
  "title": "알림 제목",
  "body": "알림 내용"
}
```

### 3. 데이터와 함께 알림 전송
```http
POST /api/fcm/send-with-data
Content-Type: application/json

{
  "token": "FCM_DEVICE_TOKEN",
  "title": "도착 알림",
  "body": "2정거장 전입니다",
  "data": {
    "tripId": "12345",
    "type": "arrival_soon",
    "stationsLeft": "2"
  }
}
```

### 4. 배치 알림 전송 (여러 디바이스)
```http
POST /api/fcm/batch
Content-Type: application/json

{
  "tokens": [
    "TOKEN_1",
    "TOKEN_2",
    "TOKEN_3"
  ],
  "title": "공지사항",
  "body": "새로운 업데이트가 있습니다"
}
```

### 5. 토픽 알림 전송
```http
POST /api/fcm/topic
Content-Type: application/json

{
  "topic": "all",
  "title": "전체 공지",
  "body": "서비스 점검 안내"
}
```

---

## 💡 실전 사용 예제

### 예제 1: 도착 2정거장 전 알림

**백엔드 코드:**
```java
@Service
public class TripNotificationService {

    private final FCMService fcmService;

    public void sendArrivalNotification(String userToken, String stationName, int stationsLeft) {
        Map<String, String> data = new HashMap<>();
        data.put("type", "arrival_soon");
        data.put("stationsLeft", String.valueOf(stationsLeft));
        data.put("nextStation", stationName);

        fcmService.sendNotification(
            userToken,
            "곧 도착합니다",
            stationsLeft + "정거장 전입니다. 하차 준비하세요!",
            data
        );
    }
}
```

### 예제 2: 환승 알림

```java
public void sendTransferNotification(String userToken, String transferStation, String nextLine) {
    Map<String, String> data = new HashMap<>();
    data.put("type", "transfer");
    data.put("station", transferStation);
    data.put("nextLine", nextLine);

    fcmService.sendNotification(
        userToken,
        "환승 안내",
        transferStation + "에서 " + nextLine + "로 환승하세요",
        data
    );
}
```

### 예제 3: 프론트엔드에서 알림 데이터 처리

**App.js:**
```javascript
// 백그라운드/종료 상태에서 알림 클릭 처리
onNotificationOpenedApp((message) => {
  const { type, tripId, stationsLeft } = message.data || {};

  if (type === 'arrival_soon') {
    // Map 화면으로 이동
    navigation.navigate('Map', { tripId });
  } else if (type === 'transfer') {
    // 환승 안내 화면으로 이동
    navigation.navigate('Transfer', { station: message.data.station });
  }
});
```

---

## 🐛 문제 해결

### 1. Firebase 초기화 실패
```
❌ firebase-service-account.json 파일을 찾을 수 없습니다.
```

**해결:**
- `now_drop/src/main/resources/firebase-service-account.json` 파일 확인
- Firebase Console에서 다시 다운로드

### 2. FCM 토큰을 받지 못함
```
❌ No FCM token received
```

**해결:**
- Android: `google-services.json` 파일이 프로젝트 루트에 있는지 확인
- iOS: `GoogleService-Info.plist` 파일이 프로젝트 루트에 있는지 확인
- 앱을 완전히 재시작

### 3. 알림이 전송되지 않음

**체크리스트:**
- [ ] Firebase 프로젝트에 앱이 등록되어 있는지 확인
- [ ] FCM 토큰이 유효한지 확인 (토큰은 만료될 수 있음)
- [ ] 백엔드 서버가 정상 실행 중인지 확인
- [ ] 네트워크 연결 상태 확인

### 4. iOS에서 알림이 표시되지 않음

**해결:**
- Info.plist에 권한 설정 확인
- 앱 설정에서 알림 권한 허용 확인
- APNs 인증서 설정 확인 (프로덕션 빌드 시)

---

## 📊 로그 확인

### 프론트엔드 로그
```javascript
// 성공적인 초기화
✅ FCM Authorization status: 1
📱 New FCM Token: eXXXXXXXXXXX...
✅ FCM initialized successfully
📤 Sending FCM token to server: eXXXXXXX...
✅ FCM token sent to server successfully

// 메시지 수신
📬 FCM Message received (foreground): {...}
🔄 Token refreshed, sending to server...
```

### 백엔드 로그
```
// Firebase 초기화
✅ Firebase initialized successfully!

// 토큰 등록
📱 FCM token registration request from platform: android

// 알림 전송
✅ Successfully sent message: projects/nowdrop/messages/0:1234567890 to token: eXXXXXXXX...XXXXXXXXX
```

---

## 🎯 다음 단계

1. **DB에 FCM 토큰 저장**
   - User 테이블에 `fcm_token`, `platform` 컬럼 추가
   - 토큰 등록 API에서 DB 저장 로직 구현

2. **실제 알림 로직 구현**
   - Segment 판단 로직에서 FCM 호출
   - Redis 중복 방지 로직 적용

3. **배치 알림 최적화**
   - 대량 알림 발송 시 Queue 사용
   - 재시도 로직 구현

4. **모니터링 추가**
   - 알림 전송 성공/실패율 추적
   - 잘못된 토큰 자동 삭제

---

## 📚 참고 자료

- [Firebase Admin SDK - Java](https://firebase.google.com/docs/admin/setup?hl=ko#java)
- [FCM 메시지 구조](https://firebase.google.com/docs/cloud-messaging/concept-options?hl=ko)
- [React Native Firebase](https://rnfirebase.io/)

---

**축하합니다!** 🎉

FCM 연동이 완료되었습니다. 이제 푸시 알림을 자유롭게 전송할 수 있습니다!
