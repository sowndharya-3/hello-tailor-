import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '../../../constants/theme';
import ScreenHeader from '../../../components/ui/ScreenHeader';

type Msg = { id: string; from: 'me' | 'agent'; text: string; time: string };

const INITIAL: Msg[] = [
  { id: '1', from: 'agent', text: 'Hi Sowndharya! This is Priya from Hello Tailor support. How can I help you today?', time: '10:02 AM' },
  { id: '2', from: 'me', text: 'Hi, I wanted to ask about my order HT-20260812-1041.', time: '10:03 AM' },
  { id: '3', from: 'agent', text: 'Sure! Your order is currently In Progress with Master Stitch Tailoring. Estimated delivery is 22 Aug 2026.', time: '10:04 AM' },
];

export default function SupportChat() {
  const [messages, setMessages] = useState(INITIAL);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: `${Date.now()}`, from: 'me', text, time: 'Just now' }]);
    setText('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `${Date.now()}-a`, from: 'agent', text: 'Got it, let me check that for you right away.', time: 'Just now' }]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="Support Chat" subtitle="Ticket #HT-SUP-4821 • Online" />
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.bubbleRow, item.from === 'me' && { justifyContent: 'flex-end' }]}>
            <View style={[styles.bubble, item.from === 'me' ? styles.bubbleMe : styles.bubbleAgent]}>
              <Text style={[styles.bubbleText, item.from === 'me' && { color: colors.white }]}>{item.text}</Text>
              <Text style={[styles.bubbleTime, item.from === 'me' && { color: 'rgba(255,255,255,0.7)' }]}>{item.time}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <Pressable style={styles.attachBtn}>
          <Ionicons name="attach-outline" size={22} color={colors.textSecondary} />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={colors.disabledText}
          style={styles.input}
        />
        <Pressable style={styles.sendBtn} onPress={send}>
          <Ionicons name="send" size={18} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  bubbleRow: { flexDirection: 'row' },
  bubble: { maxWidth: '78%', borderRadius: radius.card, padding: 12 },
  bubbleMe: { backgroundColor: colors.secondary, borderBottomRightRadius: 4 },
  bubbleAgent: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  bubbleText: { ...type.body, color: colors.text },
  bubbleTime: { ...type.supporting, fontSize: 10, color: colors.textSecondary, marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: spacing.screenH, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
  attachBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, height: 44, borderRadius: radius.pill, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, ...type.body, color: colors.text },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
});
