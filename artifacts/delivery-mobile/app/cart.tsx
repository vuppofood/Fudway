import React, { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: number;
};

const initialItems: CartItem[] = [
  {
    id: 'subway-classico',
    name: 'Subway Clássico',
    price: 24.9,
    image: require('../assets/images/cart-sandwich.png'),
  },
  {
    id: 'batata-rustica',
    name: 'Batata Rústica',
    price: 12.9,
    image: require('../assets/images/cart-potatoes.png'),
  },
  {
    id: 'refrigerante',
    name: 'Refrigerante 350ml',
    price: 6.9,
    image: require('../assets/images/cart-drink.png'),
  },
];

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : Platform.OS === 'android' ? 0 : insets.top;
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'subway-classico': 1,
    'batata-rustica': 1,
    refrigerante: 1,
  });
  const [couponText, setCouponText] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * (quantities[item.id] ?? 1),
        0,
      ),
    [items, quantities],
  );
  const deliveryFee = items.length > 0 ? 6.9 : 0;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount + deliveryFee;

  const changeQuantity = (id: string, amount: number) => {
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(1, (current[id] ?? 1) + amount),
    }));
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    if (items.length === 0) return;
    Alert.alert('Esvaziar carrinho', 'Deseja remover todos os itens?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Esvaziar', style: 'destructive', onPress: () => setItems([]) },
    ]);
  };

  const applyCoupon = () => {
    if (couponText.trim().toUpperCase() === 'LANCHE10') {
      setCouponApplied(true);
      Alert.alert('Cupom aplicado', 'Você ganhou 10% de desconto nos produtos.');
      return;
    }
    setCouponApplied(false);
    Alert.alert('Cupom inválido', 'Confira o código e tente novamente.');
  };

  const finishOrder = () => {
    if (items.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos antes de finalizar.');
      return;
    }
    Alert.alert(
      'Pedido de demonstração',
      'A tela está pronta, mas este protótipo ainda não processa pagamentos.',
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.brandDeepGreen }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <View style={[styles.header, { paddingTop: topInset + 3 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.headerAction}
          >
            <Feather name="arrow-left" size={22} color="#ffffff" />
          </Pressable>
          <Text style={styles.headerTitle}>Meu carrinho</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Esvaziar carrinho"
            onPress={clearCart}
            hitSlop={10}
            style={styles.headerAction}
          >
            <Feather
              name="trash-2"
              size={19}
              color={items.length > 0 ? '#ffffff' : colors.brandMutedGreen}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.panel,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {items.length > 0 ? (
            <>
              <View style={styles.itemList}>
                {items.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.cartItem,
                      index < items.length - 1 && {
                        borderBottomColor: colors.border,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      },
                    ]}
                  >
                    <Image source={item.image} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text
                        numberOfLines={1}
                        style={[styles.productName, { color: colors.foreground }]}
                      >
                        {item.name}
                      </Text>
                      <Text style={[styles.productPrice, { color: colors.foreground }]}>
                        {formatPrice(item.price)}
                      </Text>
                      <View
                        style={[
                          styles.quantityControl,
                          { borderColor: colors.border },
                        ]}
                      >
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Diminuir ${item.name}`}
                          onPress={() => changeQuantity(item.id, -1)}
                          style={styles.quantityButton}
                        >
                          <Feather name="minus" size={13} color={colors.brandGreen} />
                        </Pressable>
                        <Text style={[styles.quantity, { color: colors.foreground }]}>
                          {quantities[item.id] ?? 1}
                        </Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Aumentar ${item.name}`}
                          onPress={() => changeQuantity(item.id, 1)}
                          style={styles.quantityButton}
                        >
                          <Feather name="plus" size={13} color={colors.brandGreen} />
                        </Pressable>
                      </View>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remover ${item.name}`}
                      onPress={() => removeItem(item.id)}
                      hitSlop={8}
                      style={styles.removeButton}
                    >
                      <Feather name="trash-2" size={17} color={colors.brandGreen} />
                    </Pressable>
                  </View>
                ))}
              </View>

              <View style={styles.checkoutArea}>
                <View style={styles.couponSection}>
                  <View style={styles.couponLabelRow}>
                    <Feather name="tag" size={14} color={colors.brandYellow} />
                    <Text style={[styles.couponTitle, { color: colors.foreground }]}>
                      Cupom de desconto
                    </Text>
                    {couponApplied ? (
                      <Text style={[styles.couponApplied, { color: colors.brandGreen }]}>
                        LANCHE10 aplicado
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.couponControls}>
                    <TextInput
                      accessibilityLabel="Código de desconto"
                      autoCapitalize="characters"
                      onChangeText={setCouponText}
                      placeholder="Digite o código"
                      placeholderTextColor={colors.mutedForeground}
                      value={couponText}
                      style={[
                        styles.couponInput,
                        { borderColor: colors.border, color: colors.foreground },
                      ]}
                    />
                    <Pressable
                      accessibilityRole="button"
                      onPress={applyCoupon}
                      style={({ pressed }) => [
                        styles.applyButton,
                        { backgroundColor: colors.brandMint, opacity: pressed ? 0.75 : 1 },
                      ]}
                    >
                      <Text style={[styles.applyText, { color: colors.brandGreen }]}>
                        Aplicar
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View style={[styles.summary, { borderTopColor: colors.border }]}>
                  <SummaryRow label="Subtotal" value={formatPrice(subtotal)} colors={colors} />
                  <SummaryRow
                    label="Taxa de entrega"
                    value={formatPrice(deliveryFee)}
                    colors={colors}
                  />
                  {couponApplied ? (
                    <SummaryRow
                      label="Desconto"
                      value={`− ${formatPrice(discount)}`}
                      colors={colors}
                    />
                  ) : null}
                  <SummaryRow
                    label="Total"
                    value={formatPrice(total)}
                    colors={colors}
                    emphasized
                  />
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={finishOrder}
                  style={({ pressed }) => [
                    styles.checkoutButton,
                    { backgroundColor: colors.brandYellow, opacity: pressed ? 0.84 : 1 },
                  ]}
                >
                  <Text style={[styles.checkoutText, { color: colors.brandDeepGreen }]}>
                    Finalizar pedido
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="shopping-bag" size={38} color={colors.brandGreen} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Seu carrinho está vazio
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.back()}
                style={[styles.backToStoreButton, { backgroundColor: colors.brandYellow }]}
              >
                <Text style={[styles.checkoutText, { color: colors.brandDeepGreen }]}>
                  Voltar à loja
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  colors,
  emphasized = false,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  emphasized?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, emphasized && styles.totalRow]}>
      <Text
        style={[
          styles.summaryLabel,
          { color: colors.foreground },
          emphasized && styles.totalText,
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.summaryValue,
          { color: colors.foreground },
          emphasized && styles.totalText,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  page: { flexGrow: 1, paddingBottom: 8 },
  header: {
    minHeight: 58,
    paddingHorizontal: 17,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAction: {
    width: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  panel: {
    flex: 1,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
    borderBottomLeftRadius: 19,
    borderBottomRightRadius: 19,
  },
  itemList: { gap: 14 },
  checkoutArea: { marginTop: 'auto' },
  cartItem: {
    minHeight: 126,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  productImage: {
    width: 74,
    height: 74,
    borderRadius: 9,
    backgroundColor: '#eaf2ed',
  },
  productInfo: { flex: 1, gap: 4 },
  productName: { fontSize: 12, fontWeight: '600' },
  productPrice: { fontSize: 13, fontWeight: '700' },
  quantityControl: {
    alignSelf: 'flex-start',
    minWidth: 77,
    height: 25,
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    width: 25,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: { minWidth: 15, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  removeButton: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponSection: {
    paddingTop: 12,
    paddingBottom: 11,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e4ece6',
  },
  couponLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 7,
  },
  couponTitle: { fontSize: 11, fontWeight: '600' },
  couponApplied: { marginLeft: 'auto', fontSize: 10, fontWeight: '600' },
  couponControls: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  couponInput: {
    flex: 1,
    height: 35,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 11,
  },
  applyButton: {
    width: 72,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { fontSize: 11, fontWeight: '600' },
  summary: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    gap: 5,
  },
  summaryRow: {
    minHeight: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 11, fontWeight: '400' },
  summaryValue: { fontSize: 11, fontWeight: '600' },
  totalRow: { minHeight: 34, marginTop: 2 },
  totalText: { fontSize: 16, fontWeight: '800' },
  checkoutButton: {
    minHeight: 47,
    marginTop: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: { fontSize: 12, fontWeight: '700' },
  emptyState: {
    flex: 1,
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  backToStoreButton: {
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
