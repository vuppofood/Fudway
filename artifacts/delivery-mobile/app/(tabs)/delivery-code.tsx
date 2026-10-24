import React, { useState } from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const instructions = [
  { icon: 'account-outline' as const, text: 'Pode ser solicitado por quem vai fazer a entrega', personWithBag: true },
  { icon: 'message-outline' as const, text: 'Informe o código após receber seu pedido', messageIcon: true },
  { icon: 'block-helper' as const, text: 'Não compartilhe o código pelo chat' },
  { icon: 'phone-outline' as const, text: 'O código não pode ser igual aos 4 últimos dígitos do seu telefone' },
];

function createDeliveryCode(previousCode: string) {
  let code = String(Math.floor(100000 + Math.random() * 900000));
  while (code === previousCode) {
    code = String(Math.floor(100000 + Math.random() * 900000));
  }
  return code;
}

export default function DeliveryCodeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [code, setCode] = useState('482631');

  const changeCode = () => setCode((current) => createDeliveryCode(current));

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={27} color="#000000" />
          </Pressable>
          <Text style={[styles.title, { color: '#000000' }]}>Código de entrega</Text>
        </View>

        <View style={styles.illustration}>
          <Image
            source={require('../../assets/images/delivery-code-rider.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
            accessibilityLabel="Entregador Fudway com bolsa de entrega e celular"
          />
        </View>

        <View style={[styles.codeCard, { borderColor: '#a5f1dc' }]}>
          <Text style={[styles.codeCardTitle, { color: colors.brandDeepGreen }]}>
            Seu código de entrega
          </Text>
          <Text
            accessibilityLabel={`Código ${code.split('').join(' ')}`}
            style={[styles.codeValue, { color: colors.brandDeepGreen }]}
          >
            {code.split('').join(' ')}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={changeCode}
            style={({ pressed }) => [
              styles.changeButton,
              { backgroundColor: colors.brandMint, opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <Feather name="edit-2" size={17} color={colors.brandGreen} />
            <Text style={[styles.changeButtonText, { color: colors.brandGreen }]}>Alterar código</Text>
          </Pressable>
        </View>

        <View style={styles.instructions}>
          {instructions.map((instruction) => (
            <View key={instruction.text} style={styles.instructionRow}>
              {instruction.personWithBag ? (
                <Image
                  source={require('../../assets/images/delivery-person-package.png')}
                  style={styles.personPackageIcon}
                  resizeMode="contain"
                  accessibilityLabel="Pessoa segurando uma encomenda"
                />
              ) : instruction.messageIcon ? (
                <Svg width={32} height={32} viewBox="0 0 34 34" style={styles.instructionIcon}>
                  <Path
                    d="M5 5.5h24a2.5 2.5 0 0 1 2.5 2.5v15a2.5 2.5 0 0 1-2.5 2.5H16l-8 6v-6H5A2.5 2.5 0 0 1 2.5 23V8A2.5 2.5 0 0 1 5 5.5Z"
                    fill="none"
                    stroke={colors.mutedForeground}
                    strokeWidth={2.4}
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M8 12h3m3 0h3m-9 5h3m3 0h8"
                    fill="none"
                    stroke={colors.mutedForeground}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                  />
                </Svg>
              ) : (
                <MaterialCommunityIcons
                  name={instruction.icon}
                  size={32}
                  color={colors.mutedForeground}
                  style={styles.instructionIcon}
                />
              )}
              <Text style={[styles.instructionText, { color: colors.mutedForeground }]}>
                {instruction.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 20 },
  header: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 24 },
  backButton: { width: 30, alignItems: 'flex-start' },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  illustration: {
    height: 215,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  codeCard: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    marginTop: -5,
    backgroundColor: '#ffffff',
    shadowColor: '#063a23',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
    zIndex: 4,
  },
  codeCardTitle: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  codeValue: { marginTop: 8, fontSize: 40, fontWeight: '900', letterSpacing: 3 },
  changeButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  changeButtonText: { fontSize: 15, fontWeight: '700' },
  instructions: { gap: 8, paddingTop: 14, paddingHorizontal: 3 },
  instructionRow: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 16 },
  instructionIcon: { width: 36, height: 36, textAlign: 'center' },
  personPackageIcon: { width: 42, height: 32, marginLeft: -3 },
  instructionText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
