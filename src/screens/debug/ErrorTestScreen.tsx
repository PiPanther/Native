import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import ErrorState from '../../components/ui/ErrorState';

const ErrorTestScreen = () => {
  const [showError, setShowError] = React.useState(false);

  if (showError) {
    return (
      <ErrorState 
        message="This is a test error message. You can retry to go back to the test screen." 
        onRetry={() => setShowError(false)} 
      />
    );
  }

  return (
    <View style={styles.container}>
      <Button 
        title="Show Error State" 
        onPress={() => setShowError(true)} 
        color="#FF3B30"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ErrorTestScreen; 