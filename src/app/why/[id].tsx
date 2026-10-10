import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { CategoryTag, EmptyState, UnsettledTag, WhyCard, tapFeedback } from '../../components/ui';
import { WHYS_BY_ID } from '../../data/whys';
import { useWhyStore } from '../../store/WhyStore';
import { usePalette } from '../../theme';

export default function WhyDetailScreen() {
  const palette = usePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isSaved, toggleSaved } = useWhyStore();
  const why = WHYS_BY_ID[id];

  if (!why) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <EmptyState icon="help" title="Hmm, why is this missing?" body="We couldn't find that explanation." />
      </View>
    );
  }

  const saved = isSaved(why.id);
  const related = (why.related ?? []).map((r) => WHYS_BY_ID[r]).filter(Boolean);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Pressable
                hitSlop={10}
                accessibilityLabel="Share"
                onPress={() => Share.share({ message: `${why.question}\n\n${why.short}` }).catch(() => {})}
              >
                <Ionicons name="share-outline" size={22} color={palette.accent} />
              </Pressable>
              <Pressable
                hitSlop={10}
                accessibilityLabel={saved ? 'Remove from saved' : 'Save'}
                onPress={() => {
                  tapFeedback();
                  toggleSaved(why.id);
                }}
              >
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={palette.accent} />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView style={{ backgroundColor: palette.background }} contentContainerStyle={styles.content}>
        <View style={styles.tags}>
          <CategoryTag category={why.category} />
          {why.unsettled && <UnsettledTag />}
        </View>
        <Text style={[styles.title, { color: palette.text }]}>{why.question}</Text>

        <View style={[styles.short, { backgroundColor: palette.accentSoft }]}>
          <Text style={[styles.shortLabel, { color: palette.accent }]}>THE SHORT ANSWER</Text>
          <Text style={[styles.shortText, { color: palette.text }]}>{why.short}</Text>
        </View>

        {why.explanation.split('\n\n').map((paragraph, i) => (
          <Text key={i} style={[styles.paragraph, { color: palette.text }]}>
            {paragraph}
          </Text>
        ))}

        {related.length > 0 && (
          <View style={styles.related}>
            <Text style={[styles.relatedLabel, { color: palette.muted }]}>KEEP ASKING WHY</Text>
            {related.map((r) => (
              <WhyCard key={r.id} why={r} />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerButtons: { flexDirection: 'row', gap: 20, paddingHorizontal: 8 },
  content: { padding: 20, gap: 16, paddingBottom: 48 },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  title: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  short: { borderRadius: 16, padding: 16, gap: 6 },
  shortLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  shortText: { fontSize: 17, lineHeight: 24, fontWeight: '500' },
  paragraph: { fontSize: 16, lineHeight: 25 },
  related: { gap: 12, marginTop: 12 },
  relatedLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
});
