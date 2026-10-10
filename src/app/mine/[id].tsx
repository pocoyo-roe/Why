import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { EmptyState, WhyCard } from '../../components/ui';
import { findRelated } from '../../data/whys';
import { useWhyStore, type MyWhy } from '../../store/WhyStore';
import { usePalette } from '../../theme';

function confirmDelete(onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm('Delete this question?')) onConfirm();
    return;
  }
  Alert.alert('Delete this question?', 'This can’t be undone.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
}

export default function MyWhyScreen() {
  const palette = usePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mine, loaded } = useWhyStore();
  const item = mine.find((m) => m.id === id);

  if (!item) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        {loaded && <EmptyState icon="help" title="Question not found" body="It may have been deleted." />}
      </View>
    );
  }

  // Keyed so the editor's local state starts from the stored item once it has loaded.
  return <Editor key={item.id} item={item} />;
}

function Editor({ item }: { item: MyWhy }) {
  const palette = usePalette();
  const { updateMine, removeMine } = useWhyStore();
  const [question, setQuestion] = useState(item.question);
  const [answer, setAnswer] = useState(item.answer);

  const saveQuestion = () => {
    const text = question.trim();
    if (text) updateMine(item.id, { question: text });
    else setQuestion(item.question);
  };

  const related = findRelated(question);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              hitSlop={10}
              accessibilityLabel="Delete question"
              style={{ paddingHorizontal: 8 }}
              onPress={() =>
                confirmDelete(() => {
                  removeMine(item.id);
                  router.back();
                })
              }
            >
              <Ionicons name="trash-outline" size={22} color={palette.danger} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ backgroundColor: palette.background }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <TextInput
          value={question}
          onChangeText={setQuestion}
          onBlur={saveQuestion}
          multiline
          style={[styles.question, { color: palette.text }]}
          accessibilityLabel="Question"
        />
        <Text style={[styles.meta, { color: palette.muted }]}>
          Asked {new Date(item.createdAt).toLocaleDateString()}
        </Text>

        <Text style={[styles.label, { color: palette.muted }]}>YOUR ANSWER</Text>
        <TextInput
          value={answer}
          onChangeText={(text) => {
            setAnswer(text);
            updateMine(item.id, { answer: text });
          }}
          placeholder="What have you found out? Jot down what you learn, where you learned it, and any new whys it raises."
          placeholderTextColor={palette.muted}
          multiline
          style={[styles.answer, { color: palette.text, backgroundColor: palette.card, borderColor: palette.border }]}
        />

        {related.length > 0 && (
          <View style={styles.related}>
            <Text style={[styles.label, { color: palette.muted }]}>MIGHT HELP</Text>
            {related.map((w) => (
              <WhyCard key={w.id} why={w} />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 12, paddingBottom: 48 },
  question: { fontSize: 26, fontWeight: '700', lineHeight: 32, padding: 0 },
  meta: { fontSize: 13, marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  answer: {
    fontSize: 16,
    lineHeight: 23,
    minHeight: 160,
    padding: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    textAlignVertical: 'top',
  },
  related: { gap: 12, marginTop: 16 },
});
