import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const issues = [
  { id: 'wrong', label: 'Pedido veio errado ou incompleto', icon: 'shopping-bag' as const },
  { id: 'missing', label: 'Não recebi meu pedido', icon: 'map-pin' as const },
  { id: 'payment', label: 'Problema com o pagamento ou cobrança', icon: 'credit-card' as const },
  { id: 'cancel', label: 'Quero cancelar o meu pedido', icon: 'x-circle' as const },
  { id: 'refund', label: 'Não recebi o meu reembolso', icon: 'dollar-sign' as const },
];

const orders: Record<string, { restaurant: string; date: string; total: number; logo: number }> = {
  '123456': {
    restaurant: 'Subway',
    date: '15/04/2025',
    total: 51.6,
    logo: require('../assets/images/order-subway.png'),
  },
  '123455': {
    restaurant: 'Burger King',
    date: '14/04/2025',
    total: 48.9,
    logo: require('../assets/images/order-burger-king.png'),
  },
  '123454': {
    restaurant: "McDonald's",
    date: '12/04/2025',
    total: 42.3,
    logo: require('../assets/images/order-mcdonalds.png'),
  },
  '123453': {
    restaurant: 'Pizzaria Itália',
    date: '10/04/2025',
    total: 36.9,
    logo: require('../assets/images/order-pizzeria.png'),
  },
};

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function OrderHelpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string | string[] }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const order = orderId ? orders[orderId] : undefined;
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const contactSupport = () => {
    if (!selectedIssue) {
      Alert.alert('Selecione um problema', 'Escolha uma opção para continuar.');
      return;
    }
    router.push({
      pathname: '/order-chat',
      params: {
        orderId,
        issue: issues.find((issue) => issue.id === selectedIssue)?.label,
        issueId: selectedIssue,
      },
    });
  };

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
          accessibilityLabel="Voltar aos detalhes do pedido"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={23} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Precisa de ajuda?</Text>
        <View style={styles.backButton} />
      </View>

      {order ? (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.orderCard, { borderColor: colors.border }]}>
              <View style={styles.logoColumn}>
                <Image source={order.logo} style={styles.logo} resizeMode="contain" />
              </View>
              <View style={styles.orderSummary}>
                <Text numberOfLines={1} style={[styles.orderMeta, { color: colors.mutedForeground }]}>
                  {order.restaurant} · Pedido #{orderId} · {order.date}
                </Text>
                <View style={styles.summaryBottom}>
                  <View style={styles.deliveredStatus}>
                    <Feather name="check-circle" size={16} color={colors.brandGreen} />
                    <Text style={[styles.deliveredText, { color: colors.foreground }]}>Entregue</Text>
                  </View>
                  <View style={styles.totalSummary}>
                    <Text style={[styles.totalCaption, { color: colors.mutedForeground }]}>Total</Text>
                    <Text style={[styles.totalAmount, { color: colors.foreground }]}>
                      {formatPrice(order.total)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={[styles.question, { color: colors.foreground }]}>
              Qual o problema com o pedido?
            </Text>
            <View style={styles.issueList}>
              {issues.map((issue) => {
                const selected = selectedIssue === issue.id;
                return (
                  <Pressable
                    key={issue.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setSelectedIssue(issue.id)}
                    style={[
                      styles.issueOption,
                      {
                        borderColor: selected ? colors.brandGreen : colors.border,
                        backgroundColor: selected ? colors.brandMint : colors.card,
                      },
                    ]}
                  >
                    <Feather name={issue.icon} size={23} color={colors.brandDeepGreen} />
                    <Text style={[styles.issueLabel, { color: colors.foreground }]}>{issue.label}</Text>
                    <Feather name="chevron-right" size={21} color={colors.foreground} />
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <Pressable
              accessibilityRole="button"
              onPress={contactSupport}
              style={({ pressed }) => [
                styles.supportButton,
                { backgroundColor: colors.brandGreen, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={styles.supportButtonText}>Falar com o suporte</Text>
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

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    paddingBottom: 8,
  },
  backButton: { width: 30, height: 38, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontSize: 19, fontWeight: '700', letterSpacing: -0.2 },
  scrollView: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 7, paddingBottom: 18 },
  orderCard: {
    minHeight: 95,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 13,
    padding: 11,
    gap: 12,
  },
  logoColumn: {
    width: 82,
    minHeight: 66,
    borderRightWidth: 1,
    borderRightColor: '#dfeae3',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 10,
  },
  logo: { width: 66, height: 55 },
  orderSummary: { flex: 1, gap: 13 },
  orderMeta: { fontSize: 11, fontWeight: '500' },
  summaryBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  deliveredStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deliveredText: { fontSize: 12, fontWeight: '500' },
  totalSummary: { alignItems: 'flex-end', gap: 2 },
  totalCaption: { fontSize: 10 },
  totalAmount: { fontSize: 13, fontWeight: '800' },
  question: { fontSize: 18, lineHeight: 24, fontWeight: '800', marginTop: 22, marginBottom: 13 },
  issueList: { gap: 9 },
  issueOption: {
    minHeight: 57,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    gap: 12,
  },
  issueLabel: { flex: 1, fontSize: 13, fontWeight: '500' },
  footer: { paddingHorizontal: 16, paddingTop: 9, backgroundColor: '#ffffff' },
  supportButton: {
    minHeight: 56,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 24 },
  notFoundText: { fontSize: 14, textAlign: 'center' },
});
