import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const profileOptions = [
  { label: 'Dados da conta', icon: 'user' as const },
  { label: 'Favoritos', icon: 'heart' as const },
  { label: 'Endereço de entrega', icon: 'map-pin' as const },
  { label: 'Código de entrega', icon: 'tag' as const },
  { label: 'Cupons e descontos', icon: 'percent' as const },
  { label: 'Ajuda', icon: 'headphones' as const },
  { label: 'Configuração', icon: 'settings' as const },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : Platform.OS === 'android' ? 0 : insets.top;

  return (
    <View style={[styles.screen, { backgroundColor: colors.brandCream }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.topArea,
            {
              backgroundColor: colors.brandDeepGreen,
              paddingTop: topInset + (Platform.OS === 'android' ? 24 : 14),
            },
          ]}
        >
          <View pointerEvents="none" style={styles.headerAccentOne} />
          <View pointerEvents="none" style={styles.headerAccentTwo} />
          <Text style={styles.pageTitle}>Perfil</Text>
        </View>

        <View style={styles.content}>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert('Dados da conta', 'Esta opção ainda não está conectada.')
            }
            style={({ pressed }) => [
              styles.profileIdentity,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={styles.avatar}>
              <Feather name="user" size={28} color="#ffffff" />
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.profileName}>Keyson Reis Santos</Text>
              <Text style={styles.profileEmail}>keyson@email.com</Text>
            </View>
            <Feather name="chevron-right" size={23} color="#626974" />
          </Pressable>

          <View style={styles.options}>
            {profileOptions.map((option, index) => (
              <Pressable
                accessibilityRole="button"
                key={option.label}
                onPress={() =>
                  Alert.alert(option.label, 'Esta opção ainda não está conectada.')
                }
                style={({ pressed }) => [
                  styles.option,
                  { opacity: pressed ? 0.65 : 1 },
                ]}
              >
                <View>
                  <View style={styles.optionRow}>
                    <View style={[styles.optionIcon, { backgroundColor: colors.brandMint }]}>
                      <Feather name={option.icon} size={22} color={colors.brandDeepGreen} />
                    </View>
                    <Text style={[styles.optionText, { color: '#1A1A1A' }]}>
                      {option.label}
                    </Text>
                    <Feather name="chevron-right" size={20} color="#626974" />
                  </View>
                  {index < profileOptions.length - 1 ? (
                    <View style={[styles.optionDivider, { backgroundColor: colors.border }]} />
                  ) : null}
                </View>
              </Pressable>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  topArea: {
    minHeight: 132,
    paddingHorizontal: 22,
    paddingBottom: 44,
    overflow: 'hidden',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  headerAccentOne: {
    position: 'absolute',
    width: 290,
    height: 100,
    right: -130,
    top: 28,
    borderRadius: 60,
    backgroundColor: '#0b5735',
    transform: [{ rotate: '-38deg' }],
    opacity: 0.65,
  },
  headerAccentTwo: {
    position: 'absolute',
    width: 250,
    height: 70,
    right: 35,
    top: 82,
    borderRadius: 50,
    backgroundColor: '#0b5735',
    transform: [{ rotate: '-38deg' }],
    opacity: 0.45,
  },
  pageTitle: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
  },
  profileIdentity: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#063a23',
  },
  identityCopy: { flex: 1, gap: 4 },
  profileName: { color: '#151923', fontSize: 15, fontWeight: '700' },
  profileEmail: { color: '#747b86', fontSize: 12 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: -31,
  },
  options: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 3,
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
  },
  optionRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  optionDivider: { height: StyleSheet.hairlineWidth, marginLeft: 49 },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: { flex: 1, fontSize: 14, fontWeight: '600' },
});
