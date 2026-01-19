import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid } from 'react-native';

const FCM_TOKEN_KEY = 'fcm_token';

/**
 * FCM 권한 요청
 * iOS: 알림 권한 팝업 표시
 * Android 13+: 알림 권한 팝업 표시
 * Android 12 이하: 자동 허용
 */
export const requestUserPermission = async () => {
  try {
    // Android 13+ (API 33+) 알림 권한 요청
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: '알림 권한 요청',
          message: '도착 알림을 받으려면 알림 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '거부',
          buttonPositive: '허용',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('❌ Android notification permission denied');
        return false;
      }

      console.log('✅ Android notification permission granted');
    }

    // Firebase Messaging 권한 요청 (iOS 및 Android 모두)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ FCM Authorization status:', authStatus);
      return true;
    } else {
      console.log('❌ FCM Permission denied');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to request FCM permission:', error);
    return false;
  }
};

/**
 * FCM 토큰 가져오기
 * 이 토큰은 서버로 전송하여 푸시 알림을 보낼 때 사용됩니다
 */
export const getFCMToken = async () => {
  try {
    // 기존에 저장된 토큰이 있는지 확인
    const savedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);

    if (savedToken) {
      console.log('📱 Saved FCM Token found:', savedToken);
      return savedToken;
    }

    // 새 토큰 발급
    const token = await messaging().getToken();

    if (token) {
      console.log('📱 New FCM Token:', token);
      await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
      return token;
    } else {
      console.log('❌ No FCM token received');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to get FCM token:', error);
    return null;
  }
};

/**
 * FCM 토큰 갱신 리스너
 * 토큰이 변경되면 자동으로 콜백이 호출됩니다
 */
export const onTokenRefresh = (callback) => {
  return messaging().onTokenRefresh(async (token) => {
    console.log('🔄 FCM Token refreshed:', token);

    // AsyncStorage에 새 토큰 저장
    await AsyncStorage.setItem(FCM_TOKEN_KEY, token);

    // 콜백 실행 (서버로 전송 등)
    if (callback && typeof callback === 'function') {
      callback(token);
    }
  });
};

/**
 * 포그라운드 메시지 수신 리스너
 * 앱이 실행 중일 때 푸시 알림을 받으면 호출됩니다
 */
export const onMessageReceived = (callback) => {
  return messaging().onMessage(async (remoteMessage) => {
    console.log('📬 FCM Message received (foreground):', JSON.stringify(remoteMessage, null, 2));

    if (callback && typeof callback === 'function') {
      callback(remoteMessage);
    }
  });
};

/**
 * 백그라운드/종료 상태에서 알림 클릭 시 처리
 * 사용자가 알림을 탭했을 때 호출됩니다
 */
export const onNotificationOpenedApp = (callback) => {
  // 백그라운드 상태에서 알림 클릭
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('📬 Notification caused app to open from background:', remoteMessage);

    if (callback && typeof callback === 'function') {
      callback(remoteMessage);
    }
  });

  // 종료 상태에서 알림 클릭
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('📬 Notification caused app to open from quit state:', remoteMessage);

        if (callback && typeof callback === 'function') {
          callback(remoteMessage);
        }
      }
    });
};

/**
 * 저장된 FCM 토큰 가져오기
 */
export const getSavedFCMToken = async () => {
  try {
    const token = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('❌ Failed to get saved FCM token:', error);
    return null;
  }
};

/**
 * FCM 토큰 삭제
 * 로그아웃 시 호출
 */
export const deleteFCMToken = async () => {
  try {
    await messaging().deleteToken();
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    console.log('🗑️ FCM token deleted');
    return true;
  } catch (error) {
    console.error('❌ Failed to delete FCM token:', error);
    return false;
  }
};

/**
 * 백그라운드 메시지 핸들러 설정
 * 이 함수는 index.js 또는 App.js 최상단에서 호출해야 합니다
 */
export const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('📬 Message handled in the background!', remoteMessage);
    // 백그라운드에서 추가 처리가 필요한 경우 여기에 작성
  });
};
