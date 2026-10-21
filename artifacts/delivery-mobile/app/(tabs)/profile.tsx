import React from 'react';
import { Feather, FontAwesome } from '@expo/vector-icons';
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
    <View style={[styles.screen, { backgroundColor: '#ffffff' }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Platform.OS === 'web'
              ? 104
              : 66 + Math.max(insets.bottom, 8),
          },
        ]}
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
            <View style={[styles.avatar, { backgroundColor: colors.brandDeepGreen }]}>
              <FontAwesome name="user" size={31} color="#ffffff" />
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
                      size={30}
                      color={colors.brandDeepGreen}
                      style={styles.optionIcon}
                    />
                    <Text style={[styles.optionText, { color: '#1A1A1A' }]}>
                      {option.label}
                    </Text>
                    <Feather name="chevron-right" size={22} color={colors.brandDeepGreen} />
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
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  topArea: {
    minHeight: 132,
    paddingHorizontal: 22,
    paddingBottom: 8,
    overflow: 'hidden',
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
  },
  profileIdentity: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    shadowColor: '#10261b',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.08,
    shadowRadius: 13,
    elevation: 4,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityCopy: { flex: 1, gap: 3 },
  profileName: { color: '#151923', fontSize: 16, fontWeight: '700' },
  profileEmail: { color: '#747b86', fontSize: 13 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginTop: -34,
  },
  options: {
    paddingHorizontal: 8,
  },
  option: {
    minHeight: 58,
    justifyContent: 'center',
  },
  optionRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 56,
    marginRight: 8,
  },
  optionIcon: {
    width: 38,
    textAlign: 'center',
  },
  optionText: { flex: 1, fontSize: 14, fontWeight: '700' },
});
