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
type FilterKey = 'sort' | 'freeDelivery' | 'rating4' | 'under40' | 'promotion';

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

const filterOptions: { id: FilterKey; label: string }[] = [
  { id: 'sort', label: 'Ordenar' },
  { id: 'freeDelivery', label: 'Entrega grátis' },
  { id: 'rating4', label: 'Avaliação 4+' },
  { id: 'under40', label: 'Até 40 min' },
  { id: 'promotion', label: 'Promoções' },
];

function StoreListCard({ restaurant }: { restaurant: Restaurant }) {
  const colors = useColors();
  const router = useRouter();

  const openStore = () =>
    router.push({
      pathname: '/store',
      params: {
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.categoryRating ?? restaurant.rating,
        delivery: restaurant.categoryDelivery ?? restaurant.delivery,
        freeDelivery: restaurant.freeDelivery ? 'true' : 'false',
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
        {restaurant.categoryImage ?? restaurant.image ? (
          <Image
            source={(restaurant.categoryImage ?? restaurant.image) as ImageSourcePropType}
            style={styles.storeImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.logoImage, { backgroundColor: colors.brandDeepGreen }]}>
            <Text style={styles.logoText}>
              B<Text style={{ color: colors.brandYellow }}>!</Text>
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
        <View style={styles.storeMetaRow}>
          <MaterialCommunityIcons name="star" size={14} color={colors.brandGreen} />
          <Text style={[styles.storeRating, { color: colors.foreground }]}>
            {restaurant.categoryRating ?? restaurant.rating}
          </Text>
          <Feather name="clock" size={13} color={colors.brandMutedGreen} />
          <Text
            numberOfLines={1}
            style={[styles.storeDelivery, { color: colors.mutedForeground }]}
          >
            {restaurant.categoryDelivery ?? restaurant.delivery}
          </Text>
        </View>
        <View style={styles.deliveryLabel}>
          <MaterialCommunityIcons name="moped" size={15} color={colors.brandGreen} />
          <Text style={[styles.freeDeliveryText, { color: colors.brandGreen }]}>
            {restaurant.freeDelivery
              ? 'Grátis'
              : `R$ ${(restaurant.categoryDeliveryFee ?? 4.9).toFixed(2).replace('.', ',')}`}
          </Text>
        </View>
      </View>

    </Pressable>
  );
}

export default function CategoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const topInset = Platform.OS === 'web' ? 40 : insets.top;
  const categoryName: CategoryName =
    categoryNames.find((name) => name === params.category) ?? 'Restaurantes';
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([]);
  const [sortByRating, setSortByRating] = useState(false);

  const toggleFilter = (filter: FilterKey) => {
    if (filter === 'sort') {
      setSortByRating((current) => !current);
      return;
    }
    setActiveFilters((current) =>
      current.includes(filter)
        ? current.filter((selected) => selected !== filter)
        : [...current, filter],
    );
  };

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
    const filtered = matchingRestaurants.filter((restaurant) => {
      const meetsFilters = activeFilters.every((filter) => {
        if (filter === 'freeDelivery') return restaurant.freeDelivery;
        if (filter === 'rating4') {
          return Number(restaurant.categoryRating ?? restaurant.rating) >= 4;
        }
        if (filter === 'under40') {
          const firstMinute = Number(
            (restaurant.categoryDelivery ?? restaurant.delivery).match(/\d+/)?.[0] ?? 99,
          );
          return firstMinute <= 40;
        }
        return restaurant.promotion;
      });
      return (
        meetsFilters &&
        (!query ||
          `${restaurant.name} ${restaurant.cuisine}`
            .toLocaleLowerCase('pt-BR')
            .includes(query))
      );
    });
    return sortByRating
      ? filtered.sort(
          (a, b) =>
            Number(b.categoryRating ?? b.rating) - Number(a.categoryRating ?? a.rating),
        )
      : filtered;
  }, [activeFilters, categoryName, search, sortByRating]);

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
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.card} />
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            paddingTop: topInset + 4,
          },
        ]}
      >
        <View style={styles.headingRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            testID="category-back"
            onPress={() => router.back()}
            hitSlop={10}
            style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Feather name="arrow-left" size={21} color={colors.brandDeepGreen} />
          </Pressable>
          <Text style={[styles.categoryHeaderTitle, { color: colors.foreground }]}>
            {categoryName === 'Lanches' ? 'Hambúrguer' : categoryName}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ordenar por avaliação"
            onPress={() => toggleFilter('sort')}
            style={styles.headerFilter}
          >
            <Feather name="sliders" size={21} color={colors.foreground} />
          </Pressable>
        </View>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: '#ffffff', borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={19} color={colors.brandMutedGreen} />
          <TextInput
            accessibilityLabel={`Buscar em ${categoryName}`}
            testID="category-search"
            value={search}
            onChangeText={setSearch}
            placeholder={
              categoryName === 'Lanches'
                ? 'Busque por hambúrguer, batata...'
                : 'Buscar loja ou tipo de comida'
            }
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {search ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
              onPress={() => setSearch('')}
              hitSlop={8}
            >
              <Feather name="x-circle" size={17} color={colors.brandMutedGreen} />
            </Pressable>
          ) : null}
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
        <View style={styles.filtersViewport}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterGrid}
          >
            {filterOptions.map((filter) => {
              const selected =
                filter.id === 'sort'
                  ? sortByRating
                  : activeFilters.includes(filter.id);
              return (
                <Pressable
                  key={filter.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Filtrar: ${filter.label}`}
                  testID={`filter-${filter.id}`}
                  onPress={() => toggleFilter(filter.id)}
                  style={[
                    styles.filterChip,
                    {
                      borderColor: selected ? colors.brandGreen : colors.border,
                      backgroundColor: selected ? colors.brandMint : colors.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      { color: selected ? colors.brandGreen : colors.foreground },
                    ]}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.resultsHeading}>
          <Text style={[styles.resultsTitle, { color: colors.foreground }]}>
            {categoryName === 'Lanches'
              ? 'Restaurantes com hambúrguer'
              : `Restaurantes de ${categoryName.toLocaleLowerCase('pt-BR')}`}
          </Text>
          <Pressable
            accessibilityRole="button"
            testID="category-see-all"
            onPress={() =>
              router.replace({
                pathname: '/category',
                params: { category: 'Restaurantes' },
              })
            }
            style={styles.seeAllButton}
          >
            <Text style={[styles.seeAllText, { color: colors.brandGreen }]}>Ver tudo</Text>
            <Feather name="arrow-right" size={15} color={colors.brandGreen} />
          </Pressable>
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
              {activeFilters.length > 0
                ? 'Tente remover um ou mais filtros.'
                : 'Tente outro nome ou ajuste sua busca.'}
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

      <View
        style={[
          styles.bottomTabs,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, Platform.OS === 'web' ? 10 : 7),
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/(tabs)')}
          style={styles.bottomTab}
        >
          <Feather name="home" size={22} color={colors.brandGreen} />
          <Text style={[styles.bottomTabLabel, { color: colors.brandGreen }]}>Início</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/orders')}
          style={styles.bottomTab}
        >
          <Feather name="clipboard" size={21} color={colors.mutedForeground} />
          <Text style={[styles.bottomTabLabel, { color: colors.mutedForeground }]}>Pedidos</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.bottomTab}
        >
          <Feather name="user" size={22} color={colors.mutedForeground} />
          <Text style={[styles.bottomTabLabel, { color: colors.mutedForeground }]}>Perfil</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 11,
  },
  headingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#14251b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryHeaderTitle: { fontSize: 19, fontWeight: '800' },
  headerFilter: { width: 38, alignItems: 'flex-end', justifyContent: 'center' },
  searchBar: {
    minHeight: 44,
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    shadowColor: '#14251b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 13, paddingVertical: 8 },
  content: { flexGrow: 1, paddingHorizontal: 15, paddingTop: 11 },
  filtersViewport: { marginBottom: 18 },
  filterGrid: { flexDirection: 'row', gap: 7, paddingRight: 16 },
  filterChip: {
    minHeight: 38,
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  resultsTitle: { flex: 1, fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },
  seeAllButton: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingLeft: 6 },
  seeAllText: { fontSize: 12, fontWeight: '600' },
  storeList: { gap: 9 },
  storeCard: {
    minHeight: 123,
    padding: 6,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  storeImageFrame: { width: '47%', height: 109, borderRadius: 12, overflow: 'hidden' },
  storeImage: { width: '100%', height: '100%' },
  logoImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#ffffff', fontSize: 14, fontWeight: '900', letterSpacing: -0.5 },
  storeDetails: { flex: 1, gap: 8, paddingRight: 4 },
  storeTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  storeName: { flexShrink: 1, fontSize: 14, fontWeight: '800' },
  storeCuisine: { fontSize: 11 },
  storeMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  storeRating: { fontSize: 11, fontWeight: '600', marginRight: 4 },
  metaDot: { width: 3, height: 3, borderRadius: 2, marginHorizontal: 1 },
  storeDelivery: { flexShrink: 1, fontSize: 10 },
  deliveryLabel: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: -1 },
  freeDeliveryText: { fontSize: 11, fontWeight: '600' },
  bottomTabs: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bottomTab: { minWidth: 70, alignItems: 'center', justifyContent: 'center', gap: 2 },
  bottomTabLabel: { fontSize: 11, fontWeight: '600' },
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
