import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const profileOptions = [
  { label: 'Endereços salvos', icon: 'map-pin' as const },
  { label: 'Formas de pagamento', icon: 'credit-card' as const },
  { label: 'Ajuda e suporte', icon: 'help-circle' as const },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.brandCream,
          paddingTop: insets.top + 26,
          paddingBottom: 100,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Perfil</Text>
      <View style={[styles.profileCard, { backgroundColor: colors.brandDeepGreen }]}>
        <View style={styles.avatar}>
          <Feather name="user" size={27} color={colors.brandDeepGreen} />
        </View>
        <View>
          <Text style={styles.profileName}>Olá, visitante!</Text>
          <Text style={styles.profileCaption}>Entre para uma experiência completa</Text>
        </View>
      </View>
      <View style={[styles.options, { backgroundColor: colors.card }]}>
        {profileOptions.map((option, index) => (
          <Pressable
            accessibilityRole="button"
            key={option.label}
            onPress={() => Alert.alert(option.label, 'Faça login para acessar esta opção.')}
            style={[
              styles.option,
              index < profileOptions.length - 1 && {
                borderBottomColor: colors.border,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
            ]}
          >
            <Feather name={option.icon} size={20} color={colors.brandGreen} />
            <Text style={[styles.optionText, { color: colors.foreground }]}>
              {option.label}
            </Text>
            <Feather name="chevron-right" size={18} color={colors.brandMutedGreen} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 22 },
  title: { fontSize: 25, fontWeight: '800', letterSpacing: -0.5 },
  profileCard: {
    marginTop: 23,
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 19,
    backgroundColor: '#f7c900',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  profileCaption: { color: '#d1e0d7', fontSize: 12, marginTop: 3 },
  options: { marginTop: 18, borderRadius: 20, paddingHorizontal: 15 },
  option: {
    minHeight: 59,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  optionText: { flex: 1, fontSize: 14, fontWeight: '500' },
});
