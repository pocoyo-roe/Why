import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip, EmptyState, WhyCard, tapFeedback } from '../../components/ui';
import { CATEGORIES, WHYS, searchWhys, whyOfTheDay, type Category } from '../../data/whys';
import { usePalette } from '../../theme';

export default function ExploreScreen() {
  const palette = usePalette();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const today = useMemo(() => whyOfTheDay(), []);

  const results = useMemo(
    () => searchWhys(query).filter((w) => !category || w.category === category),
    [query, category],
  );
  const browsing = !query && !category;

  const surpriseMe = () => {
    tapFeedback();
    const pick = WHYS[Math.floor(Math.random() * WHYS.length)];
    router.push(`/why/${pick.id}`);
  };

  return (
    <FlatList
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      data={results}
      keyExtractor={(w) => w.id}
      renderItem={({ item }) => <WhyCard why={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={[styles.search, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Ionicons name="search" size={18} color={palette.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search whys…"
              placeholderTextColor={palette.muted}
              style={[styles.searchInput, { color: palette.text }]}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip label="All" active={!category} onPress={() => setCategory(null)} />
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} active={category === c} onPress={() => setCategory(category === c ? null : c)} />
            ))}
          </ScrollView>

          {browsing && (
            <>
              <Pressable
                onPress={() => router.push(`/why/${today.id}`)}
                style={({ pressed }) => [styles.hero, { backgroundColor: palette.accent, opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={[styles.heroLabel, { color: palette.accentText }]}>WHY OF THE DAY</Text>
                <Text style={[styles.heroTitle, { color: palette.accentText }]}>{today.question}</Text>
                <Text style={[styles.heroBody, { color: palette.accentText }]} numberOfLines={3}>
                  {today.short}
                </Text>
              </Pressable>

              <View style={styles.actions}>
                <Pressable
                  onPress={surpriseMe}
                  style={({ pressed }) => [
                    styles.action,
                    { backgroundColor: palette.card, borderColor: palette.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="shuffle" size={20} color={palette.accent} />
                  <Text style={[styles.actionText, { color: palette.text }]}>Surprise me</Text>
                </Pressable>
                <Pressable
                  onPress={() => router.push('/ask')}
                  style={({ pressed }) => [
                    styles.action,
                    { backgroundColor: palette.card, borderColor: palette.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="add-circle" size={20} color={palette.accent} />
                  <Text style={[styles.actionText, { color: palette.text }]}>Ask your own</Text>
                </Pressable>
              </View>
            </>
          )}

          <Text style={[styles.sectionTitle, { color: palette.muted }]}>
            {browsing ? 'ALL WHYS' : `${results.length} RESULT${results.length === 1 ? '' : 'S'}`}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          icon="search"
          title="No whys match that"
          body="Try a different word, or add it to My Whys and find out the answer yourself."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  header: { gap: 14 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 11 },
  chips: { gap: 8 },
  hero: { borderRadius: 20, padding: 20, gap: 8 },
  heroLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, opacity: 0.85 },
  heroTitle: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
  heroBody: { fontSize: 15, lineHeight: 21, opacity: 0.9 },
  actions: { flexDirection: 'row', gap: 12 },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionText: { fontSize: 15, fontWeight: '600' },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 6 },
});
