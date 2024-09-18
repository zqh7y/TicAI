import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/styles';
import Message from '../components/Message';
import Timer from '../components/Timer';
import { queryOpenAI } from '../openai';
import Confirmation from '../components/Confirmation';
import { useRoute } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const route = useRoute();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState('random');
  const [messageCount, setMessageCount] = useState(0);
  const [aiDetails, setAiDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previousMessages, setPreviousMessages] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem('messages');
        const savedMode = await AsyncStorage.getItem('selectedMode');
        const savedAIDetails = await AsyncStorage.getItem('aiDetails');
        if (savedMessages) setMessages(JSON.parse(savedMessages));
        if (savedMode) setSelectedMode(savedMode);
        if (savedAIDetails) setAiDetails(JSON.parse(savedAIDetails));
      } catch (error) {
        console.error('Failed to load data from storage:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (route.params?.answerType) {
      setSelectedMode(route.params.answerType.key); // Update selected mode
      AsyncStorage.setItem('selectedMode', route.params.answerType.key); // Save selected mode
    }
  }, [route.params?.answerType]);

  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save messages to storage:', error);
      }
    };
    saveMessages();
  }, [messages]);

  const formatBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <Text key={index} style={{ fontWeight: 'bold', fontSize: 17 }}>{part.slice(2, -2)}</Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

  const handleSend = async () => {
    if (messageCount >= 10) {
      console.log("Limit reached.");
    } else {
      if (inputText.trim() === '' || messages.length >= 100) return;

      const userMessage = { id: messages.length, text: inputText, sentByUser: true };
      setMessages([...messages, userMessage]);
      setInputText('');
      setLoading(true);
      Keyboard.dismiss();

      try {
        const context = messages.map(m => m.text).join('\n');
        const responseText = await queryOpenAI(`${context}\nUser: ${inputText}`, selectedMode);
        const aiResponse = { id: messages.length + 1, text: responseText, sentByUser: false, mode: selectedMode };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
        if (!conversationStarted && messages.length >= 6) {
          setConversationStarted(true);
        }

        setMessageCount(prevCount => prevCount + 1);

      } catch (error) {
        const errorMessage = { id: messages.length + 1, text: 'Sorry, I could not process your request at the moment.', sentByUser: false, mode: selectedMode };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearChat = async () => {
    setPreviousMessages(messages); // Save current messages before clearing
    setIsModalVisible(true);
  };

  const confirmClearChat = async () => {
    setMessages([]);
    setConversationStarted(false);
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.error('Failed to clear messages from storage:', error);
    }
  };

  const cancelDeletion = () => {
    setMessages(previousMessages);
    setIsModalVisible(false);
  };

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const updateSelectedMode = async (mode) => {
    setSelectedMode(mode);
    try {
      await AsyncStorage.setItem('selectedMode', mode);
    } catch (error) {
      console.error('Failed to save selected mode to storage:', error);
    }
  };

  const handleModeChange = (mode) => {
    updateSelectedMode(mode);
  };

  return (
    <View style={styles.container}>
      <StatusBar style={isModalVisible ? 'dark' : 'auto'} backgroundColor={isModalVisible ? 'rgba(0,0,0,0.1)' : 'transparent'} />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>TicAI</Text>
        <Text style={styles.version}>1.0.2V</Text>
        <Text style={styles.description}>The world's first AI-powered assistant for selecting different types of answers.</Text>
      </View>

      <Text style={styles.selectedMode}>{selectedMode.toUpperCase()} MODE</Text>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.messagesContainer} showsVerticalScrollIndicator={false} invertStickyHeaders={true}>
        {messages.map((message) => (
          <Message key={message.id} message={message} formatBoldText={formatBoldText} handleClearChat={handleClearChat} />
        ))}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#843EEE" />
            <Text style={styles.loadingText}>Response generating...</Text>
          </View>
        )}
      </ScrollView>

      {conversationStarted && messages.length >= 100 && (
        <View style={styles.newTopicContainer}>
          <View>
            <Text style={styles.newTopicText}>Start a new topic</Text>
            <Text style={styles.newTopicDescr}>You can only send 100 messages</Text>
          </View>
          <TouchableOpacity style={styles.newTopicButton} onPress={handleClearChat}>
            <Text style={styles.newTopicButtonText}>Clear Chat & Start New</Text>
          </TouchableOpacity>
        </View>
      )}

      <Timer messageCount={messageCount} setMessageCount={setMessageCount} initialTime={60} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your AI post wish here..."
          value={inputText}
          maxLength={250}
          multiline
          numberOfLines={3}
          onChangeText={(text) => setInputText(text)}
          editable={!conversationStarted || (conversationStarted && messages.length < 100)}
        />
        <TouchableOpacity
          style={[styles.iconContainer, conversationStarted && messages.length >= 100 && styles.disabledSendButton]}
          onPress={handleSend}
          disabled={conversationStarted && messages.length >= 100}
        >
          <FontAwesome name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.configButton} 
        onPress={() => navigation.navigate("Config", { onSelectMode: handleModeChange })}
      >
        <Text style={styles.configText}>Setup AI</Text>
        <FontAwesome name="sliders" size={15} color="rgba(0,0,0,.8)" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleClearChat}>
        <Text style={styles.deleteText}>Delete Chat</Text>
        <FontAwesome name="trash" size={15} color="rgba(0,0,0,.8)" />
      </TouchableOpacity>
      
      <Confirmation
        visible={isModalVisible}
        onConfirm={confirmClearChat}
        onCancel={cancelDeletion}
        setIsModalVisible={setIsModalVisible}
      />
    </View>
  );
};

export default Home;
