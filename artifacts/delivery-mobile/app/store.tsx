import React, { useMemo, useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useColors } from '@/hooks/useColors';

type StoreCategory = 'Hambúrgueres' | 'Combos' | 'Porções' | 'Bebidas' | 'Sobremesas';
type MenuFilter = 'Todos' | StoreCategory;
type StoreTab = 'Cardápio' | 'Avaliações' | 'Sobre';
type ReviewFilter = 'Mais recentes' | 'Melhores' | 'Piores';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPercent?: number;
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

const storeCoupons = [
  { offer: 'R$ 10 OFF', details: 'Em pedidos acima\nde R$ 30' },
  { offer: '15% OFF', details: 'Em pedidos acima\nde R$ 40' },
  { offer: 'R$ 15 OFF', details: 'Para novos clientes' },
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
    discountPercent: 15,
    category: 'Combos',
    image: require('../assets/images/reference/combo-classico.jpg'),
  },
  {
    id: 'combo-bacon',
    name: 'Combo Bacon',
    description: 'Hambúrguer + batata média + refrigerante 350ml',
    price: 29.9,
    discountPercent: 15,
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
    discountPercent: 15,
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
      discountPercent: 15,
      category: 'Combos',
      image: require('../assets/images/restaurant-burger.jpg'),
    },
    {
      id: 'king-bacon-combo',
      name: 'Combo Bacon',
      description: 'Burger bacon, batata média e refrigerante 350ml.',
      price: 37.9,
      discountPercent: 15,
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
      discountPercent: 15,
      category: 'Combos',
      image: require('../assets/images/menu-subway-classic.png'),
    },
    {
      id: 'house-burger',
      name: 'Combo Burger',
      description: 'Burger especial com batata e bebida.',
      price: 39.9,
      discountPercent: 15,
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
  {
    name: 'Mariana A.',
    date: 'há 3 dias',
    text: 'Sanduíche fresquinho e muito bem montado.',
    rating: 5,
  },
  {
    name: 'Lucas R.',
    date: 'há 5 dias',
    text: 'Entrega rápida e atendimento ótimo.',
    rating: 4.8,
    response: 'Obrigado pela preferência! Esperamos seu próximo pedido.',
  },
  {
    name: 'Camila S.',
    date: 'há 1 semana',
    text: 'Tudo chegou certinho. Pedi de novo!',
    rating: 5,
  },
  {
    name: 'Felipe M.',
    date: 'há 1 semana',
    text: 'O lanche é muito bom, mas a entrega demorou um pouco.',
    rating: 4,
    response: 'Olá, sentimos muito pelo atraso. Já estamos ajustando para melhorar ainda mais o nosso atendimento!',
  },
];

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getDiscountedPrice = (item: MenuItem) =>
  item.discountPercent
    ? Math.round(item.price * (100 - item.discountPercent)) / 100
    : item.price;

export default function StoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { itemCount, subtotal: cartTotal } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const params = useLocalSearchParams<{
    name?: string;
    cuisine?: string;
    rating?: string;
    delivery?: string;
    freeDelivery?: string;
  }>();
  const topInset = Platform.OS === 'web' ? 20 : insets.top;
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
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('Mais recentes');
  const storeIsFavorite = isFavorite(storeName);
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
  const visibleReviews = useMemo(() => {
    if (reviewFilter === 'Melhores') {
      return [...reviews].sort((first, second) => second.rating - first.rating);
    }
    if (reviewFilter === 'Piores') {
      return [...reviews].sort((first, second) => first.rating - second.rating);
    }
    return reviews;
  }, [reviewFilter]);
  const openProduct = (item: MenuItem) =>
    router.push({
      pathname: '/product',
      params: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: String(getDiscountedPrice(item)),
        originalPrice: item.discountPercent ? String(item.price) : undefined,
        discountPercent: item.discountPercent ? String(item.discountPercent) : undefined,
        image: String(item.image),
        category: item.category,
        storeName,
        cuisine,
      },
    });
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
                accessibilityLabel={storeIsFavorite ? `Remover ${storeName} dos favoritos` : `Favoritar ${storeName}`}
                accessibilityState={{ selected: storeIsFavorite }}
                onPress={() => toggleFavorite(storeName)}
                style={styles.heroButton}
              >
                <MaterialCommunityIcons
                  name={storeIsFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={storeIsFavorite ? '#e53935' : '#ffffff'}
                />
              </Pressable>
            </View>
          </View>
          <View
            style={[
              styles.heroCopy,
              { top: Platform.OS === 'web' ? 52 : topInset + 18 },
            ]}
          >
            <View style={styles.brandLockup}>
              <Text style={styles.storeWordmark}>{storeName}</Text>
              <View style={[styles.brandUnderline, { backgroundColor: colors.brandYellow }]} />
            </View>
            <View style={styles.storeCategoryPill}>
              <Text style={styles.storeCategoryText}>{storeName}</Text>
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

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.couponRow}
              >
                {storeCoupons.map((coupon) => (
                  <View
                    key={coupon.offer}
                    accessibilityLabel={`${coupon.offer}. ${coupon.details.replace('\n', ' ')}`}
                    style={[styles.couponCard, { backgroundColor: colors.brandGreen }]}
                  >
                    <View style={styles.couponIconSection}>
                      <MaterialCommunityIcons
                        name="ticket-percent-outline"
                        size={24}
                        color="#ffffff"
                      />
                    </View>
                    <View style={styles.couponCopy}>
                      <Text style={styles.couponOffer}>{coupon.offer}</Text>
                      <Text style={styles.couponDescription}>{coupon.details}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.menuContent}>
                {menuSections.length > 0 ? menuSections.map((section) => (
                  <View
                    key={section.category}
                    style={[
                      styles.menuSection,
                      section.category === 'Combos' ? styles.lastVisibleMenuSection : null,
                    ]}
                  >
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
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Ver ${item.name}`}
                              onPress={() => openProduct(item)}
                              style={StyleSheet.absoluteFill}
                            >
                              <Image source={item.image} style={styles.menuImage} resizeMode="cover" />
                            </Pressable>
                          </View>
                          <View style={styles.menuCardBody}>
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Ver ${item.name}`}
                              onPress={() => openProduct(item)}
                            >
                              <Text numberOfLines={1} style={[styles.menuName, { color: colors.foreground }]}>
                                {item.name}
                              </Text>
                            </Pressable>
                            {item.discountPercent ? (
                              <View style={styles.discountPrices}>
                                <Text style={[styles.menuPrice, { color: '#000000' }]}>
                                  {formatPrice(getDiscountedPrice(item))}
                                </Text>
                                <View style={styles.discountDetails}>
                                  <Text style={[styles.originalMenuPrice, { color: '#000000' }]}>
                                    {formatPrice(item.price)}
                                  </Text>
                                  <View style={[styles.menuDiscountBadge, { backgroundColor: colors.brandGreen }]}>
                                    <Text style={[styles.menuDiscountText, { color: '#ffffff' }]}>
                                      {item.discountPercent}% OFF
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            ) : (
                              <Text style={[styles.menuPrice, { color: colors.foreground }]}>
                                {formatPrice(item.price)}
                              </Text>
                            )}
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
              <View style={[styles.ratingSummary, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <View style={styles.ratingSummaryHeader}>
                  <Text style={[styles.averageRating, { color: colors.foreground }]}>
                    {rating.replace('.', ',')}
                  </Text>
                  <View style={styles.ratingSummaryDetails}>
                    <View style={styles.ratingStars}>
                      {[0, 1, 2, 3, 4].map((star) => (
                        <MaterialCommunityIcons
                          key={star}
                          name={star === 4 ? 'star-half-full' : 'star'}
                          size={22}
                          color={colors.brandYellow}
                        />
                      ))}
                    </View>
                    <Text style={[styles.reviewCount, { color: colors.mutedForeground }]}>
                      2,4 mil avaliações
                    </Text>
                  </View>
                </View>
                {[
                  { label: '5 estrelas', percent: 78 },
                  { label: '4 estrelas', percent: 15 },
                  { label: '3 estrelas', percent: 4 },
                  { label: '2 estrelas', percent: 2 },
                  { label: '1 estrela', percent: 1 },
                ].map((row) => (
                  <View key={row.label} style={styles.ratingBreakdownRow}>
                    <Text style={[styles.ratingBreakdownLabel, { color: colors.foreground }]}>{row.label}</Text>
                    <View style={[styles.ratingTrack, { backgroundColor: colors.muted }]}>
                      <View
                        style={[
                          styles.ratingFill,
                          { width: `${row.percent}%`, backgroundColor: colors.brandYellow },
                        ]}
                      />
                    </View>
                    <Text style={[styles.ratingPercent, { color: colors.foreground }]}>{row.percent}%</Text>
                  </View>
                ))}
              </View>
              <View style={styles.reviewFilters}>
                {(['Mais recentes', 'Melhores', 'Piores'] as ReviewFilter[]).map((filter) => {
                  const selected = reviewFilter === filter;
                  return (
                    <Pressable
                      key={filter}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setReviewFilter(filter)}
                      style={[
                        styles.reviewFilterChip,
                        {
                          backgroundColor: selected ? colors.secondary : colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.reviewFilterText, { color: colors.foreground }]}>{filter}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {visibleReviews.map((review) => (
                <View
                  key={review.name}
                  style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewName, { color: colors.foreground }]}>{review.name}</Text>
                    <View style={styles.reviewScore}>
                      <MaterialCommunityIcons name="star" size={15} color={colors.brandYellow} />
                      <Text style={[styles.reviewScoreText, { color: colors.foreground }]}>
                        {review.rating.toFixed(1).replace('.', ',')}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{review.date}</Text>
                  <Text style={[styles.reviewBody, { color: colors.foreground }]}>{review.text}</Text>
                  {review.response ? (
                    <View style={[styles.storeResponse, { backgroundColor: colors.secondary }]}>
                      <Feather name="home" size={16} color={colors.foreground} />
                      <View style={styles.storeResponseCopy}>
                        <Text style={[styles.storeResponseTitle, { color: colors.foreground }]}>Resposta da loja</Text>
                        <Text style={[styles.storeResponseText, { color: colors.mutedForeground }]}>
                          {review.response}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.aboutSection}>
              <View style={[styles.aboutCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={[styles.aboutCardTitle, { color: colors.foreground }]}>Sobre a loja</Text>
                <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>
                  Peça seus favoritos de {cuisine.toLocaleLowerCase('pt-BR')} com entrega em {delivery}.
                </Text>
              </View>
              <View style={[styles.aboutCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={[styles.aboutCardTitle, { color: colors.foreground }]}>Endereço</Text>
                <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>
                  Rua das Flores, 123 - Jardim das Acácias{'\n'}São Paulo - SP, 04567-890
                </Text>
              </View>
              <View style={[styles.aboutCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={[styles.aboutCardTitle, { color: colors.foreground }]}>Horário de funcionamento</Text>
                {[
                  ['Quarta-Feira', '16:00 às 23:45'],
                  ['Quinta-Feira', '16:00 às 23:45'],
                  ['Sexta-Feira', '16:00 às 23:59'],
                  ['Sábado', '00:00 às 00:45 - 16:00 às 23:59'],
                  ['Domingo', '00:00 às 00:45 - 16:00 às 23:00'],
                  ['Segunda-Feira', '16:00 às 23:00'],
                  ['Terça-Feira', '16:00 às 23:45'],
                ].map(([day, hours]) => (
                  <View key={day} style={styles.hoursRow}>
                    <Text style={[styles.aboutText, styles.hoursDay, { color: colors.mutedForeground }]}>{day}</Text>
                    <Text style={[styles.aboutText, styles.hoursValue, { color: colors.mutedForeground }]}>{hours}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.aboutCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={[styles.aboutCardTitle, { color: colors.foreground }]}>CNPJ</Text>
                <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>59.425.704/0001-59</Text>
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
              bottom: Platform.OS === 'web' ? 8 : Math.max(insets.bottom, 8),
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
  hero: { height: 185, overflow: 'hidden' },
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
  couponRow: { gap: 8, paddingHorizontal: 12, paddingTop: 2, paddingBottom: 8 },
  couponCard: {
    width: 160,
    minHeight: 60,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  couponIconSection: {
    width: 50,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.25)',
  },
  couponCopy: { flex: 1, paddingHorizontal: 6, gap: 1 },
  couponOffer: { color: '#ffffff', fontSize: 12, fontWeight: '800' },
  couponDescription: { color: '#ffffff', fontSize: 8, lineHeight: 10 },
  menuContent: { paddingHorizontal: 16, paddingTop: 7 },
  menuSection: { marginBottom: 8 },
  lastVisibleMenuSection: { marginBottom: 84 },
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
  menuCardBody: { paddingHorizontal: 6, paddingVertical: 7, gap: 4 },
  menuName: { fontSize: 10.5, fontWeight: '700' },
  discountPrices: { alignItems: 'flex-start', gap: 1 },
  discountDetails: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  originalMenuPrice: { fontSize: 9, textDecorationLine: 'line-through' },
  menuDiscountBadge: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
  menuDiscountText: { fontSize: 8, fontWeight: '700' },
  menuPrice: { marginTop: 1, fontSize: 11, fontWeight: '800' },
  emptyMenu: {
    minHeight: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMenuText: { fontSize: 12 },
  reviewsList: { paddingHorizontal: 14, gap: 9, paddingTop: 13 },
  ratingSummary: { padding: 13, borderWidth: 1, borderRadius: 14, gap: 9 },
  ratingSummaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 1 },
  averageRating: { fontSize: 52, lineHeight: 58, fontWeight: '900', letterSpacing: -2 },
  ratingSummaryDetails: { gap: 2 },
  ratingStars: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  reviewCount: { fontSize: 11, fontWeight: '500' },
  ratingBreakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingBreakdownLabel: { width: 68, fontSize: 10 },
  ratingTrack: { flex: 1, height: 7, borderRadius: 5, overflow: 'hidden' },
  ratingFill: { height: '100%', borderRadius: 5 },
  ratingPercent: { width: 30, textAlign: 'right', fontSize: 10 },
  reviewFilters: { flexDirection: 'row', gap: 8, marginVertical: 1 },
  reviewFilterChip: { minHeight: 34, paddingHorizontal: 13, borderWidth: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  reviewFilterText: { fontSize: 11, fontWeight: '600' },
  reviewCard: { padding: 12, borderWidth: 1, borderRadius: 13, gap: 5 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewName: { fontSize: 12, fontWeight: '700' },
  reviewDate: { fontSize: 10 },
  reviewScore: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  reviewScoreText: { fontSize: 10, fontWeight: '700' },
  reviewBody: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  storeResponse: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, padding: 10, borderRadius: 10, marginTop: 2 },
  storeResponseCopy: { flex: 1, gap: 3 },
  storeResponseTitle: { fontSize: 10, fontWeight: '700' },
  storeResponseText: { fontSize: 10, lineHeight: 14 },
  aboutSection: { paddingHorizontal: 14, paddingTop: 13, gap: 10, paddingBottom: 8 },
  aboutCard: { padding: 13, borderWidth: 1, borderRadius: 14, gap: 6 },
  aboutCardTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  aboutText: { fontSize: 12, lineHeight: 19 },
  hoursRow: { flexDirection: 'row', gap: 8 },
  hoursDay: { width: '40%' },
  hoursValue: { flex: 1 },
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
    backgroundColor: '#0b5735',
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
