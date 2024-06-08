import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MD2Colors } from 'react-native-paper';

export default function Loading() {
  return (

      <View style={styles.container}>
        <ActivityIndicator animating={false} color={MD2Colors.blue500} size={'large'} />
      </View>


    
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
