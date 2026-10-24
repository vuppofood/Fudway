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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDeliveryAddress } from '@/constants/delivery-address';
import { useCart } from '@/contexts/CartContext';
import { useColors } from '@/hooks/useColors';

const paymentMethods = ['Pix', 'Cartão de crédito', 'Cartão de débito', 'Dinheiro'];

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { items, subtotal, discount } = useCart();
  const [address, setAddress] = useState(getDeliveryAddress());
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setAddress(getDeliveryAddress());
    }, []),
  );

  const closeConfirmation = () => setConfirmationOpen(false);

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
        animationType="fade"
        onRequestClose={() => setPaymentModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Forma de pagamento
            </Text>
            {paymentMethods.map((method) => (
              <Pressable
                key={method}
                accessibilityRole="radio"
                accessibilityState={{ selected: paymentMethod === method }}
                onPress={() => {
                  setPaymentMethod(method);
                  setPaymentModalOpen(false);
                }}
                style={[styles.methodOption, { borderBottomColor: colors.border }]}
              >
                <Text style={[styles.methodText, { color: colors.foreground }]}>
                  {method}
                </Text>
                <View
                  style={[
                    styles.methodRadio,
                    { borderColor: paymentMethod === method ? colors.brandGreen : colors.border },
                  ]}
                >
                  {paymentMethod === method ? (
                    <View style={[styles.methodRadioCenter, { backgroundColor: colors.brandGreen }]} />
                  ) : null}
                </View>
              </Pressable>
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => setPaymentModalOpen(false)}
              style={styles.closeModal}
            >
              <Text style={[styles.closeModalText, { color: colors.foreground }]}>Fechar</Text>
            </Pressable>
          </View>
        </View>
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
  modalCard: { width: '100%', maxWidth: 380, borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  methodOption: {
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodText: { fontSize: 14 },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodRadioCenter: { width: 10, height: 10, borderRadius: 5 },
  closeModal: { alignSelf: 'flex-end', paddingTop: 14, paddingHorizontal: 4 },
  closeModalText: { fontSize: 14, fontWeight: '700' },
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
