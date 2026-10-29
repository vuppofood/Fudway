import React, { useCallback, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDeliveryAddress } from '@/constants/delivery-address';
import { useCart } from '@/contexts/CartContext';
import { useColors } from '@/hooks/useColors';

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const cardBrands = ['Visa', 'Mastercard', 'American Express', 'Elo', 'Hipercard'];

const getCardBrand = (number: string) => {
  if (/^4/.test(number)) return 'Visa';
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^(606282|3841)/.test(number)) return 'Hipercard';
  if (/^(4011|4312|4389|4514|4576|5041|5067|5090|6277|6362|6363)/.test(number)) return 'Elo';
  return null;
};

function CardBrandLogo({ brand }: { brand: string }) {
  if (brand === 'Mastercard') {
    return (
      <View style={styles.mastercardLogo}>
        <View style={[styles.mastercardCircle, styles.mastercardRed]} />
        <View style={[styles.mastercardCircle, styles.mastercardOrange]} />
      </View>
    );
  }

  if (brand === 'American Express') {
    return (
      <View style={styles.amexLogo}>
        <Text style={styles.amexLogoText}>AMERICAN{'\n'}EXPRESS</Text>
      </View>
    );
  }

  if (brand === 'Elo') {
    return (
      <View style={styles.eloLogo}>
        <View style={styles.eloMark}>
          <View style={styles.eloMarkCenter} />
        </View>
        <Text style={styles.eloLogoText}>elo</Text>
      </View>
    );
  }

  if (brand === 'Hipercard') {
    return (
      <View style={styles.hipercardLogo}>
        <Text style={styles.hipercardLogoText}>Hipercard</Text>
      </View>
    );
  }

  return <Text style={styles.visaLogoText}>VISA</Text>;
}

const isValidCardExpiry = (value: string) => {
  const [monthText, yearText] = value.split('/');
  const month = Number(monthText);
  const year = Number(`20${yearText}`);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return (
    month >= 1 &&
    month <= 12 &&
    year >= currentYear &&
    (year > currentYear || month >= currentMonth)
  );
};

type SavedCard = {
  id: string;
  brand: string;
  lastFour: string;
  holderName: string;
};

export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, subtotal, discount } = useCart();
  const [address, setAddress] = useState(getDeliveryAddress());
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState('Visa');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardDocument, setCardDocument] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setAddress(getDeliveryAddress());
    }, []),
  );

  const closeConfirmation = () => setConfirmationOpen(false);

  const addCard = () => {
    const digits = cardNumber.replace(/\D/g, '');
    const expiryDigits = cardExpiry.replace(/\D/g, '');
    const cvvDigits = cardCvv.replace(/\D/g, '');
    const documentDigits = cardDocument.replace(/\D/g, '');

    if (
      digits.length < 13 ||
      digits.length > 19 ||
      expiryDigits.length !== 4 ||
      !isValidCardExpiry(cardExpiry) ||
      cvvDigits.length < 3 ||
      cvvDigits.length > 4 ||
      !cardHolder.trim() ||
      (documentDigits.length !== 11 && documentDigits.length !== 14)
    ) {
      return;
    }

    const card: SavedCard = {
      id: `${Date.now()}`,
      brand: cardBrand,
      lastFour: digits.slice(-4),
      holderName: cardHolder.trim(),
    };
    setSavedCards((cards) => [...cards, card]);
    setSelectedCardId(card.id);
    setPaymentMethod(`Cartão •••• ${card.lastFour}`);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardHolder('');
    setCardDocument('');
    setAddingCard(false);
  };

  const cardFormIsValid = (() => {
    const digits = cardNumber.replace(/\D/g, '');
    const expiryDigits = cardExpiry.replace(/\D/g, '');
    const cvvDigits = cardCvv.replace(/\D/g, '');
    const documentDigits = cardDocument.replace(/\D/g, '');
    return (
      digits.length >= 13 &&
      digits.length <= 19 &&
      expiryDigits.length === 4 &&
      isValidCardExpiry(cardExpiry) &&
      cvvDigits.length >= 3 &&
      cvvDigits.length <= 4 &&
      cardHolder.trim().length > 0 &&
      (documentDigits.length === 11 || documentDigits.length === 14)
    );
  })();

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
          accessibilityLabel="Voltar à sacola"
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Feather name="chevron-left" size={27} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Finalizar pedido
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 18) + 18 },
        ]}
      >
        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Endereço de entrega
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Alterar endereço de entrega"
            onPress={() => router.push('/location')}
            style={styles.addressRow}
          >
            <Feather name="map-pin" size={31} color={colors.brandGreen} />
            <View style={styles.addressCopy}>
              <Text style={[styles.addressText, { color: colors.foreground }]}>
                {address}
              </Text>
              <Text style={[styles.addressSubtext, { color: colors.mutedForeground }]}>
                São Paulo, SP - 01000-000
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color={colors.foreground} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/location')}
            style={styles.changeAddress}
          >
            <Text style={[styles.changeAddressText, { color: colors.foreground }]}>
              Alterar endereço
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Forma de pagamento
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Forma selecionada: ${paymentMethod}`}
            onPress={() => setPaymentModalOpen(true)}
            style={styles.paymentRow}
          >
            <View style={[styles.pixIcon, { borderColor: colors.border }]}>
              {paymentMethod === 'Pix' ? (
                <View style={styles.pixMark}>
                  <View style={[styles.pixDiamond, { backgroundColor: '#20b7aa' }]} />
                  <View style={[styles.pixDiamond, styles.pixDiamondSecond, { backgroundColor: '#20b7aa' }]} />
                </View>
              ) : (
                <Feather name="credit-card" size={25} color={colors.brandGreen} />
              )}
            </View>
            <Text style={[styles.paymentName, { color: colors.foreground }]}>
              {paymentMethod}
            </Text>
            <View style={[styles.selectedRadio, { borderColor: colors.brandGreen }]}>
              <View style={[styles.selectedRadioCenter, { backgroundColor: colors.brandGreen }]} />
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPaymentModalOpen(true)}
            style={[styles.morePayments, { borderTopColor: colors.border }]}
          >
            <Text style={[styles.morePaymentsText, { color: colors.mutedForeground }]}>
              Ver mais formas de pagamento
            </Text>
            <Feather name="chevron-right" size={22} color={colors.foreground} />
          </Pressable>
        </View>

        <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Resumo do pedido
          </Text>
          {items.map((item) => (
            <View key={item.cartKey} style={styles.orderRow}>
              <Text
                numberOfLines={1}
                style={[styles.orderName, { color: colors.mutedForeground }]}
              >
                {item.quantity > 1 ? `${item.quantity}× ` : ''}
                {item.name}
                {item.customization && item.customization !== 'Sem alterações'
                  ? ` (${item.customization})`
                  : ''}
              </Text>
              <Text style={[styles.orderPrice, { color: colors.foreground }]}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}
          <View style={[styles.totalDivider, { borderTopColor: colors.border }]} />
          <View style={styles.orderRow}>
            <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.foreground }]}>
              {formatPrice(subtotal - discount)}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setConfirmationOpen(true)}
            style={({ pressed }) => [
              styles.payButton,
              { backgroundColor: colors.brandGreen, opacity: pressed ? 0.86 : 1 },
            ]}
          >
            <Text style={styles.payButtonText}>Pagar agora</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={paymentModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (addingCard) {
            setAddingCard(false);
          } else {
            setPaymentModalOpen(false);
          }
        }}
      >
        {addingCard ? (
          <View style={[styles.addCardScreen, { backgroundColor: colors.card }]}>
            <View style={[styles.addCardHeader, { paddingTop: Math.max(insets.top, 16) }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Voltar aos meios de pagamento"
                onPress={() => setAddingCard(false)}
                hitSlop={10}
              >
                <Feather name="arrow-left" size={26} color={colors.foreground} />
              </Pressable>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.addCardContent,
                { paddingBottom: Math.max(insets.bottom, 16) + 20 },
              ]}
            >
              <Text style={[styles.addCardTitle, { color: colors.foreground }]}>
                Adicionar cartão
              </Text>
              <Text style={[styles.addCardDescription, { color: colors.mutedForeground }]}>
                Cadastre seu cartão de crédito ou débito para fazer pagamentos no app.
              </Text>

              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Bandeira do cartão
              </Text>
              <View style={styles.brandOptions} accessibilityLabel="Bandeiras aceitas">
                {cardBrands.map((brand) => (
                  <View
                    key={brand}
                    style={[styles.brandOption, { borderColor: colors.border }]}
                  >
                    <CardBrandLogo brand={brand} />
                  </View>
                ))}
              </View>

              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Número do cartão
              </Text>
              <View style={[styles.cardInput, { borderColor: colors.border }]}>
                <Feather name="credit-card" size={21} color={colors.mutedForeground} />
                <TextInput
                  accessibilityLabel="Número do cartão"
                  keyboardType="number-pad"
                  maxLength={23}
                  onChangeText={(value) => {
                    const digits = value.replace(/\D/g, '').slice(0, 19);
                    setCardNumber(digits);
                    const detectedBrand = getCardBrand(digits);
                    if (detectedBrand) setCardBrand(detectedBrand);
                  }}
                  placeholder="Digite o número do cartão"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.cardInputText, { color: colors.foreground }]}
                  value={cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                />
              </View>

              <View style={styles.cardInputColumns}>
                <View style={styles.cardInputColumn}>
                  <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                    Validade
                  </Text>
                  <View style={[styles.cardInput, { borderColor: colors.border }]}>
                    <Feather name="calendar" size={21} color={colors.mutedForeground} />
                    <TextInput
                      accessibilityLabel="Validade do cartão"
                      keyboardType="number-pad"
                      maxLength={5}
                      onChangeText={(value) => {
                        const digits = value.replace(/\D/g, '').slice(0, 4);
                        setCardExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                      }}
                      placeholder="MM/AA"
                      placeholderTextColor={colors.mutedForeground}
                      style={[styles.cardInputText, { color: colors.foreground }]}
                      value={cardExpiry}
                    />
                  </View>
                </View>
                <View style={styles.cardInputColumn}>
                  <Text style={[styles.inputLabel, { color: colors.foreground }]}>CVV</Text>
                  <View style={[styles.cardInput, { borderColor: colors.border }]}>
                    <Feather name="lock" size={21} color={colors.mutedForeground} />
                    <TextInput
                      accessibilityLabel="Código de segurança do cartão"
                      keyboardType="number-pad"
                      maxLength={4}
                      onChangeText={(value) => setCardCvv(value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="Digite o CVV"
                      placeholderTextColor={colors.mutedForeground}
                      secureTextEntry
                      style={[styles.cardInputText, { color: colors.foreground }]}
                      value={cardCvv}
                    />
                  </View>
                </View>
              </View>

              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                Nome no cartão
              </Text>
              <View style={[styles.cardInput, { borderColor: colors.border }]}>
                <Feather name="user" size={21} color={colors.mutedForeground} />
                <TextInput
                  accessibilityLabel="Nome impresso no cartão"
                  autoCapitalize="words"
                  onChangeText={setCardHolder}
                  placeholder="Como está no cartão"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.cardInputText, { color: colors.foreground }]}
                  value={cardHolder}
                />
              </View>

              <Text style={[styles.inputLabel, { color: colors.foreground }]}>
                CPF/CNPJ do titular
              </Text>
              <View style={[styles.cardInput, { borderColor: colors.border }]}>
                <Feather name="user-check" size={21} color={colors.mutedForeground} />
                <TextInput
                  accessibilityLabel="CPF ou CNPJ do titular"
                  keyboardType="number-pad"
                  maxLength={18}
                  onChangeText={(value) => setCardDocument(value.replace(/\D/g, '').slice(0, 14))}
                  placeholder="Digite o CPF ou CNPJ do titular"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.cardInputText, { color: colors.foreground }]}
                  value={cardDocument}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !cardFormIsValid }}
                disabled={!cardFormIsValid}
                onPress={addCard}
                style={[
                  styles.addCardButton,
                  {
                    backgroundColor: colors.foreground,
                    opacity: cardFormIsValid ? 1 : 0.45,
                  },
                ]}
              >
                <Text style={styles.addCardButtonText}>Adicionar cartão</Text>
              </Pressable>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.paymentModalBackdrop}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar meios de pagamento"
              onPress={() => setPaymentModalOpen(false)}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.paymentSheet,
                {
                  backgroundColor: colors.card,
                  paddingBottom: Math.max(insets.bottom, 18) + 20,
                },
              ]}
            >
              <View style={styles.paymentSheetHeader}>
                <Text style={[styles.paymentSheetTitle, { color: colors.foreground }]}>
                  Meios de pagamento
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar meios de pagamento"
                  onPress={() => setPaymentModalOpen(false)}
                  hitSlop={10}
                >
                  <Feather name="x" size={27} color={colors.foreground} />
                </Pressable>
              </View>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.paymentSheetContent}
              >
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: paymentMethod === 'Pix' }}
                  onPress={() => {
                    setPaymentMethod('Pix');
                    setSelectedCardId(null);
                    setPaymentModalOpen(false);
                  }}
                  style={[styles.paymentMethodCard, { borderColor: colors.border }]}
                >
                  <View style={styles.pixPaymentIcon}>
                    <View style={[styles.pixPaymentDiamond, styles.pixDiamondTop]} />
                    <View style={[styles.pixPaymentDiamond, styles.pixDiamondBottom]} />
                    <View style={[styles.pixPaymentDiamond, styles.pixDiamondLeft]} />
                    <View style={[styles.pixPaymentDiamond, styles.pixDiamondRight]} />
                  </View>
                  <View style={styles.paymentMethodCopy}>
                    <Text style={[styles.paymentMethodTitle, { color: colors.foreground }]}>
                      Pix
                    </Text>
                    <Text style={[styles.paymentMethodSubtitle, { color: colors.mutedForeground }]}>
                      Aprovação imediata • Sem taxas extras
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={25} color={colors.mutedForeground} />
                </Pressable>

                <Text style={[styles.paymentSectionTitle, { color: colors.foreground }]}>
                  {savedCards.length > 0 ? 'Cartões salvos' : 'Cartões'}
                </Text>
                {savedCards.map((card) => (
                  <Pressable
                    key={card.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: selectedCardId === card.id }}
                    onPress={() => {
                      setSelectedCardId(card.id);
                      setPaymentMethod(`Cartão •••• ${card.lastFour}`);
                      setPaymentModalOpen(false);
                    }}
                    style={[
                      styles.savedCardRow,
                      {
                        borderColor: colors.border,
                        backgroundColor: selectedCardId === card.id ? colors.brandMint : colors.card,
                      },
                    ]}
                  >
                    <View style={styles.savedCardBrand}>
                      <CardBrandLogo brand={card.brand} />
                    </View>
                    <View style={styles.savedCardCopy}>
                      <Text style={[styles.savedCardNumber, { color: colors.foreground }]}>
                        {card.brand} •••• {card.lastFour}
                      </Text>
                      <Text style={[styles.savedCardHolder, { color: colors.mutedForeground }]}>
                        {card.holderName}
                      </Text>
                    </View>
                    {selectedCardId === card.id ? (
                      <Feather name="check-circle" size={23} color={colors.brandGreen} />
                    ) : (
                      <Feather name="chevron-right" size={25} color={colors.mutedForeground} />
                    )}
                  </Pressable>
                ))}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setAddingCard(true)}
                  style={[
                    styles.paymentMethodCard,
                    styles.cardPaymentCard,
                    { borderColor: colors.border, marginTop: savedCards.length ? 16 : 0 },
                  ]}
                >
                  <View style={[styles.cardPaymentIcon, { borderColor: colors.border }]}>
                    <Feather name="credit-card" size={28} color={colors.foreground} />
                  </View>
                  <Text style={[styles.cardPaymentTitle, { color: colors.foreground }]}>
                    Novo cartão de crédito ou débito
                  </Text>
                  <Feather name="chevron-right" size={25} color={colors.mutedForeground} />
                </Pressable>

                <View style={styles.securePaymentNote}>
                  <Feather name="lock" size={18} color={colors.mutedForeground} />
                  <Text style={[styles.securePaymentText, { color: colors.mutedForeground }]}>
                    Pagamento seguro • Dados protegidos
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>

      <Modal
        visible={confirmationOpen}
        transparent
        animationType="fade"
        onRequestClose={closeConfirmation}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.confirmationCard, { backgroundColor: colors.card }]}>
            <View style={[styles.confirmationIcon, { backgroundColor: colors.brandMint }]}>
              <Feather name="check" size={24} color={colors.brandGreen} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Pagamento não conectado
            </Text>
            <Text style={[styles.confirmationCopy, { color: colors.mutedForeground }]}>
              Esta tela de demonstração não processa pagamentos reais.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={closeConfirmation}
              style={[styles.closeConfirmation, { backgroundColor: colors.brandGreen }]}
            >
              <Text style={styles.payButtonText}>Entendi</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    minHeight: 64,
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: { width: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800' },
  content: { paddingHorizontal: 18, paddingTop: 5, gap: 14 },
  card: { borderWidth: 1, borderRadius: 17, padding: 16 },
  cardTitle: { fontSize: 17, fontWeight: '800', marginBottom: 14 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  addressCopy: { flex: 1 },
  addressText: { fontSize: 15, fontWeight: '600' },
  addressSubtext: { marginTop: 3, fontSize: 13 },
  changeAddress: { alignSelf: 'flex-start', marginTop: 18 },
  changeAddressText: { fontSize: 14, fontWeight: '700' },
  paymentRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 13 },
  pixIcon: {
    width: 53,
    height: 53,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pixMark: { width: 26, height: 26, transform: [{ rotate: '45deg' }] },
  pixDiamond: { position: 'absolute', width: 13, height: 13, borderRadius: 3, top: 0, left: 0 },
  pixDiamondSecond: { top: 13, left: 13 },
  paymentName: { flex: 1, fontSize: 14, fontWeight: '600' },
  selectedRadio: {
    width: 22,
    height: 22,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioCenter: { width: 12, height: 12, borderRadius: 6 },
  morePayments: {
    minHeight: 48,
    marginTop: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 13,
  },
  morePaymentsText: { fontSize: 13 },
  orderRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  orderName: { flex: 1, fontSize: 13 },
  orderPrice: { fontSize: 14 },
  totalDivider: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 8, marginBottom: 8 },
  totalLabel: { fontSize: 17, fontWeight: '800' },
  totalValue: { fontSize: 17, fontWeight: '800' },
  payButton: {
    minHeight: 52,
    marginTop: 12,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  modalBackdrop: {
    flex: 1,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  paymentModalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  paymentSheet: {
    width: '100%',
    maxHeight: '90%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 28,
    paddingHorizontal: 22,
  },
  paymentSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  paymentSheetTitle: { fontSize: 23, fontWeight: '800' },
  paymentSheetContent: { paddingBottom: 8 },
  paymentMethodCard: {
    minHeight: 108,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pixPaymentIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#35ad69',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pixPaymentDiamond: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
  },
  pixDiamondTop: { top: 11 },
  pixDiamondBottom: { bottom: 11 },
  pixDiamondLeft: { left: 11 },
  pixDiamondRight: { right: 11 },
  paymentMethodCopy: { flex: 1, gap: 5 },
  paymentMethodTitle: { fontSize: 19, fontWeight: '700' },
  paymentMethodSubtitle: { fontSize: 13 },
  paymentSectionTitle: {
    marginTop: 27,
    marginBottom: 15,
    fontSize: 19,
    fontWeight: '700',
  },
  savedCardRow: {
    minHeight: 88,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savedCardBrand: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedCardBrandText: { fontSize: 12, fontWeight: '900' },
  savedCardCopy: { flex: 1, gap: 4 },
  savedCardNumber: { fontSize: 16, fontWeight: '700' },
  savedCardHolder: { fontSize: 14 },
  cardPaymentCard: { minHeight: 92 },
  cardPaymentIcon: {
    width: 54,
    height: 54,
    borderWidth: 1,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPaymentTitle: { flex: 1, fontSize: 16, fontWeight: '600', lineHeight: 23 },
  securePaymentNote: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  securePaymentText: { fontSize: 13 },
  addCardScreen: { flex: 1 },
  addCardHeader: {
    minHeight: 56,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  addCardContent: { paddingHorizontal: 22, paddingTop: 12 },
  addCardTitle: { fontSize: 28, fontWeight: '800' },
  addCardDescription: { marginTop: 10, fontSize: 16, lineHeight: 24 },
  inputLabel: { marginTop: 25, marginBottom: 10, fontSize: 15, fontWeight: '600' },
  brandOptions: { flexDirection: 'row', gap: 8 },
  brandOption: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  visaLogoText: { color: '#1434a4', fontSize: 20, fontStyle: 'italic', fontWeight: '900' },
  mastercardLogo: {
    width: 46,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mastercardCircle: { width: 25, height: 25, borderRadius: 13 },
  mastercardRed: { backgroundColor: '#eb001b', marginRight: -9 },
  mastercardOrange: { backgroundColor: '#f79e1b', opacity: 0.94 },
  amexLogo: {
    backgroundColor: '#2e77bc',
    paddingHorizontal: 4,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amexLogoText: { color: '#ffffff', fontSize: 7, fontWeight: '900', textAlign: 'center' },
  eloLogo: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  eloMark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderTopColor: '#f5aa18',
    borderRightColor: '#e3312d',
    borderBottomColor: '#3188c8',
    borderLeftColor: '#3188c8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eloMarkCenter: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#111111' },
  eloLogoText: { color: '#111111', fontSize: 16, fontWeight: '900' },
  hipercardLogo: {
    backgroundColor: '#df1e2b',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 5,
  },
  hipercardLogoText: { color: '#ffffff', fontSize: 9, fontStyle: 'italic', fontWeight: '800' },
  cardInput: {
    minHeight: 58,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardInputText: { flex: 1, minWidth: 0, fontSize: 15 },
  cardInputColumns: { flexDirection: 'row', gap: 14 },
  cardInputColumn: { flex: 1, minWidth: 0 },
  addCardButton: {
    minHeight: 56,
    marginTop: 30,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  confirmationCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
  },
  confirmationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confirmationCopy: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  closeConfirmation: {
    alignSelf: 'stretch',
    minHeight: 46,
    marginTop: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
