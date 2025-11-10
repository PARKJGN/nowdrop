import React from 'react';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const Icon = ({ name, size = 24, color = '#000', family = 'MaterialIcons', ...props }) => {
  const IconComponent = {
    MaterialIcons,
    FontAwesome5,
    Ionicons,
  }[family];

  return <IconComponent name={name} size={size} color={color} {...props} />;
};

export default Icon;