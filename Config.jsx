import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import ConfigStyles from '../styles/ConfigStyles';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import modes from '../data/ModeList';
import Use from '../components/Use';

const Config = ({ route }) => {
  const navigation = useNavigation();
  const { onSelectMode } = route.params || {};

  const [search, setSearch] = useState('');
  const [selectedAnswerType, setSelectedAnswerType] = useState(null);
  const [isUseModalVisible, setIsUseModalVisible] = useState(false);

  const filteredModes = {
    answer: modes.answer.filter(mode => mode.label.toLowerCase().includes(search.toLowerCase())),
    other: modes.other.filter(mode => mode.label.toLowerCase().includes(search.toLowerCase())),
  };

  const handleSelectMode = (mode) => {
    setSelectedAnswerType(mode);
    setIsUseModalVisible(true);
  };

  const renderModesSection = (sectionTitle, modes) => {
    if (modes.length === 0) {
      return null;
    }

    const getSectionTitle = () => {
      if (modes.some(item => item.key === 'basic')) {
        return 'Default';
      }
      if (modes.some(item => item.key === 'short')) {
        return 'Answer';
      }
      if (modes.some(item => item.key === 'solution')) {
        return 'Settings';
      }
      return sectionTitle;
    };

    return (
      <View key={getSectionTitle()}>
        <Text style={ConfigStyles.sectionTitle}>{getSectionTitle()}</Text>
        {modes.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              ConfigStyles.itemContainer, 
              !item.available && ConfigStyles.itemDisabled,
              item.key === 'basic' || item.key === 'clear' || item.key === 'detailed' ? { paddingBottom: 5 } : {},
            ]}
            onPress={() => item.available && handleSelectMode(item)}
            activeOpacity={0.7}
            disabled={!item.available}
          >
            <View style={[ConfigStyles.item, !item.available && ConfigStyles.itemDisabled]}>
              <View style={ConfigStyles.itemTextContainer}>
                <Text style={[ConfigStyles.itemTitle, !item.available && ConfigStyles.itemDisabledTitle]}>
                  <Text style={{ fontWeight: 'bold' }}>{item.label}</Text> {!item.available ? "- Not Available" : ""}
                </Text>
                <Text style={[ConfigStyles.itemDescription, !item.available && ConfigStyles.itemDescriptionDisable]}>
                  {item.description}
                </Text>
                <FontAwesome name='angle-right' size={!item.available ? 0 : 15} color={"#222"} style={ConfigStyles.rightAngle} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={ConfigStyles.container}>
      <View style={ConfigStyles.titleContainer}>
        <Text style={ConfigStyles.title}>RequestsAI</Text>
        <Text style={ConfigStyles.description}>Choose the AI configuration based on your requests needed.</Text>
      </View>
      <View style={ConfigStyles.searchContainer}>
        <FontAwesome name="search" size={20} color="#888" style={ConfigStyles.searchIcon} />
        <TextInput
          style={ConfigStyles.searchInput}
          placeholder="Search for AI configurations..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <ScrollView style={ConfigStyles.itemsContainer} contentContainerStyle={ConfigStyles.itemsContent} showsVerticalScrollIndicator={false}>
        {renderModesSection('Answer Types', filteredModes.answer)}
      </ScrollView>
      <TouchableOpacity style={ConfigStyles.configButton} onPress={() => navigation.navigate('Home')}>
        <Text style={ConfigStyles.configText}>Back</Text>
        <FontAwesome name='angle-right' size={15} color="black" />
      </TouchableOpacity>
      <StatusBar style="auto" />

      {selectedAnswerType && (
        <Use
          visible={isUseModalVisible}
          onClose={() => setIsUseModalVisible(false)}
          answerType={selectedAnswerType}
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default Config;
