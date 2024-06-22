import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/styles';

const InitialContainers = () => (
  <View style={styles.initialContainers}>
    <TouchableOpacity style={styles.containerItem}>
      <FontAwesome name="random" size={30} color="#9D24A5" />
      <Text style={styles.containerText}>Random Facts</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.containerItem}>
      <FontAwesome name="comments" size={30} color="#9D24A5" />
      <Text style={styles.containerText}>Short Answers</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.containerItem}>
      <FontAwesome name="smile-o" size={30} color="#9D24A5" />
      <Text style={styles.containerText}>Friendly Talking</Text>
    </TouchableOpacity>
  </View>
);

export default InitialContainers;
