import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { Menu, Bot, ChevronRight, Mic, Send, RotateCcw, User, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { useLanguage } from '../../locales/languageContext';
import { voiceNoteService } from '../../services/voiceNoteService';
import { api } from '../../services/api';
import { useAuth } from '../../data/authStore';
import { useCropsStore } from '../../data/cropsStore';
import { safeNavigate } from '../../utils';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export default function AIAssistantScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { crops } = useCropsStore();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const getTimeString = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      time: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const farmerLocation = user?.village
        ? `${user.village}${user.district ? ', ' + user.district : ''}`
        : user?.district
        ? `${user.district}, Maharashtra`
        : 'Maharashtra, India';

      const responseText = await api.askAiAssistant(text, language, {
        farmerName: user?.name,
        location: farmerLocation,
        crops: crops.map((c) => c.name),
        landArea: user?.landArea ? `${user.landArea} ${user.landAreaUnit || 'Acres'}` : undefined,
      });

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        time: getTimeString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text:
          language === 'mr'
            ? 'माफ करा, उत्तर मिळवण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.'
            : language === 'hi'
            ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।'
            : 'Sorry, I encountered an issue fetching the advisory. Please try again.',
        time: getTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleVoice = () => {
    if (isListening) {
      voiceNoteService.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceNoteService.start({
        onStart: () => setIsListening(true),
        onResult: (transcript) => {
          setInputQuery(transcript);
        },
        onEnd: () => setIsListening(false),
        onError: () => setIsListening(false),
      });
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setInputQuery('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => safeNavigate(() => router.push('/drawer'))}>
          <Menu size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('aiAssistant')}</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleResetChat}>
          <RotateCcw size={20} color={colors.secondaryText} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <>
              {/* Robot Hero Banner */}
              <View style={styles.heroBanner}>
                <View style={styles.botAvatarWrapper}>
                  <View style={styles.botAvatarCircle}>
                    <Bot size={48} color={colors.primaryGreen} />
                  </View>
                </View>

                <Text style={styles.greetingText}>
                  {t('greeting')} 👋
                </Text>
                <Text style={styles.subGreetingText}>
                  {t('aiSubtitle')}
                </Text>
              </View>

              {/* Quick Prompt Cards */}
              <View style={styles.promptsSection}>
                <View style={styles.promptsHeaderRow}>
                  <Sparkles size={16} color={colors.primaryGreen} />
                  <Text style={styles.promptsTitle}>{t('suggestedQuestions')}</Text>
                </View>

                <View style={styles.promptsContainer}>
                  {[t('prompt1'), t('prompt2'), t('prompt3')].map((promptText, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.promptCard}
                      onPress={() => handleSendMessage(promptText)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.promptText}>{promptText}</Text>
                      <ChevronRight size={18} color={colors.primaryGreen} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <View style={styles.messagesContainer}>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageRow,
                      isUser ? styles.userMessageRow : styles.aiMessageRow,
                    ]}
                  >
                    {!isUser && (
                      <View style={styles.botAvatarMini}>
                        <Bot size={16} color={colors.primaryGreen} />
                      </View>
                    )}

                    <View
                      style={[
                        styles.messageBubble,
                        isUser ? styles.userBubble : styles.aiBubble,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          isUser ? styles.userMessageText : styles.aiMessageText,
                        ]}
                      >
                        {msg.text}
                      </Text>
                      <Text
                        style={[
                          styles.messageTime,
                          isUser ? styles.userTime : styles.aiTime,
                        ]}
                      >
                        {msg.time}
                      </Text>
                    </View>

                    {isUser && (
                      <View style={styles.userAvatarMini}>
                        <User size={16} color={colors.white} />
                      </View>
                    )}
                  </View>
                );
              })}

              {isTyping && (
                <View style={[styles.messageRow, styles.aiMessageRow]}>
                  <View style={styles.botAvatarMini}>
                    <Bot size={16} color={colors.primaryGreen} />
                  </View>
                  <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                    <ActivityIndicator size="small" color={colors.primaryGreen} />
                    <Text style={styles.typingText}>{t('aiThinking')}</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              Platform.OS === 'web' ? ({ outlineStyle: 'none', outline: 'none' } as any) : undefined,
            ]}
            placeholder={isListening ? t('listeningVoice') : t('typeQuestion')}
            placeholderTextColor={colors.mutedText}
            value={inputQuery}
            onChangeText={setInputQuery}
            onSubmitEditing={() => handleSendMessage()}
          />
          <TouchableOpacity
            style={[styles.iconActionBtn, isListening && styles.activeListeningBtn]}
            onPress={handleToggleVoice}
            activeOpacity={0.8}
          >
            <Mic size={20} color={isListening ? colors.danger : colors.secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendBtn, !inputQuery.trim() && styles.disabledSendBtn]}
            onPress={() => handleSendMessage()}
            disabled={!inputQuery.trim()}
            activeOpacity={0.85}
          >
            <Send size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroBanner: {
    backgroundColor: colors.lightGreen,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderColor: '#D1FAE5',
    borderWidth: 1,
  },
  botAvatarWrapper: {
    marginBottom: spacing.md,
  },
  botAvatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryGreen,
    shadowColor: colors.primaryGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  greetingText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 4,
  },
  subGreetingText: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 18,
  },
  promptsSection: {
    marginTop: spacing.xs,
  },
  promptsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  promptsTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  promptsContainer: {
    gap: spacing.sm,
  },
  promptCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 56,
  },
  promptText: {
    fontSize: fontSize.sm,
    color: colors.primaryText,
    fontWeight: fontWeight.medium,
    flex: 1,
    marginRight: spacing.xs,
  },
  messagesContainer: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs + 2,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  aiMessageRow: {
    justifyContent: 'flex-start',
  },
  botAvatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryGreen,
  },
  userAvatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: colors.primaryGreen,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  messageText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.white,
    fontWeight: fontWeight.medium,
  },
  aiMessageText: {
    color: colors.primaryText,
  },
  messageTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTime: {
    color: 'rgba(255,255,255,0.75)',
  },
  aiTime: {
    color: colors.mutedText,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.xs,
    minHeight: 54,
    ...shadows.sm,
  },
  textInput: {
    flex: 1,
    height: 44,
    fontSize: fontSize.sm,
    color: colors.primaryText,
  },
  iconActionBtn: {
    padding: spacing.xs,
  },
  activeListeningBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primaryGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledSendBtn: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
});
