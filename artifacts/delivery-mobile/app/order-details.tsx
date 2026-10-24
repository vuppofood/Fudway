import React from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
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
import { getDeliveryAddress } from '@/constants/delivery-address';
import { useColors } from '@/hooks/useColors';

type OrderLine = {
  name: string;
  quantity: number;
  price: number;
  note?: string;
};

type OrderDetails = {
  restaurant: string;
  date: string;
  status: 'Entregue' | 'Em andamento' | 'Cancelado';
  amount: number;
  logo: number;
  items: OrderLine[];
  deliveryFee: number;
  discount: number;
  address: string;
  paymentMethod: string;
  events: { label: string; time: string }[];
};

const orderDetails: Record<string, OrderDetails> = {
  '123456': {
    restaurant: 'Subway',
    date: '15/04/2025',
    status: 'Entregue',
    amount: 51.6,
    logo: require('../assets/images/order-subway.png'),
    items: [
      { name: 'Subway Frango Teriyaki 15cm', quantity: 1, price: 28.9, note: 'Sem cebola' },
      { name: 'Cookie de Chocolate', quantity: 1, price: 8.9 },
      { name: 'Refrigerante Lata', quantity: 1, price: 7.5 },
    ],
    deliveryFee: 6.3,
    discount: 0,
    address: 'Rua das Flores, 123 - Apto 45\nCentro - São Paulo, SP\nCEP 01000-000',
    paymentMethod: 'Pix',
    events: [
      { label: 'Pedido confirmado', time: '18:55' },
      { label: 'Em preparo', time: '19:05' },
      { label: 'Saiu para entrega', time: '19:25' },
      { label: 'Entregue', time: '19:42' },
    ],
  },
  '123455': {
    restaurant: 'Burger King',
    date: '14/04/2025',
    status: 'Entregue',
    amount: 48.9,
    logo: require('../assets/images/order-burger-king.png'),
    items: [
      { name: 'Whopper', quantity: 1, price: 29.9 },
      { name: 'Batata média', quantity: 1, price: 12.9 },
    ],
    deliveryFee: 6.1,
    discount: 0,
    address: 'Rua das Flores, 123 - Apto 45\nCentro - São Paulo, SP\nCEP 01000-000',
    paymentMethod: 'Pix',
    events: [
      { label: 'Pedido confirmado', time: '19:25' },
      { label: 'Em preparo', time: '19:38' },
      { label: 'Saiu para entrega', time: '19:55' },
      { label: 'Entregue', time: '20:15' },
    ],
  },
  '123454': {
    restaurant: "McDonald's",
    date: '12/04/2025',
    status: 'Entregue',
    amount: 42.3,
    logo: require('../assets/images/order-mcdonalds.png'),
    items: [
      { name: 'Big Mac', quantity: 1, price: 24.9 },
      { name: 'McFritas média', quantity: 1, price: 9.9 },
      { name: 'McCola', quantity: 1, price: 7.5 },
    ],
    deliveryFee: 0,
    discount: 0,
    address: 'Rua das Flores, 123 - Apto 45\nCentro - São Paulo, SP\nCEP 01000-000',
    paymentMethod: 'Pix',
    events: [
      { label: 'Pedido confirmado', time: '12:20' },
      { label: 'Em preparo', time: '12:32' },
      { label: 'Saiu para entrega', time: '12:48' },
      { label: 'Entregue', time: '13:08' },
    ],
  },
  '123453': {
    restaurant: 'Pizzaria Itália',
    date: '10/04/2025',
    status: 'Entregue',
    amount: 36.9,
    logo: require('../assets/images/order-pizzeria.png'),
    items: [{ name: 'Pizza Marguerita pequena', quantity: 1, price: 36.9 }],
    deliveryFee: 0,
    discount: 0,
    address: 'Rua das Flores, 123 - Apto 45\nCentro - São Paulo, SP\nCEP 01000-000',
    paymentMethod: 'Pix',
    events: [
      { label: 'Pedido confirmado', time: '20:05' },
      { label: 'Em preparo', time: '20:25' },
      { label: 'Saiu para entrega', time: '21:00' },
      { label: 'Entregue', time: '21:30' },
    ],
  },
};

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function OrderDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string | string[] }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const order = orderId ? orderDetails[orderId] : undefined;
  const address = getDeliveryAddress();
  const activeEvents = order?.status === 'Entregue' ? order.events.length : 3;

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 20 : 8) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar aos pedidos"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={23} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Detalhes do pedido
        </Text>
      </View>

      {order ? (
        <>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.restaurantHeader}>
              <Image source={order.logo} style={styles.restaurantLogo} />
              <View style={styles.restaurantInfo}>
                <Text style={[styles.restaurantName, { color: colors.foreground }]}>
                  {order.restaurant}
                </Text>
                <Text style={[styles.mutedText, { color: colors.mutedForeground }]}>
                  Pedido #{orderId}
                </Text>
                <Text style={[styles.mutedText, { color: colors.mutedForeground }]}>
                  {order.date}
                </Text>
              </View>
            </View>

            <View style={styles.timeline}>
              {order.events.map((event, index) => {
                const isLast = index === order.events.length - 1;
                const completed = index < activeEvents;
                return (
                  <View key={event.label} style={styles.timelineRow}>
                    <View style={styles.timelineRail}>
                      <View
                        style={[
                          styles.timelineDot,
                          {
                            backgroundColor: completed ? colors.brandGreen : colors.border,
                            borderColor: colors.card,
                          },
                          isLast && completed ? styles.completedDot : null,
                        ]}
                      >
                        {isLast && completed ? (
                          <Feather name="check" size={12} color="#ffffff" />
                        ) : null}
                      </View>
                      {!isLast ? (
                        <View
                          style={[
                            styles.timelineLine,
                            { backgroundColor: index < activeEvents - 1 ? colors.brandGreen : colors.border },
                          ]}
                        />
                      ) : null}
                    </View>
                    <View style={styles.timelineCopy}>
                      <Text
                        style={[
                          styles.timelineLabel,
                          { color: completed ? colors.foreground : colors.mutedForeground },
                          isLast && completed ? styles.timelineLabelBold : null,
                        ]}
                      >
                        {event.label}
                      </Text>
                      <Text style={[styles.timelineTime, { color: colors.mutedForeground }]}>
                        · {event.time}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={[styles.section, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Itens do pedido</Text>
              <View style={styles.itemsList}>
                {order.items.map((item) => (
                  <View key={item.name} style={styles.itemRow}>
                    <View style={styles.itemCopy}>
                      <Text style={[styles.itemName, { color: colors.foreground }]}>
                        {item.quantity}x&nbsp; {item.name}
                      </Text>
                      {item.note ? (
                        <Text style={[styles.itemNote, { color: colors.mutedForeground }]}>
                          {item.note}
                        </Text>
                      ) : null}
                    </View>
                    <Text style={[styles.itemPrice, { color: colors.foreground }]}>
                      {formatPrice(item.price)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.section, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Resumo de valores</Text>
              <View style={[styles.priceSummary, { borderColor: colors.border }]}>
                <SummaryRow label="Subtotal" value={formatPrice(order.amount - order.deliveryFee)} colors={colors} />
                <SummaryRow
                  label="Taxa de entrega"
                  value={order.deliveryFee ? formatPrice(order.deliveryFee) : 'Grátis'}
                  colors={colors}
                />
                <SummaryRow label="Desconto" value={`-${formatPrice(order.discount)}`} colors={colors} />
                <View style={[styles.totalDivider, { borderTopColor: colors.border }]} />
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
                  <Text style={[styles.totalValue, { color: colors.foreground }]}>
                    {formatPrice(order.amount)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.section, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Endereço de entrega</Text>
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={22} color={colors.brandGreen} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>
                  {orderId === '123456'
                    ? order.address
                    : `${address}\nCentro - São Paulo, SP\nCEP 01000-000`}
                </Text>
              </View>
            </View>

            <View style={[styles.section, { borderTopColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Forma de pagamento</Text>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="qrcode" size={23} color={colors.brandGreen} />
                <Text style={[styles.paymentText, { color: colors.foreground }]}>
                  {order.paymentMethod}
                </Text>
                <Text style={[styles.paidLabel, { color: colors.foreground }]}>· Pago</Text>
              </View>
            </View>
          </ScrollView>
          <View style={[styles.helpFooter, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: '/order-help',
                  params: { orderId },
                })
              }
              style={styles.helpButton}
            >
              <Text style={[styles.helpText, { color: colors.foreground }]}>Precisa de ajuda?</Text>
              <Feather name="help-circle" size={19} color={colors.foreground} />
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.notFound}>
          <Feather name="alert-circle" size={28} color={colors.brandMutedGreen} />
          <Text style={[styles.notFoundText, { color: colors.foreground }]}>
            Não foi possível encontrar este pedido.
          </Text>
        </View>
      )}
    </View>
  );
}

function SummaryRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: colors.foreground }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  backButton: { width: 30, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  scrollView: { flex: 1 },
  content: { paddingBottom: 14 },
  restaurantHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 17, paddingTop: 9, paddingBottom: 12 },
  restaurantLogo: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f2f6f3' },
  restaurantInfo: { gap: 2 },
  restaurantName: { fontSize: 14, fontWeight: '700' },
  mutedText: { fontSize: 11, lineHeight: 15 },
  timeline: { paddingHorizontal: 20, paddingBottom: 10 },
  timelineRow: { height: 41, flexDirection: 'row', gap: 11 },
  timelineRail: { width: 20, alignItems: 'center' },
  timelineDot: {
    zIndex: 1,
    width: 15,
    height: 15,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedDot: { width: 22, height: 22, marginTop: -3 },
  timelineLine: { position: 'absolute', top: 13, bottom: -2, width: 2 },
  timelineCopy: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  timelineLabel: { fontSize: 12, lineHeight: 16 },
  timelineLabelBold: { fontWeight: '700' },
  timelineTime: { fontSize: 11, lineHeight: 16 },
  section: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 17, paddingTop: 10, paddingBottom: 9 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 7 },
  itemsList: { gap: 5 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  itemCopy: { flex: 1, gap: 1 },
  itemName: { fontSize: 12, lineHeight: 17 },
  itemNote: { paddingLeft: 27, fontSize: 11 },
  itemPrice: { fontSize: 12, lineHeight: 17 },
  priceSummary: { borderWidth: 1, borderRadius: 11, paddingHorizontal: 11, paddingVertical: 8, gap: 3 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 11, lineHeight: 16 },
  summaryValue: { fontSize: 11, lineHeight: 16 },
  totalDivider: { borderTopWidth: StyleSheet.hairlineWidth, marginVertical: 3 },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { fontSize: 14, fontWeight: '700' },
  totalValue: { fontSize: 15, fontWeight: '800' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  infoText: { fontSize: 12, lineHeight: 17 },
  paymentText: { fontSize: 12, fontWeight: '500' },
  paidLabel: { fontSize: 12 },
  helpFooter: { backgroundColor: '#ffffff' },
  helpButton: { minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  helpText: { fontSize: 12, fontWeight: '500' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 24 },
  notFoundText: { fontSize: 14, textAlign: 'center' },
});
