import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  Alert,
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
  { label: 'Forma de pagamento', icon: 'credit-card' as const },
  { label: 'Favoritos', icon: 'heart' as const },
  { label: 'Endereço de entrega', icon: 'map-pin' as const },
  { label: 'Código de entrega', icon: 'key' as const },
  { label: 'Cupons e descontos', icon: 'percent' as const },
  { label: 'Ajuda', icon: 'headphones' as const },
  { label: 'Configuração', icon: 'settings' as const },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: '#ffffff' }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
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
              <Text style={[styles.avatarInitials, { color: colors.brandDeepGreen }]}>
                KR
              </Text>
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.profileName}>Keyson Reis Santos</Text>
              <Text style={styles.profileEmail}>keyson@email.com</Text>
            </View>
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
                    <Feather
                      name={option.icon}
                      size={26}
                      color={colors.brandDeepGreen}
                      style={styles.optionIcon}
                    />
                    <Text style={[styles.optionText, { color: '#151515' }]}>
                      {option.label}
                    </Text>
                    <Feather name="chevron-right" size={25} color={colors.brandDeepGreen} />
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
  scrollContent: { flexGrow: 1, paddingBottom: 80 },
  profileIdentity: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  avatar: {
    width: 66,
    height: 66,
    marginBottom: 10,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5f2e9',
  },
  avatarInitials: {
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: -1,
  },
  identityCopy: {
    alignItems: 'center',
    gap: 3,
  },
  profileName: { color: '#111111', fontSize: 24, fontWeight: '700' },
  profileEmail: { color: '#666666', fontSize: 16 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  options: {},
  option: {
    minHeight: 55,
    justifyContent: 'center',
  },
  optionRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  optionDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 54,
  },
  optionIcon: {
    width: 34,
    textAlign: 'center',
  },
  optionText: { flex: 1, fontSize: 16, fontWeight: '600' },
});
