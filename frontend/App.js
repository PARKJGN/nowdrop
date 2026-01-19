import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Platform } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './src/pages/Index';
import Routes from './src/pages/Routes';
import MapPage from './src/pages/Map';
import {
  requestUserPermission,
  getFCMToken,
  onTokenRefresh,
  onMessageReceived,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from './src/services/fcm';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

// 백그라운드 메시지 핸들러 설정 (App 외부에서 호출)
setBackgroundMessageHandler();

export default function App() {
  useEffect(() => {
    initializeFCM();
  }, []);

  /**
   * FCM 초기화
   */
  const initializeFCM = async () => {
    try {
      // 1. 권한 요청
      const hasPermission = await requestUserPermission();

      if (!hasPermission) {
        console.log('⚠️ FCM permission not granted');
        return;
      }

      // 2. FCM 토큰 가져오기
      const token = await getFCMToken();

      if (token) {
        console.log('✅ FCM initialized successfully');
        // TODO: 서버로 토큰 전송
        await sendTokenToServer(token);
      }

      // 3. 토큰 갱신 리스너 등록
      const unsubscribeTokenRefresh = onTokenRefresh(async (newToken) => {
        console.log('🔄 Token refreshed, sending to server...');
        await sendTokenToServer(newToken);
      });

      // 4. 포그라운드 메시지 수신 리스너
      const unsubscribeMessage = onMessageReceived((message) => {
        console.log('📬 Foreground message:', message);

        // 포그라운드에서 알림 표시
        if (message.notification) {
          Alert.alert(
            message.notification.title || '알림',
            message.notification.body || '',
            [{ text: '확인' }]
          );
        }
      });

      // 5. 백그라운드/종료 상태에서 알림 클릭 처리
      onNotificationOpenedApp((message) => {
        console.log('📬 Notification opened app:', message);

        // TODO: 알림 데이터에 따라 특정 화면으로 이동
        // 예: navigation.navigate('Map', { tripId: message.data.tripId });
      });

      // Cleanup
      return () => {
        unsubscribeTokenRefresh();
        unsubscribeMessage();
      };
    } catch (error) {
      console.error('❌ FCM initialization failed:', error);
    }
  };

  /**
   * 서버로 FCM 토큰 전송
   */
  const sendTokenToServer = async (token) => {
    try {
      console.log('📤 Sending FCM token to server:', token);

      // 개발 환경: 컴퓨터의 IP 주소 사용
      // 배포 환경: 실제 서버 주소로 변경
      const API_URL = __DEV__
        ? 'http://172.30.1.47:8080/api/fcm/register'  // 개발: 컴퓨터 IP
        : 'https://your-production-server.com/api/fcm/register';  // 배포: 실제 서버

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          platform: Platform.OS, // 'ios' or 'android'
        }),
      });

      if (response.ok) {
        console.log('✅ FCM token sent to server successfully');
      } else {
        console.error('❌ Failed to send FCM token to server:', response.status);
      }
    } catch (error) {
      console.error('❌ Error sending FCM token to server:', error);
      // 네트워크 에러는 무시 (로컬 개발 환경에서는 서버가 없을 수 있음)
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Index"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Index" component={Index} />
          <Stack.Screen name="Routes" component={Routes} />
          <Stack.Screen name="Map" component={MapPage} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
