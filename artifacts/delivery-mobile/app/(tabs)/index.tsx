import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type Category = {
  name: string;
};

type Restaurant = {
  name: string;
  cuisine: string;
  rating: string;
  delivery: string;
  category: string;
  image?: number;
  logo?: string;
  verified?: boolean;
};

const categories: Category[] = [
  { name: 'Lanches' },
  { name: 'Restaurantes' },
  { name: 'Padaria' },
  { name: 'Doces e bolos' },
  { name: 'Bebidas' },
];

const restaurants: Restaurant[] = [
  {
    name: 'Subway',
    cuisine: 'Sanduíches',
    rating: '4.8',
    delivery: '25–40 min',
    category: 'Sanduíches',
    logo: 'SUBWAY',
    verified: true,
  },
  {
    name: 'Subway King',
    cuisine: 'Hambúrgueres',
    rating: '4.6',
    delivery: '30–50 min',
    category: 'Sanduíches',
    image: require('../../assets/images/restaurant-burger.jpg'),
  },
  {
    name: 'Bebidas & Cia',
    cuisine: 'Bebidas e bowls',
    rating: '4.7',
    delivery: '20–35 min',
    category: 'Bebidas',
    image: require('../../assets/images/restaurant-bowl.jpg'),
  },
  {
    name: 'Combo da Casa',
    cuisine: 'Combos especiais',
    rating: '4.9',
    delivery: '25–40 min',
    category: 'Combos',
    image: require('../../assets/images/restaurant-burger.jpg'),
  },
];

function CategoryButton({
  category,
  selected,
  onPress,
}: {
  category: Category;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver ${category.name}`}
      onPress={onPress}
      style={styles.categoryItem}
    >
      <View
        style={[
          styles.categoryIcon,
          {
            backgroundColor: selected ? colors.brandYellow : colors.brandGreen,
          },
        ]}
      >
        <CategoryArtwork category={category} palette={colors} />
      </View>
      <Text style={[styles.categoryLabel, { color: colors.foreground }]}>
        {category.name}
      </Text>
    </Pressable>
  );
}

function CategoryArtwork({
  category,
  palette,
}: {
  category: Category;
  palette: ReturnType<typeof useColors>;
}) {
  const ink = palette.brandDeepGreen;
  const yellow = palette.brandYellow;
  const light = palette.brandPaper;

  if (category.name === 'Lanches') {
    return (
      <Svg width={52} height={52} viewBox="0 0 64 64">
        <Path
          d="M8 25C9 15 18 10 32 10s23 5 24 15H8Z"
          fill={yellow}
          stroke={ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M9 29c5-4 9 4 14 0s9 4 14 0 9 4 17 0l-2 6H11l-2-6Z"
          fill={palette.brandLettuce}
          stroke={ink}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <Path
          d="M10 36h44v5H10z"
          fill={palette.brandTomato}
          stroke={ink}
          strokeWidth={1.5}
        />
        <Path
          d="M11 42h42v5H11z"
          fill={palette.brandPatty}
          stroke={ink}
          strokeWidth={1.5}
        />
        <Path
          d="M12 48h40c-1 5-5 7-11 7H23c-6 0-10-2-11-7Z"
          fill={yellow}
          stroke={ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (category.name === 'Bebidas') {
    return (
      <Svg width={52} height={52} viewBox="0 0 64 64">
        <Path
          d="m27 8 7 11"
          fill="none"
          stroke={light}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d="M22 14h25l-3 6H19l3-6Z"
          fill={palette.brandLettuce}
          stroke={ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M17 22h33l-4 31c-.4 3-2.5 5-5.5 5h-14c-3 0-5-2-5.5-5l-4-31Z"
          fill={yellow}
          stroke={ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M30 31c0-3 7-3 7 0s-7 3-7 6 7 3 7 0"
          fill="none"
          stroke={ink}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (category.name === 'Doces e bolos') {
    return (
      <Svg width={52} height={52} viewBox="0 0 64 64">
        <Path
          d="M32 12c-1-4 2-6 5-8"
          fill="none"
          stroke={palette.brandLettuce}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Circle cx={31} cy={13} r={6} fill={palette.brandTomato} stroke={ink} strokeWidth={2} />
        <Path
          d="M13 34c-4-1-5-5-2-8 2-2 5-2 7-1 0-6 5-10 12-8 4-7 16-5 17 3 6-1 10 3 8 8 3 2 2 6-2 7H15l-2-1Z"
          fill={light}
          stroke={ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M18 37h28l-4 17c-.4 2-2 3-4 3H26c-2 0-3.6-1-4-3l-4-17Z"
          fill={light}
          stroke={ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path d="m25 39 2 15M32 39v15M39 39l-2 15" stroke={palette.brandTomato} strokeWidth={2} />
      </Svg>
    );
  }

  if (category.name === 'Restaurantes') {
    return (
      <MaterialCommunityIcons
        name="silverware-fork-knife"
        size={35}
        color={yellow}
      />
    );
  }

  if (category.name === 'Padaria') {
    return (
      <MaterialCommunityIcons
        name="bread-slice"
        size={37}
        color={yellow}
      />
    );
  }

  return (
    <Svg width={52} height={52} viewBox="0 0 64 64">
      <Path
        d="M12 24h40l-3 29c-.3 3-2 5-5 5H20c-3 0-4.7-2-5-5l-3-29Z"
        fill={yellow}
        stroke={ink}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M20 24c0-6 5-10 12-10s12 4 12 10"
        fill="none"
        stroke={light}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path d="M10 24h44l-5-7H15l-5 7Z" fill={palette.brandLettuce} stroke={ink} strokeWidth={2} />
      <Rect x={25} y={34} width={14} height={13} rx={2} fill={palette.brandGreen} />
      <Path d="M28 40h8" stroke={yellow} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const colors = useColors();
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${restaurant.name}`}
      onPress={() =>
        router.push({
          pathname: '/store',
          params: {
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating,
            delivery: restaurant.delivery,
          },
        })
      }
      style={({ pressed }) => [
        styles.restaurantCard,
        { borderColor: colors.border, opacity: pressed ? 0.88 : 1 },
      ]}
    >
      <View style={styles.restaurantImage}>
        {restaurant.image ? (
          <Image source={restaurant.image} style={styles.restaurantPhoto} />
        ) : (
          <View style={styles.subwayArtwork}>
            <Text style={styles.subwayWordmark}>
              SUB<Text style={styles.subwayYellow}>WAY</Text>
            </Text>
          </View>
        )}
      </View>
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantNameRow}>
          <Text numberOfLines={1} style={styles.restaurantName}>
            {restaurant.name}
          </Text>
          {restaurant.verified ? (
            <MaterialCommunityIcons
              name="check-decagram"
              size={14}
              color={colors.brandGreen}
            />
          ) : null}
        </View>
        <View style={styles.restaurantMeta}>
          <Feather name="star" size={14} color={colors.brandGreen} />
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text numberOfLines={1} style={styles.deliveryTime}>
            {restaurant.delivery}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const visibleRestaurants = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR');
    return restaurants.filter((restaurant) => {
      const filterCategory =
        activeCategory === 'Lanches' ? 'Sanduíches' : activeCategory;
      const matchesCategory =
        !activeCategory ||
        activeCategory === 'Restaurantes' ||
        restaurant.category === filterCategory ||
        restaurant.cuisine === filterCategory;
      const matchesSearch =
        !query ||
        `${restaurant.name} ${restaurant.cuisine}`
          .toLocaleLowerCase('pt-BR')
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const topInset = Platform.OS === 'web' ? 67 : Platform.OS === 'android' ? 0 : insets.top;

  return (
    <View style={[styles.screen, { backgroundColor: colors.brandCream }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.brandDeepGreen,
              paddingTop: topInset + (Platform.OS === 'android' ? 24 : 6),
            },
          ]}
        >
          <View style={styles.topBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Alterar endereço de entrega"
              onPress={() =>
                Alert.alert('Endereço de entrega', 'Rua das Palmeiras, 258')
              }
              style={styles.addressButton}
            >
              <Feather name="map-pin" size={29} color={colors.brandYellow} />
              <View style={styles.addressText}>
                <Text style={styles.deliverLabel}>Entregar em</Text>
                <View style={styles.addressLine}>
                  <Text style={styles.addressTitle}>Rua das Palmeiras, 258</Text>
                  <Feather name="chevron-down" size={19} color={colors.brandYellow} />
                </View>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir carrinho, 1 item"
              onPress={() => router.push('/cart')}
              style={styles.cartButton}
            >
              <Feather name="shopping-cart" size={25} color="#ffffff" />
              <View style={[styles.cartBadge, { backgroundColor: colors.brandYellow }]}>
                <Text style={styles.cartBadgeText}>1</Text>
              </View>
            </Pressable>
          </View>

          <View style={[styles.searchBar, { backgroundColor: '#285a43' }]}>
            <Feather name="search" size={22} color="#ffffff" />
            <TextInput
              accessibilityLabel="Buscar restaurantes"
              placeholder="Busque por lanches, restaurantes..."
              placeholderTextColor="#c0d0c7"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              style={styles.searchInput}
            />
            {search.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
                onPress={() => setSearch('')}
                hitSlop={10}
              >
                <Feather name="x-circle" size={19} color="#d7e2dc" />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.content}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver ofertas"
            onPress={() =>
              Alert.alert(
                'Ofertas especiais',
                'Peça seu lanche favorito e aproveite as promoções de hoje.',
              )
            }
            style={({ pressed }) => [styles.promoBanner, { opacity: pressed ? 0.94 : 1 }]}
          >
            <Image
              source={require('../../assets/images/promo-hero.jpg')}
              style={styles.promoImage}
              resizeMode="cover"
            />
            <Image
              source={require('../../assets/images/restaurant-burger.jpg')}
              style={styles.promoBurger}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(3, 24, 13, 0.98)', 'rgba(3, 24, 13, 0)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.promoBlend}
            />
            <View style={styles.promoCopy}>
              <View style={[styles.promoBadge, { backgroundColor: colors.brandYellow }]}>
                <Text style={styles.promoBadgeText}>PROMOÇÃO</Text>
              </View>
              <Text style={styles.promoHeadline}>
                Mais que{'\n'}um lanche,{'\n'}
                <Text style={{ color: colors.brandYellow }}>é satisfação!</Text>
              </Text>
              <View style={[styles.promoCta, { backgroundColor: colors.brandYellow }]}>
                <Text style={styles.promoCtaText}>Ver ofertas</Text>
                <Feather name="arrow-right" size={17} color={colors.brandDeepGreen} />
              </View>
            </View>
            <View style={styles.burstOne} />
            <View style={styles.burstTwo} />
          </Pressable>

          <View style={styles.categoriesRow}>
            {categories.map((category) => (
              <CategoryButton
                key={category.name}
                category={category}
                selected={activeCategory === category.name}
                onPress={() => {
                  setActiveCategory((current) =>
                    current === category.name ? null : category.name,
                  );
                }}
              />
            ))}
          </View>

          <View style={styles.featuredSection}>
            <View style={styles.sectionHeading}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                {activeCategory
                  ? `${activeCategory} em destaque`
                  : 'Lojas'}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setActiveCategory(null)}
                style={styles.seeAllButton}
              >
                <Text style={[styles.seeAllText, { color: colors.brandMutedGreen }]}>
                  Ver todos
                </Text>
                <Feather name="chevron-right" size={18} color={colors.brandMutedGreen} />
              </Pressable>
            </View>
            {visibleRestaurants.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.restaurantList}
              >
                {visibleRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.name} restaurant={restaurant} />
                ))}
              </ScrollView>
            ) : (
              <View style={[styles.noResults, { backgroundColor: colors.card }]}>
                <Feather name="search" size={22} color={colors.brandMutedGreen} />
                <Text style={[styles.noResultsText, { color: colors.brandMutedGreen }]}>
                  Nenhum restaurante encontrado.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 20 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 17,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topBar: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  addressButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  addressText: { flexShrink: 1 },
  deliverLabel: { color: '#d1e0d7', fontSize: 12, marginBottom: 2 },
  addressLine: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addressTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  cartButton: {
    width: 51,
    height: 51,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { color: '#103a27', fontSize: 11, fontWeight: '800' },
  searchBar: {
    minHeight: 48,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.23)',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  searchInput: { flex: 1, color: '#ffffff', fontSize: 14, paddingVertical: 9 },
  content: { paddingHorizontal: 13, paddingTop: 12, paddingBottom: 100 },
  promoBanner: {
    height: 205,
    overflow: 'hidden',
    borderRadius: 22,
    justifyContent: 'center',
    backgroundColor: '#0b3924',
  },
  promoImage: { ...StyleSheet.absoluteFill },
  promoBurger: {
    position: 'absolute',
    top: 0,
    right: -8,
    width: '57%',
    height: '100%',
  },
  promoBlend: {
    position: 'absolute',
    top: 0,
    left: '38%',
    width: '25%',
    height: '100%',
  },
  promoCopy: { zIndex: 2, paddingLeft: 16, alignItems: 'flex-start' },
  promoBadge: {
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 8,
  },
  promoBadgeText: { color: '#16351f', fontWeight: '800', fontSize: 10 },
  promoHeadline: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 27,
    letterSpacing: -0.6,
    fontWeight: '800',
  },
  promoCta: {
    marginTop: 11,
    minHeight: 38,
    paddingHorizontal: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoCtaText: { color: '#173b24', fontSize: 13, fontWeight: '700' },
  burstOne: {
    position: 'absolute',
    zIndex: 1,
    top: 38,
    right: '45%',
    height: 22,
    width: 4,
    borderRadius: 3,
    backgroundColor: '#f7c900',
    transform: [{ rotate: '-17deg' }],
  },
  burstTwo: {
    position: 'absolute',
    zIndex: 1,
    top: 58,
    right: '49%',
    height: 19,
    width: 4,
    borderRadius: 3,
    backgroundColor: '#f7c900',
    transform: [{ rotate: '-48deg' }],
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingBottom: 25,
  },
  categoryItem: { alignItems: 'center', flex: 1, gap: 8 },
  categoryIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  featuredSection: { marginHorizontal: 1 },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, flexShrink: 1 },
  seeAllButton: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { fontSize: 13, fontWeight: '500' },
  restaurantList: { gap: 9, paddingRight: 16, paddingBottom: 4 },
  restaurantCard: {
    width: 170,
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  restaurantImage: { width: '100%', height: 90, overflow: 'hidden' },
  restaurantPhoto: { width: '100%', height: '100%' },
  subwayArtwork: {
    flex: 1,
    backgroundColor: '#063a23',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subwayWordmark: {
    color: '#ffffff',
    fontSize: 27,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1.5,
  },
  subwayYellow: { color: '#f7c900' },
  restaurantInfo: { paddingHorizontal: 11, paddingVertical: 8, gap: 5 },
  restaurantNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  restaurantName: { color: '#163b28', fontSize: 13, fontWeight: '700', flexShrink: 1 },
  restaurantMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rating: { color: '#163b28', fontSize: 12, fontWeight: '700' },
  metaDot: { color: '#89978f', fontSize: 12 },
  deliveryTime: { color: '#718379', fontSize: 12, flexShrink: 1 },
  noResults: {
    minHeight: 110,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  noResultsText: { fontSize: 13 },
});
