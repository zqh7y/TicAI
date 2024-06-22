import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

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

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        invertStickyHeaders={true}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              message.sentByUser ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
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
          disabled={
            conversationStarted && messages.length >= 6
          }
        >
          <FontAwesome name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff",
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    marginTop: 70,
    fontSize: 44,
    fontFamily: "Play",
    color: '#9D24A5',
  },
  description: {
    fontSize: 13,
    textAlign: 'center',
    width: 200,
    fontFamily: "Outfit",
    color: '#000',
  },
  messagesContainer: {
    justifyContent: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 400,
    paddingBottom: 60,
  },
  message: {
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: "Sign",
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#A07BFC',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: "#5F1AF5"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    width: '90%',
    position: 'absolute',
    borderRadius: 200,
    borderColor: "#8440EE",
    bottom: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
    letterSpacing: 1.3,
  },
  iconContainer: {
    width: 45,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#8440EE',
  },
  disabledSendButton: {
    backgroundColor: '#ccc',
  },
  newTopicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 80,
    width: 370,
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 200,
  },
  newTopicText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  newTopicButton: {
    backgroundColor: '#8440EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 150,
  },
  newTopicButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Outfit",
  },
  newTopicDescr: {
    fontSize: 13,
    fontWeight: '300',
    color: '#000',
  }
});

export default Home;
