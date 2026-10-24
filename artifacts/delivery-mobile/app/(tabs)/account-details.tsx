import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const accountDetails = [
  { label: 'Nome legal', value: 'KLEBSON REIS SANTOS', muted: true, editable: false },
  { label: 'E-mail', value: 'klebson@email.com', muted: true, editable: false },
  { label: 'CPF', value: '093.***.***-19', muted: true, editable: false },
  { label: 'Telefone', value: '+55 77 98157-8336', muted: false, editable: true },
];

export default function AccountDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={27} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Dados da conta</Text>
        </View>

        <View style={styles.detailsList}>
          {accountDetails.map((detail, index) => (
            <View
              key={detail.label}
              style={[
                styles.detailRow,
                { borderBottomColor: colors.border },
                index === accountDetails.length - 1 ? styles.lastDetailRow : null,
              ]}
            >
              <View style={styles.detailCopy}>
                <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>
                  {detail.label}
                </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: detail.muted ? colors.mutedForeground : colors.foreground },
                  ]}
                >
                  {detail.value}
                </Text>
              </View>
              {detail.editable ? (
                <Feather name="chevron-right" size={25} color={colors.foreground} />
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24 },
  header: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
    marginBottom: 28,
  },
  backButton: { width: 30, alignItems: 'flex-start', justifyContent: 'center' },
  title: { fontSize: 25, fontWeight: '800', letterSpacing: -0.5 },
  detailsList: {},
  detailRow: {
    minHeight: 108,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 18,
  },
  lastDetailRow: {},
  detailCopy: { flex: 1, gap: 10 },
  detailLabel: { fontSize: 15, fontWeight: '500' },
  detailValue: { fontSize: 19, fontWeight: '500' },
});
