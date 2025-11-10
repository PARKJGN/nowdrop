import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Icon from '../components/ui/Icon';

const { width } = Dimensions.get('window');

const Index = ({ navigation }) => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearch = () => {
    if (departure && destination) {
      navigation.navigate('Routes', { 
        from: departure, 
        to: destination 
      });
    }
  };

  const popularRoutes = [
    { from: '강남역', to: '홍대입구역' },
    { from: '신촌역', to: '서울역' },
    { from: '잠실역', to: '강남역' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8fafc', '#e0f2fe', '#ecfdf5']}
        style={styles.background}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name="navigation" size={40} color="#ffffff" family="MaterialIcons" />
            </View>
            <Text style={styles.title}>서울 교통 알림</Text>
            <Text style={styles.subtitle}>도착 1정거장 전 알림을 받으세요</Text>
          </View>

          {/* Search Card */}
          <Card style={styles.searchCard}>
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Icon name="place" size={16} color="#3b82f6" family="MaterialIcons" />
                  <Text style={styles.label}>출발지</Text>
                </View>
                <Input
                  placeholder="출발지를 입력하세요"
                  value={departure}
                  onChangeText={setDeparture}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Icon name="place" size={16} color="#f59e0b" family="MaterialIcons" />
                  <Text style={styles.label}>도착지</Text>
                </View>
                <Input
                  placeholder="도착지를 입력하세요"
                  value={destination}
                  onChangeText={setDestination}
                  style={styles.input}
                />
              </View>
            </View>

            <Button
              variant="gradient"
              size="lg"
              onPress={handleSearch}
              disabled={!departure || !destination}
              style={styles.searchButton}
            >
              경로 검색 →
            </Button>
          </Card>

          {/* Popular Routes */}
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>자주 찾는 경로</Text>
            {popularRoutes.map((route, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setDeparture(route.from);
                  setDestination(route.to);
                }}
              >
                <Card style={styles.popularCard}>
                  <View style={styles.routeContainer}>
                    <View style={styles.routeText}>
                      <Text style={styles.routeFrom}>{route.from}</Text>
                      <Icon name="arrow-forward" size={16} color="#9ca3af" family="MaterialIcons" />
                      <Text style={styles.routeTo}>{route.to}</Text>
                    </View>
                    <Icon name="arrow-forward" size={20} color="#9ca3af" family="MaterialIcons" />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Card style={[styles.featureCard, styles.featureCard1]}>
              <Text style={styles.featureEmoji}>🔔</Text>
              <Text style={styles.featureText}>도착 알림</Text>
            </Card>
            <Card style={[styles.featureCard, styles.featureCard2]}>
              <Text style={styles.featureEmoji}>🗺️</Text>
              <Text style={styles.featureText}>실시간 경로</Text>
            </Card>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  searchCard: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  input: {
    height: 48,
  },
  searchButton: {
    height: 48,
  },
  popularSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    marginLeft: 4,
  },
  popularCard: {
    marginBottom: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeFrom: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  routeTo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  featureCard: {
    width: (width - 48) / 2,
    alignItems: 'center',
    paddingVertical: 16,
  },
  featureCard1: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  featureCard2: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  featureEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
});

export default Index;