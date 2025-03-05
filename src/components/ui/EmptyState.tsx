import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface EmptyStateProps {
  message: string;
  icon?: string;
  onRefresh?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon = 'alert-circle-outline', onRefresh }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons name={icon as any} size={64} color={colors.text} />
      <Text style={[styles.message, { color: colors.text, fontFamily: 'Roboto-Medium' }]}>
        {message}
      </Text>
      {onRefresh && (
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: colors.primary }]}
          onPress={onRefresh}
        >
          <Text style={[styles.refreshText, { color: '#fff', fontFamily: 'Roboto-Medium' }]}>
            Refresh
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refreshText: {
    fontSize: 14,
  }
});

export default EmptyState; 