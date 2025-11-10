import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';
import Header from '../components/ui/Header';

const Routes = ({ navigation, route }) => {
  const { from = '강남역', to = '홍대입구역' } = route.params || {};

  const routes = [
    {
      id: '1',
      type: 'metro',
      line: 'Line 2',
      duration: 35,
      transfers: 0,
      steps: [from, '신촌역', to],
    },
    {
      id: '2',
      type: 'metro',
      line: 'Line 3 → Line 2',
      duration: 42,
      transfers: 1,
      steps: [from, '교대역', '을지로3가역', to],
    },
    {
      id: '3',
      type: 'bus',
      line: 'Bus 602',
      duration: 48,
      transfers: 0,
      steps: [from, '서초역', '신촌역', to],
    },
  ];

  const handleRouteSelect = (routeId) => {
    navigation.navigate('Map', { from, to, route: routeId });
  };

  const getRouteTypeIcon = (type) => {
    return type === 'metro' ? 'train' : 'directions-bus';
  };

  const getRouteTypeColor = (type) => {
    return type === 'metro' ? '#3b82f6' : '#f59e0b';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={
          <View style={styles.routeHeader}>
            <Text style={styles.routeText}>{from}</Text>
            <Icon name="arrow-forward" size={16} color="#9ca3af" family="MaterialIcons" />
            <Text style={styles.routeText}>{to}</Text>
          </View>
        }
        subtitle={`${routes.length}개의 경로`}
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      {/* Routes List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {routes.map((routeItem, index) => (
          <TouchableOpacity
            key={routeItem.id}
            onPress={() => handleRouteSelect(routeItem.id)}
          >
            <Card style={styles.routeCard}>
              <View style={styles.routeContent}>
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: `${getRouteTypeColor(routeItem.type)}20` }
                ]}>
                  <Icon 
                    name={getRouteTypeIcon(routeItem.type)} 
                    size={24} 
                    color={getRouteTypeColor(routeItem.type)}
                    family="MaterialIcons" 
                  />
                </View>

                <View style={styles.routeDetails}>
                  <View style={styles.routeHeader}>
                    <View>
                      <Text style={styles.routeLine}>{routeItem.line}</Text>
                      <Text style={styles.transferInfo}>
                        {routeItem.transfers === 0 ? '직행' : `${routeItem.transfers}회 환승`}
                      </Text>
                    </View>
                    <View style={styles.durationContainer}>
                      <Icon name="schedule" size={16} color="#374151" family="MaterialIcons" />
                      <Text style={styles.duration}>{routeItem.duration}분</Text>
                    </View>
                  </View>

                  <View style={styles.stepsContainer}>
                    {routeItem.steps.map((step, idx) => (
                      <View key={idx} style={styles.stepContainer}>
                        <Text style={styles.stepText}>{step}</Text>
                        {idx < routeItem.steps.length - 1 && (
                          <Icon name="arrow-forward" size={12} color="#9ca3af" family="MaterialIcons" />
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {index === 0 && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>추천 경로</Text>
                </View>
              )}
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 8,
  },
  routeCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  routeCard: {
    marginBottom: 12,
  },
  routeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  routeDetails: {
    flex: 1,
  },
  routeLine: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  transferInfo: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 6,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  stepText: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  recommendedBadge: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
});

export default Routes;