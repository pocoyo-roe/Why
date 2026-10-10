import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton, WhyCard, tapFeedback } from '../components/ui';
import { findRelated } from '../data/whys';
import { useWhyStore } from '../store/WhyStore';
import { usePalette } from '../theme';

const PROMPTS = ['Why do cats purr?', 'Why is the number zero important?', 'Why do we dream?', 'Why do bubbles pop?'];

export default function AskScreen() {
  const palette = usePalette();
  const { addMine } = useWhyStore();
  const [question, setQuestion] = useState('');
  const [placeholder] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const matches = findRelated(question, 2);

  const submit = () => {
    const text = question.trim();
    if (!text) return;
    tapFeedback();
    const item = addMine(/[?？]$/.test(text) ? text : `${text}?`);
    router.dismiss();
    router.push(`/mine/${item.id}`);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: palette.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={[styles.label, { color: palette.muted }]}>What are you wondering about?</Text>
        <TextInput
          autoFocus
          multiline
          value={question}
          onChangeText={setQuestion}
          placeholder={placeholder}
          placeholderTextColor={palette.muted}
          style={[styles.input, { color: palette.text, backgroundColor: palette.card, borderColor: palette.border }]}
          maxLength={200}
          submitBehavior="blurAndSubmit"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <PrimaryButton label="Add to My Whys" icon="add" onPress={submit} disabled={!question.trim()} />

        {matches.length > 0 && (
          <View style={styles.matches}>
            <Text style={[styles.label, { color: palette.muted }]}>Maybe already answered:</Text>
            {matches.map((w) => (
              <WhyCard key={w.id} why={w} />
            ))}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 14 },
  label: { fontSize: 15, fontWeight: '500' },
  input: {
    fontSize: 20,
    lineHeight: 26,
    minHeight: 110,
    padding: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    textAlignVertical: 'top',
  },
  matches: { gap: 12, marginTop: 10 },
});
