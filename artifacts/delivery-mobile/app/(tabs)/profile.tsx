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
  { label: 'Meus pedidos', icon: 'clipboard' as const },
  { label: 'Favoritos', icon: 'heart' as const },
  { label: 'Endereços de entrega', icon: 'map-pin' as const },
  { label: 'Formas de pagamento', icon: 'credit-card' as const },
  { label: 'Cupons e descontos', icon: 'tag' as const },
  { label: 'Ajuda', icon: 'help-circle' as const },
  { label: 'Configurações', icon: 'settings' as const },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : Platform.OS === 'android' ? 0 : insets.top;

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.profileHeader,
            {
              backgroundColor: colors.brandDeepGreen,
              paddingTop: topInset + (Platform.OS === 'android' ? 24 : 14),
            },
          ]}
        >
          <View style={styles.profileIdentity}>
            <View style={[styles.avatar, { backgroundColor: colors.brandPaper }]}>
              <Feather name="user" size={30} color={colors.brandGreen} />
            </View>
            <View style={styles.identityCopy}>
              <Text style={styles.profileName}>Keyson Reis Santos</Text>
              <Text style={styles.profileEmail}>keyson@email.com</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar perfil"
              onPress={() =>
                Alert.alert('Editar perfil', 'Esta opção ainda não está conectada.')
              }
              hitSlop={10}
              style={styles.editButton}
            >
              <Feather name="edit-2" size={17} color={colors.brandPaper} />
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.options}>
            {profileOptions.map((option) => (
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
                <Feather name={option.icon} size={19} color={colors.brandGreen} />
                <Text style={[styles.optionText, { color: colors.foreground }]}>
                  {option.label}
                </Text>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={colors.brandMutedGreen}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert('Sair da conta', 'Esta tela está em modo de demonstração.')
            }
            style={({ pressed }) => [
              styles.signOutButton,
              {
                backgroundColor: colors.brandYellow,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Text style={[styles.signOutText, { color: colors.brandDeepGreen }]}>
              Sair da conta
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 100 },
  profileHeader: {
    paddingHorizontal: 18,
    paddingBottom: 19,
  },
  profileIdentity: {
    minHeight: 59,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityCopy: { flex: 1, gap: 4 },
  profileName: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  profileEmail: { color: '#d1e0d7', fontSize: 11 },
  editButton: { padding: 5 },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 7,
    paddingBottom: 16,
  },
  options: { backgroundColor: '#ffffff' },
  option: {
    minHeight: 51,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 2,
  },
  optionText: { flex: 1, fontSize: 13, fontWeight: '500' },
  signOutButton: {
    minHeight: 47,
    marginTop: 17,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: { fontSize: 13, fontWeight: '700' },
});
