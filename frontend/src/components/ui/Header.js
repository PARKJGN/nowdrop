import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';

const Header = ({ 
  title, 
  subtitle, 
  showBack = false, 
  onBackPress, 
  rightComponent,
  style 
}) => {
  return (
    <View style={[styles.header, style]}>
      {showBack && (
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#374151" family="MaterialIcons" />
        </TouchableOpacity>
      )}
      
      <View style={styles.headerContent}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {rightComponent && (
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  rightContainer: {
    marginLeft: 12,
  },
});

export default Header;