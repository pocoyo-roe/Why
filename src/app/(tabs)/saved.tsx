import { router } from 'expo-router';
import { FlatList, View } from 'react-native';

import { EmptyState, PrimaryButton, WhyCard } from '../../components/ui';
import { WHYS_BY_ID } from '../../data/whys';
import { useWhyStore } from '../../store/WhyStore';
import { usePalette } from '../../theme';

export default function SavedScreen() {
  const palette = usePalette();
  const { saved, loaded } = useWhyStore();
  // Skip ids that no longer exist in the library (e.g. an entry renamed in an update).
  const items = saved.map((id) => WHYS_BY_ID[id]).filter(Boolean);

  if (loaded && items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <EmptyState
          icon="bookmark-outline"
          title="Nothing saved yet"
          body="Tap the bookmark on any explanation to keep it here."
          action={<PrimaryButton label="Explore whys" icon="compass" onPress={() => router.navigate('/')} />}
        />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
      data={items}
      keyExtractor={(w) => w.id}
      renderItem={({ item }) => <WhyCard why={item} />}
    />
  );
}
