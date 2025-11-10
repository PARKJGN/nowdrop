export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const formatDuration = (minutes) => {
  return `${minutes}분`;
};

export const getRouteIcon = (type) => {
  switch (type) {
    case 'metro':
      return 'train';
    case 'bus':
      return 'bus';
    default:
      return 'map-pin';
  }
};