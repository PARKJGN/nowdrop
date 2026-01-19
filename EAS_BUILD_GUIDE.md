# EAS Build로 FCM 개발 빌드 만들기

> 작성일: 2025-12-02
>
> Expo Go 대신 실제 FCM을 사용하기 위한 개발 빌드 가이드

---

## 🎯 왜 EAS Build가 필요한가?

- Expo Go는 네이티브 모듈(`@react-native-firebase`)을 지원하지 않음
- EAS Build로 개발 빌드를 만들면 FCM을 포함한 모든 네이티브 기능 사용 가능
- Hot Reload는 여전히 작동하여 개발 생산성 유지

---

## 📋 사전 준비

### 필수
- [x] Expo 계정 (무료) - https://expo.dev/signup
- [x] 실제 Android 또는 iOS 기기
- [x] Firebase 프로젝트 생성 완료
- [x] `google-services.json` (Android)
- [x] `GoogleService-Info.plist` (iOS, Mac만)

### 선택 (iOS 빌드 시)
- [ ] Apple Developer 계정 ($99/year)
- [ ] Mac 컴퓨터

---

## 🚀 Step 1: EAS CLI 설치 및 로그인

```bash
cd frontend

# EAS CLI 전역 설치
npm install -g eas-cli

# 버전 확인
eas --version

# Expo 계정으로 로그인
eas login
```

---

## 📝 Step 2: 프로젝트 설정

### 2-1. EAS 초기화

```bash
# EAS 프로젝트 초기화 (eas.json 생성)
eas build:configure
```

### 2-2. 필요한 패키지 설치

```bash
# Firebase 패키지
npm install @react-native-firebase/app @react-native-firebase/messaging

# AsyncStorage
npm install @react-native-async-storage/async-storage

# Expo 빌드 프로퍼티
npm install expo-build-properties

# 개발 클라이언트
npx expo install expo-dev-client
```

---

## 🔥 Step 3: Firebase 파일 준비

### Android

1. Firebase Console → 프로젝트 설정 → 앱 → Android 앱
2. `google-services.json` 다운로드
3. 다음 위치에 배치:
   ```
   frontend/google-services.json
   ```

### iOS (Mac만)

1. Firebase Console → 프로젝트 설정 → 앱 → iOS 앱
2. `GoogleService-Info.plist` 다운로드
3. 다음 위치에 배치:
   ```
   frontend/GoogleService-Info.plist
   ```

---

## 📱 Step 4: Android 개발 빌드 실행

### 4-1. 빌드 시작

```bash
eas build --platform android --profile development
```

### 4-2. 빌드 중 선택사항

```
? Would you like to create a new project? (Y/n)
→ Y (Yes) 선택

? Generate a new Android Keystore? (Y/n)
→ Y (Yes) 선택
```

### 4-3. 빌드 진행

- 빌드 진행 상황은 터미널과 웹(https://expo.dev)에서 확인 가능
- **약 10-15분 소요**
- 빌드 로그를 실시간으로 확인할 수 있습니다

### 4-4. 빌드 완료

빌드가 완료되면 다음과 같은 메시지가 표시됩니다:

```
✅ Build finished

Install the build on an Android device:
https://expo.dev/artifacts/eas/...

Or scan this QR code:
[QR CODE]
```

---

## 📲 Step 5: 앱 설치

### 방법 1: QR 코드 (추천)

1. Android 기기에서 카메라 앱 실행
2. QR 코드 스캔
3. 다운로드 링크 클릭
4. APK 설치 (출처 불명 앱 허용 필요)

### 방법 2: 직접 다운로드

```bash
# 빌드 목록 확인
eas build:list

# 최신 빌드 다운로드
eas build:download --platform android --latest

# 다운로드한 APK를 기기로 전송하여 설치
```

---

## 🔌 Step 6: 개발 서버 연결

### 6-1. 개발 서버 시작

```bash
cd frontend
npx expo start --dev-client
```

다음과 같은 출력이 표시됩니다:

```
Starting Metro Bundler

› Metro waiting on exp://192.168.0.10:8081
› Scan the QR code above with Expo Go (Android) or Camera app (iOS)

› Press a │ open Android
› Press w │ open web

› Press r │ reload app
```

### 6-2. 앱에서 연결

**자동 연결 (같은 Wi-Fi):**
1. 설치한 개발 빌드 앱 실행
2. 자동으로 개발 서버 감지
3. 탭하여 연결

**수동 연결:**
1. 앱 실행 → "Enter URL manually" 선택
2. 터미널에 표시된 URL 입력
   - 예: `exp://192.168.0.10:8081`
3. Connect 탭

---

## ✅ Step 7: FCM 테스트

### 7-1. FCM 토큰 확인

앱이 실행되면 Metro 번들러 로그에서 확인:

```bash
LOG  ✅ FCM Authorization status: 1
LOG  📱 New FCM Token: eXXXXXXXXXXXXXXXXXXXX...
LOG  📤 Sending FCM token to server: eXXXXX...
```

**FCM 토큰을 복사하세요!**

### 7-2. 백엔드 서버 실행

```bash
# 다른 터미널에서
cd now_drop
./gradlew bootRun
```

### 7-3. 테스트 푸시 전송

```bash
curl -X POST http://localhost:8080/api/fcm/test \
  -H "Content-Type: application/json" \
  -d '{
    "token": "여기에_복사한_FCM_토큰_붙여넣기",
    "title": "EAS Build 테스트",
    "body": "FCM이 정상 작동합니다! 🎉"
  }'
```

### 7-4. 알림 확인

- **포그라운드**: Alert 팝업으로 표시
- **백그라운드**: 알림 센터에 표시
- **종료 상태**: 알림 센터에 표시 → 탭하면 앱 실행

---

## 🔄 코드 수정 후 테스트

### Hot Reload 사용

코드를 수정한 후:

1. **자동 리로드**: 파일 저장 시 자동으로 앱 새로고침
2. **수동 리로드**:
   - 앱을 흔들기(Shake)
   - "Reload" 선택

   또는 터미널에서 `r` 키 입력

### 재빌드가 필요한 경우

다음 변경사항은 재빌드 필요:
- `app.json` 수정
- 네이티브 모듈 추가/삭제
- `google-services.json` 변경
- 권한 추가

재빌드:
```bash
eas build --platform android --profile development
```

---

## 🐛 문제 해결

### 1. 빌드 실패: Firebase 파일 없음

```
Error: google-services.json not found
```

**해결:**
- `frontend/google-services.json` 파일 확인
- 파일명 대소문자 정확히 일치하는지 확인
- `app.json`의 `googleServicesFile` 경로 확인

### 2. 빌드 실패: Gradle 오류

```
Error: Task :app:processDebugGoogleServices FAILED
```

**해결:**
```bash
# 캐시 삭제 후 재빌드
eas build --platform android --profile development --clear-cache
```

### 3. 앱 설치 후 충돌

**원인:**
- Firebase 파일의 패키지명이 `app.json`과 불일치

**해결:**
```json
// app.json
{
  "expo": {
    "android": {
      "package": "com.jonggeon.nowdrop"  // Firebase와 동일해야 함
    }
  }
}
```

Firebase Console에서 패키지명 확인:
- Android 앱 설정 → 패키지 이름

### 4. 개발 서버 연결 안 됨

**해결:**
- 기기와 컴퓨터가 같은 Wi-Fi에 연결되어 있는지 확인
- 방화벽 해제
- 수동으로 URL 입력: `exp://YOUR_IP:8081`

### 5. FCM 토큰을 받지 못함

**해결:**
- 앱 설정 → 알림 권한 허용 확인
- 앱 재시작
- Firebase Console → Cloud Messaging 활성화 확인

### 6. 푸시 알림이 표시되지 않음

**Android:**
- 알림 권한 허용 확인
- 배터리 최적화 제외 설정
- Android 13+ 에서는 명시적 알림 권한 필요

**체크:**
```bash
# 백엔드 로그 확인
✅ Successfully sent message: projects/nowdrop/messages/0:1234...
```

---

## 💡 개발 팁

### 빌드 시간 단축

```bash
# 로컬에서 빌드 (Android만, 더 빠름)
eas build --platform android --profile development --local

# 단, Docker 설치 필요
```

### 여러 사람과 공유

```bash
# Preview 프로필로 빌드 (내부 배포)
eas build --platform android --profile preview

# 생성된 링크를 팀원들과 공유
```

### 빌드 로그 확인

```bash
# 웹에서 확인
https://expo.dev/accounts/YOUR_ACCOUNT/projects/nowdrop/builds

# CLI에서 확인
eas build:list
eas build:view [BUILD_ID]
```

### 빌드 캐시 활용

한 번 빌드 성공 후에는 캐시가 저장되어 다음 빌드가 더 빠릅니다:
- 첫 빌드: 10-15분
- 이후 빌드: 5-8분

---

## 📊 체크리스트

### 빌드 전
- [ ] `google-services.json` 파일 준비
- [ ] `app.json`의 패키지명 확인
- [ ] Firebase 프로젝트에 앱 등록 완료
- [ ] EAS CLI 로그인 완료

### 빌드 후
- [ ] APK 다운로드 및 설치 완료
- [ ] 개발 서버 연결 확인
- [ ] FCM 토큰 수신 확인
- [ ] 백엔드 서버 실행 확인
- [ ] 테스트 푸시 전송 성공

### 테스트
- [ ] 포그라운드 알림 수신 확인
- [ ] 백그라운드 알림 수신 확인
- [ ] 알림 클릭 시 앱 열림 확인
- [ ] Hot Reload 작동 확인

---

## 🎓 다음 단계

1. **프로덕션 빌드** 준비
   ```bash
   eas build --platform android --profile production
   ```

2. **Google Play Store** 업로드
   ```bash
   eas submit --platform android
   ```

3. **TestFlight** 배포 (iOS)
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

---

## 📚 참고 자료

- [EAS Build 공식 문서](https://docs.expo.dev/build/introduction/)
- [Expo Config Plugins](https://docs.expo.dev/guides/config-plugins/)
- [React Native Firebase](https://rnfirebase.io/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

---

**축하합니다!** 🎉

이제 실제 기기에서 FCM 푸시 알림을 테스트할 수 있습니다!

Hot Reload를 활용하면 네이티브 앱처럼 개발하면서도 빠른 개발 속도를 유지할 수 있습니다.
