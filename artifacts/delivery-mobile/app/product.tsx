import React, { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  Platform,
  Pressable,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/contexts/CartContext';
import { useColors } from '@/hooks/useColors';

const extras = [
  { id: 'bacon', label: 'Extra bacon', price: 4 },
  { id: 'cheese', label: 'Queijo extra', price: 3.5 },
  { id: 'egg', label: 'Ovo', price: 2.5 },
];

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProductScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addItem } = useCart();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    discountPercent?: string;
    image?: string;
    category?: string;
    storeName?: string;
    cuisine?: string;
  }>();

  const productId = params.id || 'buncker-classico';
  const name = params.name || 'Buncker Clássico';
  const description =
    params.description ||
    'Pão brioche, hambúrguer 180g, queijo cheddar, alface, tomate e molho especial.';
  const basePrice = Number(params.price) || 24.9;
  const originalBasePrice = Number(params.originalPrice) || basePrice;
  const discountPercent = Number(params.discountPercent) || 0;
  const imageSource = Number(params.image) || require('../assets/images/reference/buncker-classico.jpg');
  const category = params.category || 'Hambúrgueres';
  const storeName = params.storeName || 'Buncker';
  const cuisine = params.cuisine || 'Hambúrgueres';
  const hasSizes = category === 'Hambúrgueres';
  const topInset = Platform.OS === 'web' ? 38 : insets.top;
  const [size, setSize] = useState('Médio');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const sizeOptions = useMemo(
    () => [
      { label: 'Pequeno', price: Math.max(0, basePrice - 4) },
      { label: 'Médio', price: basePrice },
      { label: 'Grande', price: basePrice + 4 },
    ],
    [basePrice],
  );
  const selectedBasePrice = hasSizes
    ? sizeOptions.find((option) => option.label === size)?.price ?? basePrice
    : basePrice;
  const extrasTotal = extras
    .filter((extra) => selectedExtras.includes(extra.id))
    .reduce((sum, extra) => sum + extra.price, 0);
  const unitPrice = selectedBasePrice + extrasTotal;
  const originalUnitPrice = originalBasePrice + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const toggleExtra = (id: string) => {
    setSelectedExtras((current) =>
      current.includes(id)
        ? current.filter((selected) => selected !== id)
        : [...current, id],
    );
  };

  const addToBag = () => {
    const customizationParts = [
      hasSizes ? size : '',
      ...extras
        .filter((extra) => selectedExtras.includes(extra.id))
        .map((extra) => extra.label),
    ].filter(Boolean);

    addItem(
      {
        id: productId,
        name,
        description,
        price: unitPrice,
        image: imageSource,
        category,
        storeName,
        cuisine,
        customization: customizationParts.join(' · ') || 'Sem alterações',
        notes: note.trim(),
      },
      quantity,
    );
    router.back();
  };

  const shareProduct = async () => {
    await Share.share({
      message: `${name} — ${formatPrice(unitPrice)} na loja ${storeName}.`,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View style={styles.hero}>
          <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />
          <View style={[styles.heroActions, { top: topInset + 10 }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={() => router.back()}
              style={styles.heroButton}
            >
              <Feather name="arrow-left" size={22} color={colors.foreground} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Compartilhar produto"
              onPress={shareProduct}
              style={styles.heroButton}
            >
              <Feather name="share" size={19} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={[styles.productName, { color: colors.foreground }]}>{name}</Text>
          <View style={styles.priceColumn}>
            <Text style={[styles.price, { color: '#000000' }]}>
              {formatPrice(unitPrice)}
            </Text>
            {discountPercent > 0 ? (
              <View style={styles.discountDetails}>
                <Text style={[styles.originalPrice, { color: '#000000' }]}>
                  {formatPrice(originalUnitPrice)}
                </Text>
                <View style={[styles.productDiscountBadge, { backgroundColor: colors.brandGreen }]}>
                  <Text style={[styles.productDiscountText, { color: '#ffffff' }]}>
                    {discountPercent}% OFF
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {description}
          </Text>
          <View style={styles.storeRow}>
            <View style={[styles.storeIcon, { backgroundColor: colors.brandTomato }]}>
              <Feather name="shopping-bag" size={15} color="#ffffff" />
            </View>
            <Text style={[styles.storeName, { color: colors.foreground }]}>{storeName}</Text>
            <View style={[styles.dot, { backgroundColor: colors.mutedForeground }]} />
            <Text style={[styles.deliveryTime, { color: colors.mutedForeground }]}>
              25–35 min
            </Text>
          </View>
        </View>

        <View style={[styles.customization, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Personalize seu pedido
          </Text>

          {hasSizes ? (
            <>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                Tamanho
              </Text>
              <View style={styles.sizeOptions}>
                {sizeOptions.map((option) => {
                  const selected = size === option.label;
                  return (
                    <Pressable
                      key={option.label}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => setSize(option.label)}
                      style={[
                        styles.sizeOption,
                        {
                          borderColor: selected ? colors.brandTomato : colors.border,
                          backgroundColor: colors.card,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          { color: colors.foreground },
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={[
                          styles.sizePrice,
                          { color: colors.foreground },
                        ]}
                      >
                        {formatPrice(option.price)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          <Text style={[styles.fieldLabel, styles.addonsLabel, { color: colors.mutedForeground }]}>
            Adicionais
          </Text>
          {extras.map((extra) => {
            const selected = selectedExtras.includes(extra.id);
            return (
              <Pressable
                key={extra.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                onPress={() => toggleExtra(extra.id)}
                style={[styles.extraRow, { borderBottomColor: colors.border }]}
              >
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: selected ? colors.brandTomato : colors.border },
                    selected && { backgroundColor: colors.brandTomato },
                  ]}
                >
                  {selected ? <Feather name="check" size={13} color="#ffffff" /> : null}
                </View>
                <Text style={[styles.extraName, { color: colors.foreground }]}>
                  {extra.label}
                </Text>
                <Text style={[styles.extraPrice, { color: colors.foreground }]}>
                  +{formatPrice(extra.price)}
                </Text>
              </Pressable>
            );
          })}

          <TextInput
            accessibilityLabel="Observações do pedido"
            value={note}
            onChangeText={(value) => setNote(value.slice(0, 120))}
            placeholder="Observações (ex.: sem alface, ponto da carne, etc.)"
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={120}
            style={[
              styles.noteInput,
              { color: colors.foreground, borderColor: colors.border },
            ]}
          />
          <Text style={[styles.noteCount, { color: colors.mutedForeground }]}>
            {note.length}/120
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, Platform.OS === 'web' ? 12 : 8),
          },
        ]}
      >
        <View style={[styles.quantityControl, { borderColor: colors.border }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Diminuir quantidade"
            onPress={() => setQuantity((current) => Math.max(1, current - 1))}
            style={styles.quantityButton}
          >
            <Feather name="minus" size={18} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.quantity, { color: colors.foreground }]}>{quantity}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Aumentar quantidade"
            onPress={() => setQuantity((current) => current + 1)}
            style={styles.quantityButton}
          >
            <Feather name="plus" size={20} color={colors.foreground} />
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Adicionar à sacola por ${formatPrice(totalPrice)}`}
          onPress={addToBag}
          style={({ pressed }) => [
            styles.addToBag,
            { backgroundColor: colors.brandTomato, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.addToBagText}>Adicionar</Text>
          <Text style={styles.addToBagPrice}>{formatPrice(totalPrice)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: { height: 305, overflow: 'hidden', backgroundColor: '#1b1715' },
  heroImage: { width: '100%', height: '100%' },
  heroActions: {
    position: 'absolute',
    left: 17,
    right: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  details: { paddingHorizontal: 20, paddingTop: 13, paddingBottom: 14 },
  productName: { fontSize: 22, lineHeight: 28, fontWeight: '800' },
  priceColumn: { alignItems: 'flex-start' },
  price: { marginTop: 3, fontSize: 22, fontWeight: '800' },
  discountDetails: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  originalPrice: { fontSize: 14, textDecorationLine: 'line-through' },
  productDiscountBadge: { paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6 },
  productDiscountText: { fontSize: 12, fontWeight: '700' },
  description: { marginTop: 5, fontSize: 13, lineHeight: 19 },
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 11 },
  storeIcon: {
    width: 23,
    height: 23,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeName: { fontSize: 13, fontWeight: '700' },
  dot: { width: 4, height: 4, borderRadius: 2 },
  deliveryTime: { fontSize: 12 },
  customization: { borderTopWidth: StyleSheet.hairlineWidth, padding: 20, paddingBottom: 26 },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 11 },
  fieldLabel: { fontSize: 12, marginBottom: 7 },
  sizeOptions: { flexDirection: 'row', gap: 8 },
  sizeOption: {
    flex: 1,
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: { fontSize: 12 },
  sizePrice: { marginTop: 2, fontSize: 12, fontWeight: '700' },
  addonsLabel: { marginTop: 12 },
  extraRow: {
    minHeight: 39,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraName: { flex: 1, fontSize: 13 },
  extraPrice: { fontSize: 12, fontWeight: '500' },
  noteInput: {
    minHeight: 54,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 9,
    fontSize: 12,
    textAlignVertical: 'top',
  },
  noteCount: { alignSelf: 'flex-end', marginTop: 3, fontSize: 10 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityControl: {
    height: 48,
    minWidth: 120,
    borderWidth: 1,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    width: 38,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: { fontSize: 15, fontWeight: '700' },
  addToBag: {
    flex: 1,
    height: 48,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addToBagText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  addToBagPrice: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
});
