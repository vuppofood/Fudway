import React, { useMemo, useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { restaurants, type Restaurant } from '@/constants/restaurants';
import { useColors } from '@/hooks/useColors';

type CategoryName = 'Lanches' | 'Restaurantes' | 'Padaria' | 'Doces e bolos' | 'Bebidas';
type CategoryIcon = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const categoryNames: CategoryName[] = [
  'Lanches',
  'Restaurantes',
  'Padaria',
  'Doces e bolos',
  'Bebidas',
];

const categoryIcons: Record<CategoryName, CategoryIcon> = {
  Lanches: 'hamburger',
  Restaurantes: 'silverware-fork-knife',
  Padaria: 'bread-slice',
  'Doces e bolos': 'cupcake',
  Bebidas: 'cup',
};

function StoreListCard({ restaurant }: { restaurant: Restaurant }) {
  const colors = useColors();
  const router = useRouter();

  const openStore = () =>
    router.push({
      pathname: '/store',
      params: {
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        delivery: restaurant.delivery,
      },
    });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${restaurant.name}`}
      testID={`category-store-${restaurant.name}`}
      onPress={openStore}
      style={({ pressed }) => [
        styles.storeCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.86 : 1,
        },
      ]}
    >
      <View style={styles.storeImageFrame}>
        {restaurant.image ? (
          <Image
            source={restaurant.image as ImageSourcePropType}
            style={styles.storeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.logoImage, { backgroundColor: colors.brandDeepGreen }]}>
            <Text style={styles.logoText}>
              SUB<Text style={{ color: colors.brandYellow }}>WAY</Text>
            </Text>
          </View>
        )}
      </View>

      <View style={styles.storeDetails}>
        <View style={styles.storeTitleRow}>
          <Text
            numberOfLines={1}
            style={[styles.storeName, { color: colors.foreground }]}
          >
            {restaurant.name}
          </Text>
          {restaurant.verified ? (
            <MaterialCommunityIcons
              name="check-decagram"
              size={15}
              color={colors.brandGreen}
            />
          ) : null}
        </View>
        <Text
          numberOfLines={1}
          style={[styles.storeCuisine, { color: colors.mutedForeground }]}
        >
          {restaurant.cuisine}
        </Text>
        <View style={styles.storeMetaRow}>
          <Feather name="star" size={13} color={colors.brandGreen} />
          <Text style={[styles.storeRating, { color: colors.foreground }]}>
            {restaurant.rating}
          </Text>
          <View style={[styles.metaDot, { backgroundColor: colors.brandMutedGreen }]} />
          <Feather name="clock" size={13} color={colors.brandMutedGreen} />
          <Text
            numberOfLines={1}
            style={[styles.storeDelivery, { color: colors.mutedForeground }]}
          >
            {restaurant.delivery}
          </Text>
        </View>
      </View>

      <Feather name="chevron-right" size={20} color={colors.brandMutedGreen} />
    </Pressable>
  );
}

export default function CategoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const categoryName: CategoryName =
    categoryNames.find((name) => name === params.category) ?? 'Restaurantes';
  const [search, setSearch] = useState('');

  const categoryRestaurants = useMemo(() => {
    const matchingRestaurants = restaurants.filter((restaurant) => {
      switch (categoryName) {
        case 'Restaurantes':
          return true;
        case 'Lanches':
          return restaurant.category === 'Sanduíches';
        case 'Bebidas':
          return restaurant.category === 'Bebidas';
        case 'Padaria':
          return restaurant.category === 'Padaria';
        case 'Doces e bolos':
          return (
            restaurant.category === 'Doces e bolos' ||
            restaurant.category === 'Sobremesas'
          );
      }
    });

    const query = search.trim().toLocaleLowerCase('pt-BR');
    return matchingRestaurants.filter(
      (restaurant) =>
        !query ||
        `${restaurant.name} ${restaurant.cuisine}`
          .toLocaleLowerCase('pt-BR')
          .includes(query),
    );
  }, [categoryName, search]);

  const hasCategoryStores = restaurants.some((restaurant) => {
    if (categoryName === 'Restaurantes') return true;
    if (categoryName === 'Lanches') return restaurant.category === 'Sanduíches';
    if (categoryName === 'Bebidas') return restaurant.category === 'Bebidas';
    if (categoryName === 'Padaria') return restaurant.category === 'Padaria';
    return (
      restaurant.category === 'Doces e bolos' ||
      restaurant.category === 'Sobremesas'
    );
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.brandCream }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brandDeepGreen} />
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.brandDeepGreen,
            paddingTop: topInset + 8,
          },
        ]}
      >
        <View style={styles.headerTools}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            testID="category-back"
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={21} color="#ffffff" />
          </Pressable>
          <View style={[styles.searchBar, { backgroundColor: '#285a43' }]}>
            <Feather name="search" size={19} color="#ffffff" />
            <TextInput
              accessibilityLabel={`Buscar em ${categoryName}`}
              testID="category-search"
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar loja ou tipo de comida"
              placeholderTextColor="#c0d0c7"
              returnKeyType="search"
              style={styles.searchInput}
            />
            {search ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
                onPress={() => setSearch('')}
                hitSlop={8}
              >
                <Feather name="x-circle" size={17} color="#d7e2dc" />
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 24 },
        ]}
      >
        <View style={styles.resultsHeading}>
          <View>
            <Text style={[styles.resultsTitle, { color: colors.foreground }]}>
              {search ? 'Resultados da busca' : `Lojas de ${categoryName}`}
            </Text>
            <Text style={[styles.resultsSubtitle, { color: colors.mutedForeground }]}>
              {categoryRestaurants.length}{' '}
              {categoryRestaurants.length === 1 ? 'loja encontrada' : 'lojas encontradas'}
            </Text>
          </View>
          <View style={[styles.countBadge, { backgroundColor: colors.brandMint }]}>
            <Text style={[styles.countBadgeText, { color: colors.brandGreen }]}>
              {categoryRestaurants.length}
            </Text>
          </View>
        </View>

        {categoryRestaurants.length > 0 ? (
          <View style={styles.storeList}>
            {categoryRestaurants.map((restaurant) => (
              <StoreListCard key={restaurant.name} restaurant={restaurant} />
            ))}
          </View>
        ) : search || hasCategoryStores ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.brandMint }]}>
              <Feather name="search" size={25} color={colors.brandGreen} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhuma loja encontrada
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>
              Tente outro nome ou ajuste sua busca.
            </Text>
          </View>
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.brandMint }]}>
              <MaterialCommunityIcons
                name={categoryIcons[categoryName]}
                size={27}
                color={colors.brandGreen}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Ainda não há lojas de {categoryName.toLocaleLowerCase('pt-BR')}
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>
              Estamos adicionando novas opções. Explore as lojas disponíveis enquanto isso.
            </Text>
            <Pressable
              accessibilityRole="button"
              testID="category-explore-all"
              onPress={() =>
                router.replace({
                  pathname: '/category',
                  params: { category: 'Restaurantes' },
                })
              }
              style={({ pressed }) => [
                styles.exploreButton,
                {
                  backgroundColor: colors.brandYellow,
                  opacity: pressed ? 0.86 : 1,
                },
              ]}
            >
              <Text style={[styles.exploreButtonText, { color: colors.brandDeepGreen }]}>
                Ver todas as lojas
              </Text>
              <Feather name="arrow-right" size={17} color={colors.brandDeepGreen} />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 19,
    paddingBottom: 19,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerTools: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  searchBar: {
    flex: 1,
    minHeight: 46,
    borderRadius: 24,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: { flex: 1, color: '#ffffff', fontSize: 13, paddingVertical: 9 },
  content: { flexGrow: 1, paddingHorizontal: 15, paddingTop: 21 },
  resultsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultsTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  resultsSubtitle: { marginTop: 4, fontSize: 11 },
  countBadge: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 9,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: { fontSize: 12, fontWeight: '800' },
  storeList: { gap: 11 },
  storeCard: {
    minHeight: 104,
    padding: 10,
    borderWidth: 1,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeImageFrame: { width: 82, height: 82, borderRadius: 13, overflow: 'hidden' },
  storeImage: { width: '100%', height: '100%' },
  logoImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#ffffff', fontSize: 14, fontWeight: '900', letterSpacing: -0.5 },
  storeDetails: { flex: 1, gap: 5 },
  storeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  storeName: { flexShrink: 1, fontSize: 14, fontWeight: '800' },
  storeCuisine: { fontSize: 11 },
  storeMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  storeRating: { fontSize: 11, fontWeight: '700' },
  metaDot: { width: 3, height: 3, borderRadius: 2, marginHorizontal: 1 },
  storeDelivery: { flexShrink: 1, fontSize: 10 },
  emptyCard: {
    minHeight: 300,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', textAlign: 'center' },
  emptyDescription: {
    maxWidth: 275,
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  exploreButton: {
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 20,
  },
  exploreButtonText: { fontSize: 12, fontWeight: '800' },
});
