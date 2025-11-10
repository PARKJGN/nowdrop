import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  disabled = false, 
  onPress, 
  style,
  ...props 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        disabled && styles.disabled,
        style
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, styles[`text_${variant}`], disabled && styles.textDisabled]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  default: {
    backgroundColor: '#3b82f6',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  gradient: {
    backgroundColor: '#3b82f6',
  },
  size_default: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  size_lg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  size_icon: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  text_default: {
    color: '#ffffff',
  },
  text_outline: {
    color: '#374151',
  },
  text_ghost: {
    color: '#374151',
  },
  text_gradient: {
    color: '#ffffff',
  },
  textDisabled: {
    opacity: 0.6,
  },
});

export default Button;