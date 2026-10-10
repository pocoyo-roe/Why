import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip, EmptyState, PrimaryButton, styles as ui } from '../../components/ui';
import { useWhyStore } from '../../store/WhyStore';
import { usePalette } from '../../theme';

type Filter = 'all' | 'open' | 'answered';

export default function MyWhysScreen() {
  const palette = usePalette();
  const navigation = useNavigation();
  const { mine, loaded } = useWhyStore();
  const [filter, setFilter] = useState<Filter>('all');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => router.push('/ask')} hitSlop={12} style={{ paddingHorizontal: 16 }}>
          <Ionicons name="add" size={26} color={palette.accent} accessibilityLabel="Ask a why" />
        </Pressable>
      ),
    });
  }, [navigation, palette.accent]);

  const openCount = mine.filter((m) => !m.answer.trim()).length;
  const items = useMemo(
    () =>
      mine.filter((m) => (filter === 'all' ? true : filter === 'open' ? !m.answer.trim() : Boolean(m.answer.trim()))),
    [mine, filter],
  );

  if (loaded && mine.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <EmptyState
          icon="chatbubble-ellipses"
          title="What are you wondering about?"
          body="Write down the whys that pop into your head, then come back and add answers as you find them."
          action={<PrimaryButton label="Ask a why" icon="add" onPress={() => router.push('/ask')} />}
        />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.content}
      data={items}
      keyExtractor={(m) => m.id}
      ListHeaderComponent={
        <View style={styles.filters}>
          <Chip label={`All ${mine.length}`} active={filter === 'all'} onPress={() => setFilter('all')} />
          <Chip label={`Open ${openCount}`} active={filter === 'open'} onPress={() => setFilter('open')} />
          <Chip
            label={`Answered ${mine.length - openCount}`}
            active={filter === 'answered'}
            onPress={() => setFilter('answered')}
          />
        </View>
      }
      ListEmptyComponent={
        <Text style={[styles.none, { color: palette.muted }]}>
          {filter === 'open'
            ? 'Every question has an answer. Time to wonder about something new!'
            : 'Nothing answered yet.'}
        </Text>
      }
      renderItem={({ item }) => {
        const answered = Boolean(item.answer.trim());
        return (
          <Pressable
            onPress={() => router.push(`/mine/${item.id}`)}
            accessibilityRole="link"
            style={({ pressed }) => [
              ui.card,
              { backgroundColor: palette.card, borderColor: palette.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={styles.row}>
              <Ionicons
                name={answered ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={answered ? palette.accent : palette.muted}
              />
              <Text style={[ui.cardTitle, styles.flex, { color: palette.text }]}>{item.question}</Text>
            </View>
            <Text style={[ui.cardBody, { color: palette.muted }]} numberOfLines={2}>
              {answered ? item.answer : 'No answer yet. Tap to add one.'}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  flex: { flex: 1 },
  none: { textAlign: 'center', marginTop: 32, fontSize: 15 },
});
