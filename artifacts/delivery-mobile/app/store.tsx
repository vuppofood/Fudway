import React, { useMemo, useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type StoreCategory = 'Sanduíches' | 'Combos' | 'Bebidas' | 'Sobremesas';
type StoreTab = 'Cardápio' | 'Avaliações';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: StoreCategory;
  image: number;
};

const categories: StoreCategory[] = ['Sanduíches', 'Combos', 'Bebidas', 'Sobremesas'];

const subwayMenu: MenuItem[] = [
  {
    id: 'subway-classic',
    name: 'Subway Clássico',
    description: 'Pão italiano, presunto, queijo, alface, tomate, cebola e molho da casa.',
    price: 24.9,
    category: 'Sanduíches',
    image: require('../assets/images/menu-subway-classic.png'),
  },
  {
    id: 'smoked-chicken',
    name: 'Frango Defumado',
    description: 'Frango, queijo, alface, tomate, cebola e molho.',
    price: 26.9,
    category: 'Sanduíches',
    image: require('../assets/images/menu-smoked-chicken.png'),
  },
  {
    id: 'tuna',
    name: 'Atum',
    description: 'Atum, queijo, alface, cebola e molho.',
    price: 25.9,
    category: 'Sanduíches',
    image: require('../assets/images/menu-tuna.png'),
  },
  {
    id: 'classic-combo',
    name: 'Combo Subway Clássico',
    description: 'Subway Clássico com bebida gelada.',
    price: 34.9,
    category: 'Combos',
    image: require('../assets/images/menu-subway-classic.png'),
  },
  {
    id: 'chicken-combo',
    name: 'Combo Frango Defumado',
    description: 'Frango Defumado acompanhado de bebida.',
    price: 36.9,
    category: 'Combos',
    image: require('../assets/images/menu-smoked-chicken.png'),
  },
  {
    id: 'soda',
    name: 'Refrigerante 350ml',
    description: 'Bebida gelada para acompanhar seu lanche.',
    price: 6.9,
    category: 'Bebidas',
    image: require('../assets/images/cart-drink.png'),
  },
  {
    id: 'juice',
    name: 'Suco natural',
    description: 'Suco natural preparado na hora.',
    price: 8.9,
    category: 'Bebidas',
    image: require('../assets/images/restaurant-bowl.jpg'),
  },
  {
    id: 'cookie',
    name: 'Cookie de chocolate',
    description: 'Cookie macio com gotas de chocolate.',
    price: 6.5,
    category: 'Sobremesas',
    image: require('../assets/images/restaurant-bowl.jpg'),
  },
];

const otherMenus: Record<string, MenuItem[]> = {
  'Subway King': [
    {
      id: 'king-burger',
      name: 'Burger Clássico',
      description: 'Pão com gergelim, carne grelhada, queijo e molho especial.',
      price: 28.9,
      category: 'Sanduíches',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-chicken',
      name: 'Frango Crocante',
      description: 'Frango crocante com queijo, alface e molho da casa.',
      price: 27.9,
      category: 'Sanduíches',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-combo',
      name: 'Combo Burger Clássico',
      description: 'Burger clássico com batata e bebida.',
      price: 39.9,
      category: 'Combos',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-fries',
      name: 'Batata Rústica',
      description: 'Batatas douradas e crocantes.',
      price: 12.9,
      category: 'Combos',
      image: require('../assets/images/cart-potatoes.png'),
    },
    {
      id: 'king-soda',
      name: 'Refrigerante 350ml',
      description: 'Bebida gelada para acompanhar seu pedido.',
      price: 6.9,
      category: 'Bebidas',
      image: require('../assets/images/cart-drink.png'),
    },
    {
      id: 'king-dessert',
      name: 'Sobremesa da casa',
      description: 'Uma opção doce para fechar o pedido.',
      price: 9.9,
      category: 'Sobremesas',
      image: require('../assets/images/restaurant-bowl.jpg'),
    },
  ],
  'Bebidas & Cia': [
    {
      id: 'drinks-soda',
      name: 'Refrigerante 350ml',
      description: 'Bebida gelada em lata.',
      price: 6.9,
      category: 'Bebidas',
      image: require('../assets/images/cart-drink.png'),
    },
    {
      id: 'drinks-juice',
      name: 'Suco natural',
      description: 'Suco preparado na hora com frutas frescas.',
      price: 9.9,
      category: 'Bebidas',
      image: require('../assets/images/restaurant-bowl.jpg'),
    },
    {
      id: 'drinks-bowl',
      name: 'Bowl tropical',
      description: 'Frutas frescas com complementos selecionados.',
      price: 19.9,
      category: 'Sobremesas',
      image: require('../assets/images/restaurant-bowl.jpg'),
    },
  ],
  'Combo da Casa': [
    {
      id: 'house-sub',
      name: 'Combo Clássico',
      description: 'Sanduíche da casa acompanhado de bebida.',
      price: 32.9,
      category: 'Combos',
      image: require('../assets/images/menu-subway-classic.png'),
    },
    {
      id: 'house-burger',
      name: 'Combo Burger',
      description: 'Burger especial com batata e bebida.',
      price: 39.9,
      category: 'Combos',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'house-soda',
      name: 'Refrigerante 350ml',
      description: 'Bebida gelada para acompanhar seu combo.',
      price: 6.9,
      category: 'Bebidas',
      image: require('../assets/images/cart-drink.png'),
    },
    {
      id: 'house-dessert',
      name: 'Sobremesa da casa',
      description: 'Uma opção doce para completar o pedido.',
      price: 8.9,
      category: 'Sobremesas',
      image: require('../assets/images/restaurant-bowl.jpg'),
    },
  ],
};

const reviews = [
  { name: 'Mariana A.', text: 'Sanduíche fresquinho e muito bem montado.', rating: '5.0' },
  { name: 'Lucas R.', text: 'Entrega rápida e atendimento ótimo.', rating: '4.8' },
  { name: 'Camila S.', text: 'Tudo chegou certinho. Pedi de novo!', rating: '5.0' },
];

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function StoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    name?: string;
    cuisine?: string;
    rating?: string;
    delivery?: string;
  }>();
  const topInset = Platform.OS === 'web' ? 67 : Platform.OS === 'android' ? 0 : insets.top;
  const storeName = params.name || 'Subway';
  const cuisine = params.cuisine || 'Lanches';
  const rating = params.rating || '4.8';
  const delivery = storeName === 'Subway' ? '30–45 min' : params.delivery || '30–45 min';
  const menu = otherMenus[storeName] ?? subwayMenu;
  const storeLogo =
    storeName === 'Subway'
      ? require('../assets/images/order-subway.png')
      : storeName === 'Subway King'
        ? require('../assets/images/order-burger-king.png')
        : storeName === 'Bebidas & Cia'
          ? require('../assets/images/restaurant-bowl.jpg')
          : require('../assets/images/restaurant-burger.jpg');
  const storeHero =
    storeName === 'Subway'
      ? require('../assets/images/store-sandwich-hero.png')
      : storeName === 'Bebidas & Cia'
        ? require('../assets/images/restaurant-bowl.jpg')
        : require('../assets/images/restaurant-burger.jpg');
  const defaultCategory: StoreCategory =
    storeName === 'Bebidas & Cia'
      ? 'Bebidas'
      : storeName === 'Combo da Casa'
        ? 'Combos'
        : 'Sanduíches';
  const [activeTab, setActiveTab] = useState<StoreTab>('Cardápio');
  const [activeCategory, setActiveCategory] = useState<StoreCategory>(defaultCategory);
  const [addedItems, setAddedItems] = useState<Record<string, number>>({});

  const visibleItems = useMemo(
    () => menu.filter((item) => item.category === activeCategory),
    [activeCategory, menu],
  );

  const addItem = (item: MenuItem) => {
    setAddedItems((current) => ({
      ...current,
      [item.id]: (current[item.id] ?? 0) + 1,
    }));
  };

  const shareStore = async () => {
    try {
      await Share.share({ message: `Confira ${storeName} no app de delivery.` });
    } catch {
      Alert.alert(storeName, 'Compartilhe esta loja com seus amigos.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.brandCream }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.hero, { backgroundColor: colors.brandDeepGreen }]}>
          <Image
            source={storeHero}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(6,58,35,0.18)', 'rgba(6,58,35,0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.heroShade}
          />
          <View style={[styles.heroBar, { paddingTop: topInset + 3 }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={() => router.back()}
              style={styles.heroButton}
            >
              <Feather name="arrow-left" size={21} color="#ffffff" />
            </Pressable>
            <Text numberOfLines={1} style={styles.wordmark}>
              {storeName === 'Subway' ? (
                <>
                  SUB<Text style={{ color: colors.brandYellow }}>WAY</Text>
                </>
              ) : (
                storeName
              )}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Compartilhar loja"
              onPress={shareStore}
              style={styles.heroButton}
            >
              <Feather name="share-2" size={19} color="#ffffff" />
            </Pressable>
          </View>
        </View>

        <View style={[styles.storeInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image
            source={storeLogo}
            style={styles.storeLogo}
          />
          <View style={styles.storeInfoText}>
            <View style={styles.storeNameRow}>
              <Text numberOfLines={1} style={[styles.storeName, { color: colors.foreground }]}>
                {storeName}
              </Text>
              {storeName === 'Subway' ? (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={17}
                  color={colors.brandGreen}
                />
              ) : null}
            </View>
            <Text numberOfLines={1} style={[styles.storeMeta, { color: colors.mutedForeground }]}>
              {cuisine} · {delivery} · R$ 6,90 (entrega)
            </Text>
            <View style={styles.ratingRow}>
              <Feather name="star" size={13} color={colors.brandGreen} />
              <Text style={[styles.ratingText, { color: colors.foreground }]}>{rating}</Text>
              <Text style={[styles.reviewCount, { color: colors.mutedForeground }]}>
                (2.543 avaliações)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tabRow}>
          {(['Cardápio', 'Avaliações'] as StoreTab[]).map((tab) => {
            const selected = activeTab === tab;
            return (
              <Pressable
                key={tab}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.storeTab,
                  {
                    backgroundColor: selected ? colors.brandGreen : colors.card,
                    borderColor: selected ? colors.brandGreen : colors.border,
                  },
                ]}
              >
                <Text style={[styles.storeTabText, { color: selected ? '#ffffff' : colors.foreground }]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'Cardápio' ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {categories.map((category) => {
                const selected = activeCategory === category;
                return (
                  <Pressable
                    key={category}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setActiveCategory(category)}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: selected ? colors.brandGreen : colors.card,
                        borderColor: selected ? colors.brandGreen : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: selected ? '#ffffff' : colors.foreground },
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {visibleItems.length > 0 ? (
              <View style={[styles.menuList, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {visibleItems.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.menuItem,
                      index < visibleItems.length - 1 && {
                        borderBottomColor: colors.border,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      },
                    ]}
                  >
                    <Image source={item.image} style={styles.menuImage} />
                    <View style={styles.menuInfo}>
                      <Text style={[styles.menuName, { color: colors.foreground }]}>
                        {item.name}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[styles.menuDescription, { color: colors.mutedForeground }]}
                      >
                        {item.description}
                      </Text>
                      <Text style={[styles.menuPrice, { color: colors.brandGreen }]}>
                        {formatPrice(item.price)}
                      </Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Adicionar ${item.name}`}
                      onPress={() => addItem(item)}
                      style={({ pressed }) => [
                        styles.addButton,
                        { backgroundColor: colors.brandGreen, opacity: pressed ? 0.8 : 1 },
                      ]}
                    >
                      {addedItems[item.id] ? (
                        <Text style={styles.addCount}>{addedItems[item.id]}</Text>
                      ) : (
                        <Feather name="plus" size={17} color="#ffffff" />
                      )}
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : (
              <View style={[styles.emptyMenu, { backgroundColor: colors.card }]}>
                <Text style={[styles.emptyMenuText, { color: colors.mutedForeground }]}>
                  Nenhum item nesta categoria.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.reviewsList}>
            {reviews.map((review) => (
              <View
                key={review.name}
                style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewName, { color: colors.foreground }]}>
                    {review.name}
                  </Text>
                  <View style={styles.reviewScore}>
                    <Feather name="star" size={12} color={colors.brandGreen} />
                    <Text style={[styles.reviewScoreText, { color: colors.foreground }]}>
                      {review.rating}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.reviewBody, { color: colors.mutedForeground }]}>
                  {review.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 18 },
  hero: { height: 226, overflow: 'hidden' },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  heroShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  heroBar: {
    position: 'relative',
    zIndex: 2,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.16)',
  },
  wordmark: { color: '#ffffff', fontSize: 24, fontWeight: '900', letterSpacing: -1.1 },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 12,
    marginTop: -12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 15,
  },
  storeLogo: { width: 64, height: 64, borderRadius: 15 },
  storeInfoText: { flex: 1, gap: 5 },
  storeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  storeName: { fontSize: 15, fontWeight: '800', flexShrink: 1 },
  storeMeta: { fontSize: 10, fontWeight: '500' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 11, fontWeight: '800' },
  reviewCount: { fontSize: 10 },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 14,
    marginTop: 12,
  },
  storeTab: {
    flex: 1,
    height: 34,
    borderWidth: 1,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeTabText: { fontSize: 11, fontWeight: '700' },
  categoryRow: {
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
  },
  categoryChip: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: { fontSize: 10, fontWeight: '600' },
  menuList: {
    marginHorizontal: 12,
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  menuItem: {
    minHeight: 124,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 9,
    paddingVertical: 10,
  },
  menuImage: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#eaf2ed' },
  menuInfo: { flex: 1, gap: 3 },
  menuName: { fontSize: 13, fontWeight: '700' },
  menuDescription: { fontSize: 11, lineHeight: 14 },
  menuPrice: { marginTop: 2, fontSize: 12, fontWeight: '800' },
  addButton: {
    width: 29,
    height: 29,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 1,
  },
  addCount: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  emptyMenu: {
    minHeight: 100,
    marginHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMenuText: { fontSize: 12 },
  reviewsList: { paddingHorizontal: 12, gap: 9, paddingTop: 3 },
  reviewCard: { padding: 13, borderWidth: 1, borderRadius: 13, gap: 7 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewName: { fontSize: 12, fontWeight: '700' },
  reviewScore: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reviewScoreText: { fontSize: 11, fontWeight: '700' },
  reviewBody: { fontSize: 11, lineHeight: 16 },
});
