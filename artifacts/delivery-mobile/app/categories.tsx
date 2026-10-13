import React, { useMemo, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

type CategoryOption = {
  name: string;
  icon: FeatherIconName;
  filter?: string;
  available: boolean;
};

const categoryOptions: CategoryOption[] = [
  { name: 'Sanduíches', icon: 'package', filter: 'Sanduíches', available: true },
  { name: 'Hambúrgueres', icon: 'shopping-bag', filter: 'Hambúrgueres', available: true },
  { name: 'Bebidas', icon: 'coffee', filter: 'Bebidas', available: true },
  { name: 'Combos', icon: 'grid', filter: 'Combos', available: true },
  { name: 'Sobremesas', icon: 'gift', filter: 'Sobremesas', available: false },
  { name: 'Pizzas', icon: 'disc', available: false },
  { name: 'Comida japonesa', icon: 'star', available: false },
  { name: 'Saladas', icon: 'heart', available: false },
];

export default function CategoriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === 'web' ? 67 : insets.top;
  const [search, setSearch] = useState('');

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-BR');
    return categoryOptions.filter((category) =>
      category.name.toLocaleLowerCase('pt-BR').includes(query),
    );
  }, [search]);

  const openCategory = (category: CategoryOption) => {
    if (!category.available || !category.filter) {
      Alert.alert(
        'Categoria em breve',
        'Ainda estamos adicionando lojas para esta categoria.',
      );
      return;
    }
    router.replace({
      pathname: '/(tabs)',
      params: { category: category.filter },
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.brandCream }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brandDeepGreen} />
      <View
        style={[
          styles.header,
          { backgroundColor: colors.brandDeepGreen, paddingTop: topInset + 4 },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={22} color="#ffffff" />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Mais categorias</Text>
            <Text style={styles.subtitle}>Encontre algo gostoso para pedir</Text>
          </View>
        </View>
        <View style={[styles.searchBar, { backgroundColor: '#285a43' }]}>
          <Feather name="search" size={19} color="#ffffff" />
          <TextInput
            accessibilityLabel="Buscar categoria"
            onChangeText={setSearch}
            placeholder="Buscar categoria"
            placeholderTextColor="#c5d5cc"
            value={search}
            style={styles.searchInput}
          />
          {search ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
              onPress={() => setSearch('')}
              hitSlop={8}
            >
              <Feather name="x-circle" size={17} color="#d7e2dc" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionHeading}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Todas as categorias
          </Text>
          <Text style={[styles.sectionHint, { color: colors.brandMutedGreen }]}>
            {visibleCategories.length} opções
          </Text>
        </View>

        {visibleCategories.length > 0 ? (
          <View style={styles.categoryGrid}>
            {visibleCategories.map((category, index) => (
              <Pressable
                key={category.name}
                accessibilityRole="button"
                accessibilityLabel={
                  category.available
                    ? `Ver lojas de ${category.name}`
                    : `${category.name}, disponível em breve`
                }
                onPress={() => openCategory(category)}
                style={({ pressed }) => [
                  styles.categoryCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.84 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor:
                        index % 2 === 0 ? colors.brandGreen : colors.brandMint,
                    },
                  ]}
                >
                  <Feather
                    name={category.icon}
                    size={24}
                    color={index % 2 === 0 ? '#ffffff' : colors.brandGreen}
                  />
                </View>
                <View style={styles.categoryCardText}>
                  <Text style={[styles.categoryName, { color: colors.foreground }]}>
                    {category.name}
                  </Text>
                  <Text
                    style={[
                      styles.categoryAvailability,
                      { color: category.available ? colors.brandMutedGreen : colors.brandYellow },
                    ]}
                  >
                    {category.available ? 'Ver lojas' : 'Em breve'}
                  </Text>
                </View>
                <Feather
                  name={category.available ? 'chevron-right' : 'lock'}
                  size={16}
                  color={colors.brandMutedGreen}
                />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.noResults}>
            <Feather name="search" size={24} color={colors.brandMutedGreen} />
            <Text style={[styles.noResultsText, { color: colors.brandMutedGreen }]}>
              Nenhuma categoria encontrada.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerCopy: { flex: 1 },
  title: { color: '#ffffff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  subtitle: { marginTop: 3, color: '#d1e0d7', fontSize: 12 },
  searchBar: {
    minHeight: 46,
    borderRadius: 24,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  searchInput: { flex: 1, color: '#ffffff', fontSize: 13, paddingVertical: 8 },
  content: { flexGrow: 1, paddingHorizontal: 15, paddingTop: 19, paddingBottom: 28 },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2 },
  sectionHint: { fontSize: 11, fontWeight: '500' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: {
    width: '48.5%',
    minHeight: 105,
    padding: 12,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardText: { flex: 1, gap: 4 },
  categoryName: { fontSize: 12, fontWeight: '700' },
  categoryAvailability: { fontSize: 10, fontWeight: '600' },
  noResults: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  noResultsText: { fontSize: 13, textAlign: 'center' },
});
