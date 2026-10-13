import React from 'react';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export default function OrdersScreen() {
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
      <Text style={[styles.title, { color: colors.foreground }]}>Meus pedidos</Text>
      <View style={styles.emptyState}>
        <View style={[styles.iconCircle, { backgroundColor: colors.brandMint }]}>
          <Feather name="clipboard" size={31} color={colors.brandGreen} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
          Seus pedidos aparecem aqui
        </Text>
        <Text style={[styles.description, { color: colors.brandMutedGreen }]}>
          Assim que fizer seu primeiro pedido, você poderá acompanhar cada etapa por aqui.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/(tabs)')}
          style={[styles.button, { backgroundColor: colors.brandYellow }]}
        >
          <Text style={[styles.buttonText, { color: colors.brandDeepGreen }]}>
            Explorar restaurantes
          </Text>
          <Feather name="arrow-right" size={17} color={colors.brandDeepGreen} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 22 },
  title: { fontSize: 25, fontWeight: '800', letterSpacing: -0.5 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginBottom: 35,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  emptyTitle: { fontSize: 19, fontWeight: '700', textAlign: 'center' },
  description: {
    marginTop: 9,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  button: {
    marginTop: 22,
    paddingVertical: 13,
    paddingHorizontal: 17,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: { fontSize: 14, fontWeight: '700' },
});
