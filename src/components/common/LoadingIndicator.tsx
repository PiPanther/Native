import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'large', 
  color = '#0066CC',
  fullScreen = false
}) => {
  if (!fullScreen) {
    return <ActivityIndicator size={size} color={color} style={styles.loader} />;
  }
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loader: {
    padding: 16,
  },
});

export default LoadingIndicator; 