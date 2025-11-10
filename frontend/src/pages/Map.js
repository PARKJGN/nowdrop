import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';
import Header from '../components/ui/Header';

const Map = ({ navigation, route }) => {
  const { from = '강남역', to = '홍대입구역', route: routeId } = route.params || {};
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const handleNotificationToggle = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="경로 안내"
        subtitle={`${from} → ${to}`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity
            onPress={handleNotificationToggle}
            style={[
              styles.notificationButton,
              notificationEnabled && styles.notificationButtonActive
            ]}
          >
            <Icon 
              name="notifications" 
              size={24} 
              color={notificationEnabled ? '#ffffff' : '#374151'} 
              family="MaterialIcons" 
            />
          </TouchableOpacity>
        }
      />

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={['#e0f2fe', '#ecfdf5']}
          style={styles.mapGradient}
        >
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapIconContainer}>
              <Icon name="place" size={48} color="#3b82f6" family="MaterialIcons" />
            </View>
            <Text style={styles.mapTitle}>지도가 여기에 표시됩니다</Text>
            <Text style={styles.mapSubtitle}>
              실제 앱에서는 실시간 위치 추적과 함께{'\n'}
              경로가 지도에 표시됩니다
            </Text>
          </View>
          
          {/* Mock route visualization */}
          <View style={styles.routeLine} />
          <View style={[styles.routePoint, styles.startPoint]} />
          <View style={[styles.routePoint, styles.endPoint]} />
        </LinearGradient>
      </View>

      {/* Bottom Info Card */}
      <View style={styles.bottomContainer}>
        <Card style={styles.infoCard}>
          <View style={styles.infoContent}>
            <View style={styles.trainIconContainer}>
              <Icon name="train" size={24} color="#3b82f6" family="MaterialIcons" />
            </View>
            <View style={styles.infoDetails}>
              <View style={styles.nextStopContainer}>
                <Text style={styles.nextStopTitle}>다음 정류장</Text>
                <Text style={styles.nextStopName}>신촌역</Text>
              </View>
              
              <View style={styles.statusContainer}>
                <View style={styles.statusItem}>
                  <Icon name="navigation" size={16} color="#6b7280" family="MaterialIcons" />
                  <Text style={styles.statusText}>2.3 km</Text>
                </View>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>도착 예정</Text>
                  <Text style={styles.statusValue}>약 5분</Text>
                </View>
              </View>

              {notificationEnabled && (
                <View style={styles.notificationStatus}>
                  <Icon name="notifications" size={16} color="#3b82f6" family="MaterialIcons" />
                  <Text style={styles.notificationText}>
                    도착 1정거장 전 알림이 활성화되었습니다
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  notificationButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapGradient: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  mapIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  routeLine: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    height: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    opacity: 0.6,
  },
  routePoint: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: '38%',
  },
  startPoint: {
    left: '8%',
    backgroundColor: '#f59e0b',
  },
  endPoint: {
    right: '8%',
    backgroundColor: '#3b82f6',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  infoCard: {
    padding: 16,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  trainIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoDetails: {
    flex: 1,
  },
  nextStopContainer: {
    marginBottom: 12,
  },
  nextStopTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  nextStopName: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  notificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  notificationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    marginLeft: 8,
    flex: 1,
  },
});

export default Map;