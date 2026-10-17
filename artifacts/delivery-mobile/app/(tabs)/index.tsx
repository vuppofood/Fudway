import React, { useCallback, useMemo, useState } from 'react';
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
import { useFocusEffect, useRouter } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { restaurants, type Restaurant } from '@/constants/restaurants';
import { getDeliveryAddress } from '@/constants/delivery-address';

type Category = {
  name: string;
  label: string;
  route: string;
  image?: number;
};

const categories: Category[] = [
  {
    name: 'Lanches',
    label: 'Hambúrguer',
    route: 'Lanches',
    image: require('../../assets/images/restaurant-burger.jpg'),
  },
  { name: 'Restaurantes', label: 'Pizza', route: 'Restaurantes' },
  {
    name: 'Padaria',
    label: 'Porções',
    route: 'Lanches',
    image: require('../../assets/images/cart-potatoes.png'),
  },
  { name: 'Doces e bolos', label: 'Sobremesas', route: 'Doces e bolos' },
  {
    name: 'Bebidas',
    label: 'Bebidas',
    route: 'Bebidas',
    image: require('../../assets/images/cart-drink.png'),
  },
];

function CategoryButton({
  category,
  onPress,
}: {
  category: Category;
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
          category.name === 'Lanches' ? styles.categoryIconSelected : null,
        ]}
      >
        {category.image ? (
          <Image source={category.image} style={styles.categoryImage} resizeMode="cover" />
        ) : (
          <CategoryArtwork category={category} palette={colors} />
        )}
      </View>
      <Text numberOfLines={1} style={[styles.categoryLabel, { color: colors.foreground }]}>
        {category.label}
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
        name="pizza"
        size={40}
        color="#e66d27"
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
  const [deliveryAddress, setDeliveryAddressState] = useState(
    getDeliveryAddress,
  );

  useFocusEffect(
    useCallback(() => {
      setDeliveryAddressState(getDeliveryAddress());
    }, []),
  );

  const visibleRestaurants = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR');
    return restaurants.filter(
      (restaurant) =>
        !query ||
        `${restaurant.name} ${restaurant.cuisine}`
          .toLocaleLowerCase('pt-BR')
          .includes(query),
    );
  }, [search]);

  const topInset = Platform.OS === 'web' ? 67 : Platform.OS === 'android' ? 0 : insets.top;

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: '#ffffff',
              paddingTop: topInset + (Platform.OS === 'android' ? 24 : 6),
            },
          ]}
        >
          <View style={styles.topBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Alterar endereço de entrega"
              onPress={() => router.push('../location')}
              style={styles.addressButton}
            >
              <Feather name="map-pin" size={27} color={colors.brandYellow} />
              <View style={styles.addressText}>
                <Text style={styles.deliverLabel}>Entregar em</Text>
                <View style={styles.addressLine}>
                  <Text style={styles.addressTitle}>{deliveryAddress}</Text>
                  <Feather name="chevron-down" size={19} color="#1a1a1a" />
                </View>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir notificações"
              onPress={() =>
                Alert.alert('Notificações', 'Você não tem novas notificações.')
              }
              style={styles.headerActionButton}
            >
              <Feather name="bell" size={24} color="#1a1a1a" />
              <View style={styles.notificationDot} />
            </Pressable>
          </View>

          <View style={styles.searchBar}>
            <Feather name="search" size={22} color="#263238" />
            <TextInput
              accessibilityLabel="Buscar restaurantes"
              placeholder="Busque por hambúrguer, pizza, bebidas..."
              placeholderTextColor="#7b858c"
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
                <Feather name="x-circle" size={19} color="#68747b" />
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.categoriesRow}>
            {categories.map((category) => (
              <CategoryButton
                key={category.name}
                category={category}
                onPress={() =>
                  router.push({
                    pathname: '/category',
                    params: { category: category.route },
                  })
                }
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Oferta especial de hambúrguer artesanal"
            onPress={() =>
              Alert.alert(
                'Oferta especial',
                'Peça seu hambúrguer favorito e aproveite as ofertas de hoje.',
              )
            }
            style={({ pressed }) => [
              styles.heroBanner,
              { opacity: pressed ? 0.92 : 1 },
            ]}
          >
            <Image
              source={require('../../assets/images/promo-hero.jpg')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(10, 15, 11, 0.96)', 'rgba(10, 15, 11, 0.72)', 'rgba(10, 15, 11, 0.02)']}
              locations={[0, 0.48, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroCopy}>
              <View style={styles.heroBadge}>
                <Feather name="tag" size={11} color="#ffffff" />
                <Text style={styles.heroBadgeText}>OFERTA ESPECIAL</Text>
              </View>
              <Text style={styles.heroTitle}>
                HAMBÚRGUER{'\n'}
                <Text style={styles.heroTitleAccent}>ARTESANAL</Text>
              </Text>
              <Text style={styles.heroDescription}>
                Sabor de outro nível,{'\n'}na sua casa.
              </Text>
              <View style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Pedir agora</Text>
                <Feather name="arrow-right" size={16} color="#073a24" />
              </View>
            </View>
            <View style={styles.heroPagination}>
              <View style={[styles.heroPageDot, styles.heroPageDotActive]} />
              <View style={styles.heroPageDot} />
              <View style={styles.heroPageDot} />
              <View style={styles.heroPageDot} />
            </View>
          </Pressable>

          <View style={styles.featuredSection}>
            <View style={styles.sectionHeading}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Lojas
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: '/category',
                    params: { category: 'Restaurantes' },
                  })
                }
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
  header: { paddingHorizontal: 20, paddingBottom: 13 },
  topBar: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  addressButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  addressText: { flexShrink: 1 },
  deliverLabel: { color: '#626f78', fontSize: 12, marginBottom: 2 },
  addressLine: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addressTitle: { color: '#171c20', fontSize: 16, fontWeight: '700' },
  headerActionButton: {
    position: 'relative',
    width: 51,
    height: 51,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ed2635',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  searchBar: {
    minHeight: 52,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#f1f3f5',
  },
  searchInput: { flex: 1, color: '#20262a', fontSize: 14, paddingVertical: 9 },
  content: { paddingHorizontal: 13, paddingTop: 0, paddingBottom: 100 },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
    paddingBottom: 15,
  },
  categoryItem: { alignItems: 'center', flex: 1, gap: 5 },
  categoryIcon: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#edf0f2',
  },
  categoryIconSelected: { borderColor: '#54d69a', borderWidth: 1.5, backgroundColor: '#e8f8ef' },
  categoryImage: { width: '88%', height: '88%', borderRadius: 10 },
  categoryLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  heroBanner: {
    height: 184,
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#172216',
    marginBottom: 22,
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroCopy: {
    position: 'absolute',
    left: 13,
    top: 11,
    alignItems: 'flex-start',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 12,
    backgroundColor: '#07864a',
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginBottom: 8,
  },
  heroBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: '800' },
  heroTitle: {
    color: '#ffffff',
    fontSize: 23,
    lineHeight: 24,
    letterSpacing: -0.45,
    fontWeight: '900',
  },
  heroTitleAccent: { color: '#53d78d' },
  heroDescription: {
    color: '#ffffff',
    fontSize: 10,
    lineHeight: 13,
    marginTop: 4,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 30,
    borderRadius: 18,
    backgroundColor: '#53d78d',
    paddingHorizontal: 13,
    marginTop: 7,
  },
  heroButtonText: { color: '#073a24', fontSize: 11, fontWeight: '700' },
  heroPagination: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  heroPageDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ffffff99' },
  heroPageDotActive: { backgroundColor: '#53d78d', width: 9, height: 9 },
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
