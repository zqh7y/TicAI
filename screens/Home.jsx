import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import InitialContainers from '../components/InitialContainers';
import styles from '../styles/styles';
import Message from '../components/Message';

const Home = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationStarted, setConversationStarted] = useState(false);
  const scrollViewRef = useRef();

  const handleSend = () => {
    if (inputText.trim() === '') {
      return;
    }

    const userMessage = {
      id: messages.length,
      text: inputText,
      sentByUser: true,
    };

    const aiResponse = {
      id: messages.length + 1,
      text: `AI responds to: "${inputText}"`,
      sentByUser: false,
    };

    if (messages.length < 6) {
      if (!conversationStarted) {
        setMessages([userMessage, aiResponse]);
        setConversationStarted(true);
      } else {
        setMessages([...messages, userMessage, aiResponse]);
      }
    } else {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: 'Start a new topic?', prompt: true },
      ]);
    }

    setInputText('');
  };

  const handleClearChat = () => {
    setMessages([]);
    setConversationStarted(false);
  };

  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TicAI</Text>
        <Text style={styles.description}>Your AI-powered companion for generating insightful posts on any topic.</Text>
      </View>

      {!conversationStarted && <InitialContainers />}

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        invertStickyHeaders={true}
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </ScrollView>

      {conversationStarted && messages.length >= 6 && (
        <View style={styles.newTopicContainer}>
          <View>
            <Text style={styles.newTopicText}>Start a new topic</Text>
            <Text style={styles.newTopicDescr}>You can only send 3 messages</Text>
          </View>
          <TouchableOpacity style={styles.newTopicButton} onPress={handleClearChat}>
            <Text style={styles.newTopicButtonText}>Clear Chat & Start New</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your AI post wish here..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          editable={!conversationStarted || (conversationStarted && messages.length < 6)}
        />
        <TouchableOpacity
          style={[
            styles.iconContainer,
            conversationStarted && messages.length >= 6 && styles.disabledSendButton
          ]}
          onPress={handleSend}
          disabled={conversationStarted && messages.length >= 6}
        >
          <FontAwesome name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
