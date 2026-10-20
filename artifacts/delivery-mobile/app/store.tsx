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

type StoreCategory = 'Hambúrgueres' | 'Combos' | 'Porções' | 'Bebidas' | 'Sobremesas';
type MenuFilter = 'Todos' | StoreCategory;
type StoreTab = 'Cardápio' | 'Avaliações' | 'Sobre';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: StoreCategory;
  image: number;
};

const categories: MenuFilter[] = [
  'Todos',
  'Hambúrgueres',
  'Combos',
  'Porções',
  'Bebidas',
  'Sobremesas',
];

const subwayMenu: MenuItem[] = [
  {
    id: 'buncker-classico',
    name: 'Buncker Clássico',
    description: 'Pão brioche, hambúrguer 180g, queijo cheddar, alface, tomate e molho especial.',
    price: 24.9,
    category: 'Hambúrgueres',
    image: require('../assets/images/reference/buncker-classico.jpg'),
  },
  {
    id: 'buncker-bacon',
    name: 'Buncker Bacon',
    description: 'Pão brioche, hambúrguer 180g, queijo cheddar, bacon crocante, alface, tomate e molho especial.',
    price: 29.9,
    category: 'Hambúrgueres',
    image: require('../assets/images/reference/buncker-bacon.jpg'),
  },
  {
    id: 'buncker-duplo',
    name: 'Buncker Duplo',
    description: 'Dois hambúrgueres 180g, queijo cheddar, alface, tomate e molho especial.',
    price: 34.9,
    category: 'Hambúrgueres',
    image: require('../assets/images/reference/buncker-duplo.jpg'),
  },
  {
    id: 'combo-classico',
    name: 'Combo Clássico',
    description: 'Hambúrguer + batata média + refrigerante 350ml',
    price: 32.9,
    category: 'Combos',
    image: require('../assets/images/reference/combo-classico.jpg'),
  },
  {
    id: 'combo-bacon',
    name: 'Combo Bacon',
    description: 'Hambúrguer + batata média + refrigerante 350ml',
    price: 37.9,
    category: 'Combos',
    image: require('../assets/images/reference/combo-bacon.jpg'),
  },
  {
    id: 'combo-duplo',
    name: 'Combo Duplo',
    description: 'Hambúrguer duplo + batata média + refrigerante 350ml',
    price: 42.9,
    category: 'Combos',
    image: require('../assets/images/reference/combo-duplo.jpg'),
  },
  {
    id: 'fries',
    name: 'Batata crocante',
    description: 'Porção de batatas douradas com molho da casa.',
    price: 12.9,
    category: 'Porções',
    image: require('../assets/images/cart-potatoes.png'),
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
  Buncker: subwayMenu,
  'Subway King': [
    {
      id: 'king-burger',
      name: 'Burger Clássico',
      description: 'Pão com gergelim, carne grelhada, queijo e molho especial.',
      price: 28.9,
      category: 'Hambúrgueres',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-chicken',
      name: 'Burger Bacon',
      description: 'Hambúrguer 180g, bacon crocante, queijo e molho da casa.',
      price: 29.9,
      category: 'Hambúrgueres',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-double',
      name: 'Burger Duplo',
      description: 'Dois hambúrgueres 180g, queijo e molho especial.',
      price: 34.9,
      category: 'Hambúrgueres',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-combo',
      name: 'Combo Clássico',
      description: 'Burger clássico, batata média e refrigerante 350ml.',
      price: 32.9,
      category: 'Combos',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-bacon-combo',
      name: 'Combo Bacon',
      description: 'Burger bacon, batata média e refrigerante 350ml.',
      price: 37.9,
      category: 'Combos',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-double-combo',
      name: 'Combo Duplo',
      description: 'Burger duplo com batata e bebida gelada.',
      price: 42.9,
      category: 'Combos',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-fries',
      name: 'Batata Rústica',
      description: 'Batatas douradas e crocantes.',
      price: 12.9,
      category: 'Porções',
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
    freeDelivery?: string;
  }>();
  const topInset = Platform.OS === 'web' ? 54 : insets.top;
  const storeName = params.name || 'Buncker';
  const cuisine = params.cuisine || 'Hambúrgueres';
  const rating = params.rating || '4.8';
  const delivery = params.delivery || '30–50 min';
  const freeDelivery = params.freeDelivery ? params.freeDelivery === 'true' : true;
  const menu = otherMenus[storeName] ?? subwayMenu;
  const storeHero =
    storeName === 'Bebidas & Cia'
      ? require('../assets/images/restaurant-bowl.jpg')
      : require('../assets/images/promo-hero.jpg');
  const [activeTab, setActiveTab] = useState<StoreTab>('Cardápio');
  const [activeCategory, setActiveCategory] = useState<MenuFilter>('Todos');
  const [addedItems, setAddedItems] = useState<Record<string, number>>({
    'buncker-classico': 1,
    'buncker-bacon': 1,
  });

  const menuSections = useMemo(
    () =>
      categories
        .filter((category): category is StoreCategory => category !== 'Todos')
        .filter((category) => activeCategory === 'Todos' || activeCategory === category)
        .map((category) => ({
          category,
          items: menu.filter((item) => item.category === category),
        }))
        .filter((section) => section.items.length > 0),
    [activeCategory, menu],
  );
  const itemCount = Object.values(addedItems).reduce((sum, quantity) => sum + quantity, 0);
  const cartTotal = menu.reduce(
    (sum, item) => sum + item.price * (addedItems[item.id] ?? 0),
    0,
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
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: itemCount > 0 ? Math.max(insets.bottom, 12) + 82 : 24 },
        ]}
      >
        <View style={[styles.hero, { backgroundColor: colors.brandInk }]}>
          <Image
            source={storeHero}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.78)', 'rgba(0,0,0,0.32)', 'rgba(0,0,0,0.02)']}
            locations={[0, 0.6, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
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
            <View style={styles.heroActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Buscar no cardápio"
                onPress={() => Alert.alert('Buscar no cardápio', 'Use as categorias para encontrar seus favoritos.')}
                style={styles.heroButton}
              >
                <Feather name="search" size={19} color="#ffffff" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Compartilhar loja"
                onPress={shareStore}
                style={styles.heroButton}
              >
                <Feather name="more-vertical" size={19} color="#ffffff" />
              </Pressable>
            </View>
          </View>
          <View style={[styles.heroCopy, { top: topInset + 18 }]}>
            <View style={styles.brandLockup}>
              <Text style={styles.storeWordmark}>{storeName}</Text>
              <View style={[styles.brandUnderline, { backgroundColor: colors.brandYellow }]} />
            </View>
            <View style={styles.storeCategoryPill}>
              <Text style={styles.storeCategoryText}>{cuisine}</Text>
            </View>
            <View style={styles.heroMeta}>
              <MaterialCommunityIcons name="star" size={14} color={colors.brandYellow} />
              <Text style={styles.heroMetaStrong}>{rating.replace('.', ',')}</Text>
              <Text style={styles.heroMetaText}>(2,4 mil)</Text>
              <Feather name="clock" size={13} color="#ffffff" />
              <Text style={styles.heroMetaText}>{delivery}</Text>
              <MaterialCommunityIcons name="moped" size={15} color="#ffffff" />
              <Text style={styles.heroMetaText}>
                {freeDelivery ? 'Entrega grátis' : 'Entrega a partir de R$ 6,90'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.storeSheet}>
          <View style={[styles.tabRow, { borderBottomColor: colors.border }]}>
            {(['Cardápio', 'Avaliações', 'Sobre'] as StoreTab[]).map((tab) => {
              const selected = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.storeTab,
                    { borderBottomColor: selected ? colors.brandTomato : 'transparent' },
                  ]}
                >
                  <Text style={[styles.storeTabText, { color: selected ? colors.foreground : colors.mutedForeground }]}>
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
                      style={styles.categoryChip}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          { color: selected ? colors.foreground : colors.mutedForeground },
                        ]}
                      >
                        {category}
                      </Text>
                      {selected ? <View style={[styles.categoryUnderline, { backgroundColor: colors.brandTomato }]} /> : null}
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.menuContent}>
                {menuSections.length > 0 ? menuSections.map((section) => (
                  <View key={section.category} style={styles.menuSection}>
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                      {section.category}
                    </Text>
                    <View style={styles.menuGrid}>
                      {section.items.map((item) => (
                        <View
                          key={item.id}
                          style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                        >
                          <View
                            style={[
                              styles.menuImageFrame,
                              { height: item.category === 'Combos' ? 68 : 86 },
                            ]}
                          >
                            <Image source={item.image} style={styles.menuImage} resizeMode="cover" />
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Favoritar ${item.name}`}
                              onPress={() => Alert.alert(item.name, 'Adicione este produto aos favoritos em uma próxima versão.')}
                              hitSlop={7}
                              style={styles.productFavorite}
                            >
                              <Feather name="heart" size={16} color="#ffffff" />
                            </Pressable>
                          </View>
                          <View
                            style={[
                              styles.menuCardBody,
                              item.category === 'Hambúrgueres'
                                ? styles.burgerCardBody
                                : item.category === 'Combos'
                                  ? styles.comboCardBody
                                  : null,
                            ]}
                          >
                            <Text numberOfLines={1} style={[styles.menuName, { color: colors.foreground }]}>
                              {item.name}
                            </Text>
                            <Text
                              numberOfLines={item.category === 'Hambúrgueres' ? 4 : 2}
                              style={[styles.menuDescription, { color: colors.mutedForeground }]}
                            >
                              {item.description}
                            </Text>
                            <Text style={[styles.menuPrice, { color: colors.foreground }]}>
                              {formatPrice(item.price)}
                            </Text>
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Adicionar ${item.name} à sacola`}
                              onPress={() => addItem(item)}
                              style={({ pressed }) => [
                                styles.addButton,
                                { backgroundColor: colors.brandTomato, opacity: pressed ? 0.8 : 1 },
                              ]}
                            >
                              <Feather name="plus" size={14} color="#ffffff" />
                              <Text style={styles.addLabel}>
                                {addedItems[item.id] ? `Adicionar (${addedItems[item.id]})` : 'Adicionar'}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )) : (
                  <View style={[styles.emptyMenu, { backgroundColor: colors.card }]}>
                    <Text style={[styles.emptyMenuText, { color: colors.mutedForeground }]}>
                      Nenhum item nesta categoria.
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : activeTab === 'Avaliações' ? (
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
                      <Feather name="star" size={12} color={colors.brandYellow} />
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
          ) : (
            <View style={styles.aboutSection}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Sobre a loja</Text>
              <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>
                Peça seus favoritos de {cuisine.toLocaleLowerCase('pt-BR')} com entrega em {delivery}.
              </Text>
              <View style={styles.aboutMeta}>
                <Feather name="clock" size={17} color={colors.brandGreen} />
                <Text style={[styles.aboutText, { color: colors.foreground }]}>
                  Tempo médio: {delivery}
                </Text>
              </View>
              <View style={styles.aboutMeta}>
                <Feather name="star" size={17} color={colors.brandYellow} />
                <Text style={[styles.aboutText, { color: colors.foreground }]}>
                  Nota {rating} · 2,4 mil avaliações
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {itemCount > 0 ? (
        <View
          style={[
            styles.cartBar,
            {
              backgroundColor: colors.brandInk,
              bottom: Platform.OS === 'web' ? 31 : Math.max(insets.bottom, 8),
            },
          ]}
        >
          <View style={styles.cartSummary}>
            <View style={styles.cartIconWrap}>
              <Feather name="shopping-cart" size={20} color="#ffffff" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            </View>
            <View style={styles.cartSummaryText}>
              <Text style={styles.cartTitle}>Ver sacola</Text>
              <Text style={styles.cartTotal}>{formatPrice(cartTotal)}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continuar para a sacola"
            onPress={() => router.push('/cart')}
            style={({ pressed }) => [
              styles.continueButton,
              { backgroundColor: colors.brandTomato, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text style={styles.continueLabel}>Continuar</Text>
            <Feather name="arrow-right" size={16} color="#ffffff" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  hero: { height: 204, overflow: 'hidden' },
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  heroButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCopy: {
    position: 'absolute',
    left: 26,
    right: 15,
    gap: 5,
  },
  brandLockup: {
    height: 58,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  storeWordmark: {
    color: '#ffffff',
    fontSize: 43,
    lineHeight: 49,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -2.2,
  },
  brandUnderline: {
    position: 'absolute',
    left: 144,
    bottom: 5,
    width: 52,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#ffca05',
    transform: [{ rotate: '-8deg' }],
  },
  storeCategoryPill: {
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  storeCategoryText: { color: '#ffffff', fontSize: 11, fontWeight: '500' },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 7,
    marginTop: 2,
  },
  heroMetaStrong: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  heroMetaText: { color: '#ffffff', fontSize: 11, marginRight: 4 },
  storeSheet: {
    flex: 1,
    marginTop: -16,
    paddingTop: 4,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 42,
  },
  storeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
  },
  storeTabText: { fontSize: 13, fontWeight: '700' },
  categoryRow: {
    gap: 22,
    paddingHorizontal: 19,
    paddingTop: 6,
    paddingBottom: 7,
  },
  categoryChip: {
    minHeight: 43,
    paddingHorizontal: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  categoryText: { fontSize: 11, fontWeight: '600' },
  categoryUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    borderRadius: 2,
  },
  menuContent: { paddingHorizontal: 16, paddingTop: 7 },
  menuSection: { marginBottom: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '800', marginBottom: 9, letterSpacing: -0.3 },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 8,
  },
  menuCard: {
    width: '31.7%',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuImageFrame: { position: 'relative', backgroundColor: '#161616' },
  menuImage: { width: '100%', height: '100%' },
  productFavorite: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  menuCardBody: { paddingHorizontal: 6, paddingVertical: 7, gap: 4 },
  burgerCardBody: { minHeight: 117 },
  comboCardBody: { minHeight: 100 },
  menuName: { fontSize: 10.5, fontWeight: '700' },
  menuDescription: { fontSize: 8.5, lineHeight: 11, minHeight: 22 },
  menuPrice: { marginTop: 1, fontSize: 11, fontWeight: '800' },
  addButton: {
    minHeight: 25,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 3,
    marginTop: 2,
  },
  addLabel: { color: '#ffffff', fontSize: 8.5, fontWeight: '700' },
  emptyMenu: {
    minHeight: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMenuText: { fontSize: 12 },
  reviewsList: { paddingHorizontal: 14, gap: 9, paddingTop: 13 },
  reviewCard: { padding: 13, borderWidth: 1, borderRadius: 13, gap: 7 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewName: { fontSize: 12, fontWeight: '700' },
  reviewScore: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reviewScoreText: { fontSize: 11, fontWeight: '700' },
  reviewBody: { fontSize: 11, lineHeight: 16 },
  aboutSection: { paddingHorizontal: 16, paddingTop: 17, gap: 12 },
  aboutText: { fontSize: 13, lineHeight: 19 },
  aboutMeta: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  cartBar: {
    position: 'absolute',
    left: 10,
    right: 10,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 7,
    paddingLeft: 12,
    borderRadius: 15,
  },
  cartSummary: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartIconWrap: { position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: -7,
    right: -8,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ed2635',
  },
  cartBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: '800' },
  cartSummaryText: { gap: 2 },
  cartTitle: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
  cartTotal: { color: '#c8c8c8', fontSize: 10 },
  continueButton: {
    minWidth: 112,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
  },
  continueLabel: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
});
