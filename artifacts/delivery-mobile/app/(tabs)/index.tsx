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
import { useFocusEffect, useRouter } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { restaurants, type Restaurant } from '@/constants/restaurants';
import { getDeliveryAddress } from '@/constants/delivery-address';
import { useFavorites } from '@/contexts/FavoritesContext';

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
    image: require('../../assets/images/reference/category-burger.jpg'),
  },
  {
    name: 'Restaurantes',
    label: 'Pizza',
    route: 'Restaurantes',
    image: require('../../assets/images/reference/category-pizza.jpg'),
  },
  {
    name: 'Padaria',
    label: 'Porções',
    route: 'Lanches',
    image: require('../../assets/images/reference/category-fries.jpg'),
  },
  {
    name: 'Bebidas',
    label: 'Bebidas',
    route: 'Bebidas',
    image: require('../../assets/images/reference/category-drink.jpg'),
  },
  {
    name: 'Doces e bolos',
    label: 'Sobremesas',
    route: 'Doces e bolos',
    image: require('../../assets/images/reference/category-dessert.jpg'),
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
      <View style={styles.categoryIcon}>
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

function RestaurantCard({
  restaurant,
  displayImage,
  compact = false,
  showFavorite = true,
  showCouponBadge = false,
  favorite,
  onToggleFavorite,
}: {
  restaurant: Restaurant;
  displayImage?: number;
  compact?: boolean;
  showFavorite?: boolean;
  showCouponBadge?: boolean;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
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
        freeDelivery: restaurant.freeDelivery ? 'true' : 'false',
      },
    });

  return (
    <View style={[styles.restaurantCard, { borderColor: colors.border }]}>
      <View style={[styles.restaurantImage, compact ? styles.restaurantImageCompact : null]}>
        {displayImage ?? restaurant.image ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${restaurant.name}`}
            onPress={openStore}
            style={StyleSheet.absoluteFill}
          >
            <Image
              source={displayImage ?? restaurant.image}
              style={styles.restaurantPhoto}
              resizeMode="cover"
            />
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${restaurant.name}`}
            onPress={openStore}
            style={styles.subwayArtwork}
          >
            <Text style={styles.subwayWordmark}>
              SUB<Text style={styles.subwayYellow}>WAY</Text>
            </Text>
          </Pressable>
        )}
        {showCouponBadge ? (
          <View
            accessibilityLabel="Cupom de R$ 10"
            style={[styles.storeCouponBadge, { backgroundColor: colors.brandGreen }]}
          >
            <MaterialCommunityIcons name="ticket-percent-outline" size={10} color="#ffffff" />
            <Text style={styles.storeCouponBadgeText}>Cupom de R$ 10</Text>
          </View>
        ) : null}
        {showFavorite ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={favorite ? `Remover ${restaurant.name} dos favoritos` : `Favoritar ${restaurant.name}`}
            accessibilityState={{ selected: favorite }}
            onPress={onToggleFavorite}
            hitSlop={8}
            style={styles.favoriteButton}
          >
            <MaterialCommunityIcons
              name={favorite ? 'heart' : 'heart-outline'}
              size={18}
              color={favorite ? '#e53935' : '#ffffff'}
            />
          </Pressable>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${restaurant.name}`}
        onPress={openStore}
        style={styles.restaurantInfo}
      >
        <Text numberOfLines={1} style={[styles.restaurantName, { color: colors.foreground }]}>
          {restaurant.name}
        </Text>
        <View style={styles.restaurantMeta}>
          <MaterialCommunityIcons name="star" size={12} color={colors.brandYellow} />
          <Text style={[styles.rating, { color: colors.foreground }]}>{restaurant.rating}</Text>
          <Feather name="clock" size={12} color={colors.brandMutedGreen} />
          <Text numberOfLines={1} style={[styles.deliveryTime, { color: colors.mutedForeground }]}>
            {restaurant.delivery}
          </Text>
        </View>
        <View style={styles.deliveryMeta}>
          <MaterialCommunityIcons
            name="moped"
            size={14}
            color={restaurant.freeDelivery ? colors.brandGreen : colors.brandMutedGreen}
          />
          <Text style={[styles.deliveryLabel, { color: colors.mutedForeground }]}>
            {restaurant.freeDelivery ? 'Grátis' : 'R$ --'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { favoriteNames, toggleFavorite } = useFavorites();
  const [activeBanner, setActiveBanner] = useState(0);
  const [deliveryAddress, setDeliveryAddressState] = useState(
    getDeliveryAddress,
  );

  useFocusEffect(
    useCallback(() => {
      setDeliveryAddressState(getDeliveryAddress());
      const bannerInterval = setInterval(() => {
        setActiveBanner((current) => (current === 0 ? 1 : 0));
      }, 5000);

      return () => clearInterval(bannerInterval);
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

  const topInset = Platform.OS === 'web' ? 32 : insets.top;
  const featuredRestaurants = visibleRestaurants.slice(0, 3);

  const openRestaurant = (restaurant: Restaurant) =>
    router.push({
      pathname: '/store',
      params: {
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        delivery: restaurant.delivery,
        freeDelivery: restaurant.freeDelivery ? 'true' : 'false',
      },
    });

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: '#ffffff',
            paddingTop: topInset,
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
            <Feather name="map-pin" size={27} color={colors.brandGreen} />
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
            onPress={() => router.push('/notifications')}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
            accessibilityLabel={
              activeBanner === 0
                ? 'Bateu a fome? Peça agora. Faça seu pedido em minutos, sem sair de casa.'
                : 'Tem sempre algo gostoso esperando. Explore cardápios e descubra o que pedir hoje.'
            }
            onPress={() => restaurants[0] && openRestaurant(restaurants[0])}
            style={({ pressed }) => [
              styles.heroBanner,
              { opacity: pressed ? 0.92 : 1 },
            ]}
          >
            <Image
              source={
                activeBanner === 0
                  ? require('../../assets/images/fudway-home-banner.png')
                  : require('../../assets/images/fudway-discover-banner.png')
              }
              style={styles.heroImage}
              resizeMode="stretch"
            />
          </Pressable>
          <View
            accessibilityLabel={`Banner ${activeBanner + 1} de 2`}
            accessibilityRole="text"
            style={styles.heroPagination}
          >
            <View
              style={[
                styles.heroPageDot,
                activeBanner === 0 && styles.heroPageDotActive,
              ]}
            />
            <View
              style={[
                styles.heroPageDot,
                activeBanner === 1 && styles.heroPageDotActive,
              ]}
            />
          </View>

          {(['Perto de você', 'Lojas'] as const).map((title) => (
            <View key={title} style={styles.featuredSection}>
              <View style={styles.sectionHeading}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  {title}
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
                  <Feather name="chevron-right" size={20} color={colors.brandGreen} />
                </Pressable>
              </View>
              {featuredRestaurants.length > 0 ? (
                <View style={styles.restaurantGrid}>
                  {featuredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={`${title}-${restaurant.name}`}
                      restaurant={restaurant}
                      displayImage={
                        title === 'Lojas'
                          ? restaurant.storeImage ?? restaurant.image
                          : restaurant.image
                      }
                      compact={title === 'Lojas'}
                      showFavorite={title !== 'Perto de você'}
                      showCouponBadge={title === 'Lojas'}
                      favorite={favoriteNames.includes(restaurant.name)}
                      onToggleFavorite={() => toggleFavorite(restaurant.name)}
                    />
                  ))}
                </View>
              ) : (
                <View style={[styles.noResults, { backgroundColor: colors.card }]}>
                  <Feather name="search" size={22} color={colors.brandMutedGreen} />
                  <Text style={[styles.noResultsText, { color: colors.mutedForeground }]}>
                    Nenhuma loja encontrada.
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 108 },
  header: { paddingHorizontal: 13, paddingBottom: 6 },
  topBar: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0b5735',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  searchBar: {
    minHeight: 42,
    borderRadius: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f1f3f5',
  },
  searchInput: { flex: 1, color: '#20262a', fontSize: 13, paddingVertical: 7 },
  content: { paddingHorizontal: 13, paddingTop: 0, paddingBottom: 100 },
  categoriesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 14,
  },
  categoryItem: { alignItems: 'center', flex: 1, gap: 5, minWidth: 0 },
  categoryIcon: {
    width: '100%',
    height: 62,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#edf0f2',
  },
  categoryImage: { width: '100%', height: '100%', borderRadius: 10 },
  categoryLabel: { fontSize: 10.5, fontWeight: '600', textAlign: 'center' },
  heroBanner: {
    width: '100%',
    aspectRatio: 1365 / 768,
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#172216',
    marginBottom: 19,
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    marginTop: -10,
    marginBottom: 19,
  },
  heroPageDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#9ca3af' },
  heroPageDotActive: { backgroundColor: '#0b5735', width: 9, height: 9 },
  featuredSection: { marginHorizontal: 1, marginBottom: 15 },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, flexShrink: 1 },
  seeAllButton: { flexDirection: 'row', alignItems: 'center' },
  restaurantGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  restaurantCard: {
    width: '31.8%',
    overflow: 'hidden',
    borderRadius: 11,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  restaurantImage: { width: '100%', height: 84, overflow: 'hidden', position: 'relative' },
  restaurantImageCompact: { height: 72 },
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
  favoriteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 25,
    height: 25,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  storeCouponBadge: {
    position: 'absolute',
    left: 5,
    top: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  storeCouponBadgeText: { color: '#ffffff', fontSize: 7, fontWeight: '700' },
  restaurantInfo: { paddingHorizontal: 7, paddingVertical: 6, gap: 4 },
  restaurantName: { fontSize: 11, fontWeight: '700', flexShrink: 1 },
  restaurantMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  rating: { fontSize: 10, fontWeight: '700', marginRight: 2 },
  deliveryTime: { fontSize: 9, flexShrink: 1 },
  deliveryMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  deliveryLabel: { fontSize: 9 },
  noResults: {
    minHeight: 110,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  noResultsText: { fontSize: 13 },
});
