import React, { useMemo, useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';

type OrderStatus = 'Entregue' | 'Em andamento' | 'Cancelado';
type OrderFilter = 'Todos' | 'Em andamento' | 'Entregues' | 'Cancelados';

type Order = {
  id: string;
  restaurant: string;
  date: string;
  status: OrderStatus;
  deliveredAt?: string;
  itemCount: number;
  cuisine: string;
  rating: string;
  delivery: string;
  amount: number;
  logo: number;
};

const filters: OrderFilter[] = ['Todos', 'Em andamento', 'Entregues', 'Cancelados'];

const orders: Order[] = [
  {
    id: '123456',
    restaurant: 'Subway',
    date: '15/04/2025',
    status: 'Entregue',
    deliveredAt: '19:42',
    itemCount: 3,
    cuisine: 'Sanduíches',
    rating: '4.3',
    delivery: '25–35 min',
    amount: 51.6,
    logo: require('../../assets/images/order-subway.png'),
  },
  {
    id: '123455',
    restaurant: 'Burger King',
    date: '14/04/2025',
    status: 'Entregue',
    deliveredAt: '20:15',
    itemCount: 2,
    cuisine: 'Hambúrgueres',
    rating: '4.8',
    delivery: '30–40 min',
    amount: 48.9,
    logo: require('../../assets/images/order-burger-king.png'),
  },
  {
    id: '123454',
    restaurant: "McDonald's",
    date: '12/04/2025',
    status: 'Entregue',
    deliveredAt: '13:08',
    itemCount: 4,
    cuisine: 'Hambúrgueres',
    rating: '4.6',
    delivery: '20–30 min',
    amount: 42.3,
    logo: require('../../assets/images/order-mcdonalds.png'),
  },
  {
    id: '123453',
    restaurant: 'Pizzaria Itália',
    date: '10/04/2025',
    status: 'Entregue',
    deliveredAt: '21:30',
    itemCount: 1,
    cuisine: 'Pizzas',
    rating: '5.0',
    delivery: '35–45 min',
    amount: 36.9,
    logo: require('../../assets/images/order-pizzeria.png'),
  },
];

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function OrdersScreen() {
  const colors = useColors();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('Todos');
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [viewportHeight, setViewportHeight] = useState(0);
  const topInset = Platform.OS === 'web' ? 32 : 0;
  const emptyStateHeight = Math.max(
    150,
    viewportHeight - (topInset + 8) - 34 - 61 - 105,
  );

  const visibleOrders = useMemo(
    () =>
      activeFilter === 'Todos'
        ? orders
        : orders.filter((order) =>
            activeFilter === 'Entregues'
              ? order.status === 'Entregue'
              : activeFilter === 'Cancelados'
                ? order.status === 'Cancelado'
                : order.status === 'Em andamento',
          ),
    [activeFilter],
  );

  const showOrderDetails = (order: Order) =>
    router.push({ pathname: '/order-details', params: { orderId: order.id } });

  const reorder = (order: Order) =>
    router.push({
      pathname: '/store',
      params: {
        name: order.restaurant,
        cuisine: order.cuisine,
        rating: order.rating,
        delivery: order.delivery,
        freeDelivery: 'true',
      },
    });

  const rateOrder = (order: Order) => {
    Alert.alert('Avaliar pedido', `Como foi seu pedido de ${order.restaurant}?`, [
      ...[1, 2, 3, 4, 5].map((score) => ({
        text: `${score} ${score === 1 ? 'estrela' : 'estrelas'}`,
        onPress: () => setRatings((current) => ({ ...current, [order.id]: score })),
      })),
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <ScrollView
        style={styles.content}
        onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
        contentContainerStyle={[
          styles.contentInner,
          { paddingTop: topInset + 8, paddingBottom: 105 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Pedidos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((filter) => {
            const selected = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selected ? colors.brandGreen : colors.card,
                    borderColor: selected ? colors.brandGreen : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    { color: selected ? '#ffffff' : colors.foreground },
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {visibleOrders.length > 0 ? (
          <View style={styles.orderList}>
            {visibleOrders.map((order) => (
              <View
                key={order.id}
                style={[
                  styles.orderCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Ver detalhes de ${order.restaurant}, pedido ${order.id}`}
                  onPress={() => showOrderDetails(order)}
                  style={styles.orderDetails}
                >
                  <Image source={order.logo} style={styles.orderLogo} />
                  <View style={styles.orderInfo}>
                    <Text numberOfLines={1} style={[styles.restaurantName, { color: colors.foreground }]}>
                      {order.restaurant}
                    </Text>
                    <Text style={[styles.orderMeta, { color: colors.mutedForeground }]}>
                      #{order.id} · {order.date} · {order.itemCount}{' '}
                      {order.itemCount === 1 ? 'item' : 'itens'}
                    </Text>
                    <View style={styles.statusRow}>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor:
                              order.status === 'Entregue'
                                ? colors.brandGreen
                                : colors.brandYellow,
                          },
                        ]}
                      />
                      <Text style={[styles.statusText, { color: colors.foreground }]}>
                        {order.deliveredAt
                          ? `Entregue às ${order.deliveredAt}`
                          : order.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderAside}>
                    <Feather name="chevron-right" size={20} color={colors.foreground} />
                    <Text style={[styles.orderPrice, { color: colors.foreground }]}>
                      {formatPrice(order.amount)}
                    </Text>
                  </View>
                </Pressable>
                <View style={styles.orderActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Pedir novamente de ${order.restaurant}`}
                    onPress={() => reorder(order)}
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.reorderButton,
                      { borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
                    ]}
                  >
                    <Text style={[styles.actionLabel, { color: colors.foreground }]}>
                      Pedir novamente
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      ratings[order.id]
                        ? `Pedido avaliado com ${ratings[order.id]} estrelas`
                        : `Avaliar pedido de ${order.restaurant}`
                    }
                    disabled={Boolean(ratings[order.id])}
                    onPress={() => rateOrder(order)}
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.rateButton,
                      {
                        backgroundColor: colors.brandMint,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    {ratings[order.id] ? (
                      <View style={styles.ratedLabel}>
                        <MaterialCommunityIcons name="star" size={15} color={colors.brandGreen} />
                        <Text style={[styles.actionLabel, { color: colors.foreground }]}>
                          Avaliado · {ratings[order.id]}
                        </Text>
                      </View>
                    ) : (
                      <Text style={[styles.actionLabel, { color: colors.foreground }]}>Avaliar</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyState, { height: emptyStateHeight }]}>
            <Feather name="clipboard" size={32} color={colors.brandGreen} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhum pedido encontrado
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>
              {activeFilter === 'Todos'
                ? 'Seus pedidos aparecerão aqui.'
                : `Você não tem pedidos ${activeFilter.toLocaleLowerCase('pt-BR')}.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1 },
  contentInner: { flexGrow: 1, paddingHorizontal: 15 },
  title: { fontSize: 27, lineHeight: 34, fontWeight: '800', letterSpacing: -0.7 },
  filterRow: { gap: 8, paddingTop: 12, paddingBottom: 15 },
  filterChip: {
    height: 34,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 15,
    alignSelf: 'flex-start',
    flexGrow: 0,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterLabel: { fontSize: 11, fontWeight: '600' },
  orderList: { gap: 9 },
  orderCard: { padding: 9, borderWidth: 1, borderRadius: 14, gap: 9 },
  orderDetails: { minHeight: 67, flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderLogo: { width: 51, height: 51, borderRadius: 26, backgroundColor: '#f2f6f3' },
  orderInfo: { flex: 1, minWidth: 0, gap: 3 },
  restaurantName: { fontSize: 14, fontWeight: '700' },
  orderMeta: { fontSize: 10, fontWeight: '500' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '500' },
  orderAside: { height: 51, alignItems: 'flex-end', justifyContent: 'space-between' },
  orderPrice: { fontSize: 13, fontWeight: '800' },
  orderActions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    flex: 1,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  reorderButton: { borderWidth: 1 },
  rateButton: {},
  actionLabel: { fontSize: 11, fontWeight: '600' },
  ratedLabel: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  emptyDescription: { fontSize: 12, textAlign: 'center' },
});
