import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const settingsOptions = [
  { label: 'Notificações', route: '/notifications' },
  { label: 'Segurança e Privacidade', route: null },
  { label: 'Sobre a Fudway', route: null },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handlePress = (option: (typeof settingsOptions)[number]) => {
    if (option.route) {
      router.push(option.route as any);
      return;
    }

    Alert.alert(option.label, 'Esta opção ainda não está conectada.');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={30} color="#111111" />
        </Pressable>

        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.optionsList}>
          {settingsOptions.map((option) => (
            <Pressable
              key={option.label}
              accessibilityRole="button"
              onPress={() => handlePress(option)}
              style={({ pressed }) => [
                styles.optionRow,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Feather name="chevron-right" size={28} color="#111111" />
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => Alert.alert('Sair da conta', 'Essa ação ainda não está conectada.')}
          style={({ pressed }) => [
            styles.signOutButton,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={styles.signOutText}>Sair da Conta</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  backButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    marginLeft: 6,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -1.2,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },
  optionsList: {
    paddingTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingVertical: 6,
    marginBottom: 0,
  },
  optionLabel: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    color: '#111111',
    fontWeight: '400',
    letterSpacing: -0.3,
  },
  signOutButton: {
    marginTop: 18,
    height: 62,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e7ecea',
  },
  signOutText: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    color: '#111111',
    letterSpacing: -0.4,
  },
});
