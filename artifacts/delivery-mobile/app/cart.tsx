import React, { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
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
import { useCart } from '@/contexts/CartContext';
import { useColors } from '@/hooks/useColors';

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    items,
    subtotal,
    discount,
    couponCode,
    applyCoupon: applyCouponCode,
    setQuantity,
    removeItem,
  } = useCart();
  const [couponText, setCouponText] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const couponApplied = Boolean(couponCode);
  const total = subtotal - discount;
  const storeName = items[0]?.storeName || 'Buncker';
  const storeCuisine = items[0]?.cuisine || 'Hambúrgueres';

  const applyCoupon = () => {
    if (applyCouponCode(couponText)) {
      setCouponMessage('Cupom LANCHE10 aplicado.');
      return;
    }
    setCouponMessage('Cupom não encontrado. Confira o código e tente novamente.');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 30 : 6),
            backgroundColor: colors.card,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar à loja"
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Feather name="chevron-left" size={27} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Sacola</Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
            {storeName} · {storeCuisine}
          </Text>
        </View>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 12) + 96 },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Seus itens</Text>

        {items.length ? (
          <View style={styles.itemsList}>
            {items.map((item) => (
              <View
                key={item.cartKey}
                style={[
                  styles.cartItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Image source={item.image} style={styles.productImage} resizeMode="cover" />
                <View style={styles.productInfo}>
                  <Text
                    numberOfLines={1}
                    style={[styles.productName, { color: colors.foreground }]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={[styles.productDescription, { color: colors.mutedForeground }]}
                  >
                    {item.notes?.trim() || item.customization || item.description}
                  </Text>
                  <Text style={[styles.productPrice, { color: colors.foreground }]}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </View>
                <View style={styles.itemActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${item.name}`}
                    onPress={() => removeItem(item.cartKey)}
                    style={styles.removeButton}
                  >
                    <Feather name="trash-2" size={16} color={colors.mutedForeground} />
                  </Pressable>
                  <View style={[styles.quantityControl, { borderColor: colors.border }]}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Diminuir ${item.name}`}
                      onPress={() => setQuantity(item.cartKey, item.quantity - 1)}
                      style={styles.quantityButton}
                    >
                      <Feather name="minus" size={14} color={colors.foreground} />
                    </Pressable>
                    <Text style={[styles.quantity, { color: colors.foreground }]}>
                      {item.quantity}
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Aumentar ${item.name}`}
                      onPress={() => setQuantity(item.cartKey, item.quantity + 1)}
                      style={[styles.plusButton, { backgroundColor: colors.brandTomato }]}
                    >
                      <Feather name="plus" size={14} color="#ffffff" />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyCard, { borderColor: colors.border }]}>
            <Feather name="shopping-bag" size={34} color={colors.brandGreen} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Sua sacola está vazia
            </Text>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/store')}
          style={styles.addMore}
        >
          <Feather name="plus" size={22} color={colors.brandTomato} />
          <Text style={[styles.addMoreText, { color: colors.foreground }]}>
            Adicionar mais itens
          </Text>
        </Pressable>

        <View style={[styles.couponSection, { borderTopColor: colors.border }]}>
          <View style={styles.sectionHeading}>
            <Feather name="tag" size={20} color={colors.foreground} />
            <Text style={[styles.couponTitle, { color: colors.foreground }]}>
              Cupom de desconto
            </Text>
          </View>
          <View style={styles.couponControls}>
            <TextInput
              accessibilityLabel="Código do cupom"
              autoCapitalize="characters"
              onChangeText={(value) => {
                setCouponText(value);
                setCouponMessage('');
              }}
              placeholder="Digite seu cupom"
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
                { backgroundColor: colors.brandTomato, opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <Text style={styles.applyText}>Adicionar</Text>
            </Pressable>
          </View>
          {couponMessage ? (
            <Text
              style={[
                styles.couponMessage,
                { color: colors.foreground },
              ]}
            >
              {couponMessage}
            </Text>
          ) : null}
        </View>

        <View style={[styles.summary, { borderTopColor: colors.border }]}>
          <View style={styles.sectionHeading}>
            <Feather name="file-text" size={19} color={colors.foreground} />
            <Text style={[styles.couponTitle, { color: colors.foreground }]}>
              Resumo de valores
            </Text>
          </View>
          <SummaryRow label="Subtotal" value={formatPrice(subtotal)} colors={colors} />
          <SummaryRow label="Taxa de entrega" value="Grátis" colors={colors} free />
          <SummaryRow
            label="Descontos"
            value={discount ? `− ${formatPrice(discount)}` : formatPrice(0)}
            colors={colors}
          />
          <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.foreground }]}>
              {formatPrice(total)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {items.length > 0 ? (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.brandInk,
              paddingBottom: Math.max(insets.bottom, Platform.OS === 'web' ? 11 : 8),
            },
          ]}
        >
          <View style={styles.bottomTotal}>
            <Text style={styles.bottomLabel}>Total</Text>
            <Text style={styles.bottomAmount}>{formatPrice(total)}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/checkout')}
            style={({ pressed }) => [
              styles.checkoutButton,
              { backgroundColor: colors.brandTomato, opacity: pressed ? 0.84 : 1 },
            ]}
          >
            <Text style={styles.checkoutText}>Continuar para entrega</Text>
            <Feather name="arrow-right" size={17} color="#ffffff" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function SummaryRow({
  label,
  value,
  colors,
  free = false,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  free?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text
        style={[
          styles.summaryValue,
          { color: colors.foreground },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    minHeight: 90,
    paddingHorizontal: 15,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: { width: 35, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  headerSubtitle: { marginTop: 2, fontSize: 12 },
  content: { paddingHorizontal: 16, paddingTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  itemsList: { gap: 10 },
  cartItem: {
    minHeight: 118,
    padding: 9,
    borderWidth: 1,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productImage: { width: 82, height: 82, borderRadius: 10 },
  productInfo: { flex: 1, alignSelf: 'stretch', justifyContent: 'center', gap: 4 },
  productName: { fontSize: 14, fontWeight: '700' },
  productDescription: { fontSize: 11, lineHeight: 15 },
  productPrice: { fontSize: 14, fontWeight: '800' },
  itemActions: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 2,
  },
  removeButton: { padding: 4 },
  quantityControl: {
    height: 30,
    minWidth: 76,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 22,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: { fontSize: 12, fontWeight: '700' },
  plusButton: {
    width: 28,
    height: 28,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMore: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addMoreText: { fontSize: 13, fontWeight: '700' },
  couponSection: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 15, paddingBottom: 15 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  couponTitle: { fontSize: 15, fontWeight: '700' },
  couponControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  couponInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 13,
    fontSize: 12,
  },
  applyButton: {
    minWidth: 92,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  applyText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  couponMessage: { marginTop: 7, fontSize: 11 },
  summary: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 15, paddingBottom: 12 },
  summaryRow: {
    minHeight: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: { fontSize: 13 },
  summaryValue: { fontSize: 13, fontWeight: '500' },
  totalRow: {
    minHeight: 43,
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: { fontSize: 17, fontWeight: '800' },
  totalValue: { fontSize: 19, fontWeight: '800' },
  bottomBar: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 8,
    minHeight: 73,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bottomTotal: { flex: 1 },
  bottomLabel: { color: '#ffffff', fontSize: 11 },
  bottomAmount: { color: '#ffffff', fontSize: 19, fontWeight: '800' },
  checkoutButton: {
    minHeight: 44,
    maxWidth: '60%',
    borderRadius: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  checkoutText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  emptyCard: {
    minHeight: 180,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
});
