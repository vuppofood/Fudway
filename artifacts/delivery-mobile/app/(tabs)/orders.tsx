import React, { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type OrderFilter = 'Todos' | 'Em andamento' | 'Entregues';

type Order = {
  id: string;
  restaurant: string;
  date: string;
  status: 'Entregue' | 'Em andamento';
  amount: number;
  logo: number;
};

const filters: OrderFilter[] = ['Todos', 'Em andamento', 'Entregues'];

const orders: Order[] = [
  {
    id: '123456',
    restaurant: 'Subway',
    date: '15/04/2025',
    status: 'Entregue',
    amount: 51.6,
    logo: require('../../assets/images/order-subway.png'),
  },
  {
    id: '123455',
    restaurant: 'Burger King',
    date: '14/04/2025',
    status: 'Entregue',
    amount: 48.9,
    logo: require('../../assets/images/order-burger-king.png'),
  },
  {
    id: '123454',
    restaurant: "McDonald's",
    date: '12/04/2025',
    status: 'Entregue',
    amount: 42.3,
    logo: require('../../assets/images/order-mcdonalds.png'),
  },
  {
    id: '123453',
    restaurant: 'Pizzaria Itália',
    date: '10/04/2025',
    status: 'Entregue',
    amount: 36.9,
    logo: require('../../assets/images/order-pizzeria.png'),
  },
];

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('Todos');

  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (activeFilter === 'Em andamento') return order.status === 'Em andamento';
        if (activeFilter === 'Entregues') return order.status === 'Entregue';
        return true;
      }),
    [activeFilter],
  );

  const showOrderDetails = (order: Order) => {
    Alert.alert(
      order.restaurant,
      `Pedido #${order.id}\n${order.status} · ${order.date}\nTotal: ${formatPrice(order.amount)}`,
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.brandDeepGreen }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brandDeepGreen} />
      <View style={[styles.header, { paddingTop: topInset + 3 }]}>
        <Text style={styles.title}>Meus pedidos</Text>
      </View>

      <ScrollView
        style={[styles.content, { backgroundColor: colors.brandCream }]}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filterRow}>
          {filters.map((filter) => {
            const selected = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selected ? colors.brandGreen : colors.card,
                    borderColor: selected ? colors.brandGreen : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: selected ? '#ffffff' : colors.foreground },
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {visibleOrders.length > 0 ? (
          <View style={styles.orderList}>
            {visibleOrders.map((order) => (
              <Pressable
                key={order.id}
                accessibilityRole="button"
                accessibilityLabel={`${order.restaurant}, pedido ${order.id}, ${order.status}, ${formatPrice(order.amount)}`}
                onPress={() => showOrderDetails(order)}
                style={({ pressed }) => [
                  styles.orderCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Image source={order.logo} style={styles.orderLogo} />
                <View style={styles.orderInfo}>
                  <Text style={[styles.restaurantName, { color: colors.foreground }]}>
                    {order.restaurant}
                  </Text>
                  <Text style={[styles.orderMeta, { color: colors.mutedForeground }]}>
                    #{order.id} · {order.date}
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
                    <Text style={[styles.statusText, { color: colors.brandGreen }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderAside}>
                  <Feather
                    name="chevron-right"
                    size={17}
                    color={colors.brandMutedGreen}
                  />
                  <Text style={[styles.orderPrice, { color: colors.foreground }]}>
                    {formatPrice(order.amount)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Feather name="clipboard" size={32} color={colors.brandGreen} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Nenhum pedido em andamento
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.brandMutedGreen }]}>
              Seus pedidos ativos aparecerão aqui.
            </Text>
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
    paddingBottom: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.35,
  },
  content: {
    flex: 1,
    marginHorizontal: 8,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    overflow: 'hidden',
  },
  contentInner: {
    flexGrow: 1,
    paddingHorizontal: 11,
    paddingTop: 12,
    paddingBottom: 105,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 13,
  },
  filterButton: {
    flex: 1,
    minHeight: 36,
    paddingHorizontal: 7,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: { fontSize: 11, fontWeight: '600' },
  orderList: { gap: 9 },
  orderCard: {
    minHeight: 98,
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderLogo: {
    width: 56,
    height: 56,
    borderRadius: 13,
    backgroundColor: '#f2f6f3',
  },
  orderInfo: { flex: 1, gap: 4 },
  restaurantName: { fontSize: 13, fontWeight: '700' },
  orderMeta: { fontSize: 10, fontWeight: '500' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  orderAside: {
    height: 58,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  orderPrice: { fontSize: 12, fontWeight: '800' },
  emptyState: {
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  emptyDescription: { fontSize: 12, textAlign: 'center' },
});
