import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/styles';

const Message = ({ message }) => (
  <View
    style={[
      styles.message,
      message.sentByUser ? styles.sentMessage : styles.receivedMessage,
    ]}
  >
    <Text style={styles.messageText}>{message.text}</Text>
  </View>
);

export default Message;
