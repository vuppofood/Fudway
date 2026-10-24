import React from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { restaurants } from '@/constants/restaurants';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useColors } from '@/hooks/useColors';

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favoriteNames, toggleFavorite } = useFavorites();
  const favoriteRestaurants = restaurants.filter((restaurant) =>
    favoriteNames.includes(restaurant.name),
  );

  const openRestaurant = (restaurant: (typeof restaurants)[number]) =>
    router.push({
      pathname: '/store',
      params: {
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        delivery: restaurant.delivery,
        freeDelivery: restaurant.freeDelivery ? 'true' : 'false',
      },
    });

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={25} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Favoritos</Text>
      </View>

      {favoriteRestaurants.length > 0 ? (
        <ScrollView
          contentContainerStyle={[
            styles.list,
            { paddingBottom: Math.max(insets.bottom, 12) + 82 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {favoriteRestaurants.map((restaurant) => (
            <View
              key={restaurant.name}
              style={[styles.restaurantCard, { borderColor: colors.border }]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Abrir ${restaurant.name}`}
                onPress={() => openRestaurant(restaurant)}
                style={styles.restaurantLink}
              >
                <Image
                  source={restaurant.storeImage ?? restaurant.image}
                  style={styles.restaurantImage}
                  resizeMode="cover"
                />
                <View style={styles.restaurantCopy}>
                  <Text style={[styles.restaurantName, { color: colors.foreground }]}>
                    {restaurant.name}
                  </Text>
                  <Text style={[styles.restaurantCuisine, { color: colors.mutedForeground }]}>
                    {restaurant.cuisine}
                  </Text>
                  <View style={styles.restaurantMeta}>
                    <MaterialCommunityIcons name="star" size={14} color={colors.brandYellow} />
                    <Text style={[styles.rating, { color: colors.foreground }]}>
                      {restaurant.rating}
                    </Text>
                    <Text style={[styles.deliveryTime, { color: colors.mutedForeground }]}>
                      {restaurant.delivery}
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remover ${restaurant.name} dos favoritos`}
                onPress={() => toggleFavorite(restaurant.name)}
                hitSlop={10}
                style={styles.removeButton}
              >
                <MaterialCommunityIcons name="heart" size={23} color="#e53935" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={[styles.emptyState, { paddingBottom: Math.max(insets.bottom, 12) + 66 }]}>
          <Image
            source={require('../../assets/images/favorites-empty.png')}
            style={styles.emptyIllustration}
            resizeMode="contain"
            accessibilityLabel="Coração dentro de uma cesta de favoritos"
          />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Você ainda não tem{'\n'}favoritos
          </Text>
          <Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>
            Adicione seus restaurantes e lojas preferidos para encontrá-los mais facilmente.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: '/category',
                params: { category: 'Restaurantes' },
              })
            }
            style={({ pressed }) => [
              styles.exploreButton,
              { backgroundColor: colors.brandInk, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.exploreButtonText}>Explorar lojas</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  backButton: { width: 30, alignItems: 'flex-start', justifyContent: 'center' },
  title: { fontSize: 25, fontWeight: '800', letterSpacing: -0.5 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyIllustration: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  emptyTitle: {
    textAlign: 'center',
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  emptyDescription: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  exploreButton: {
    width: '100%',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    marginTop: 24,
  },
  exploreButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '700' },
  list: { paddingHorizontal: 18, paddingTop: 12, gap: 12 },
  restaurantCard: {
    minHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  restaurantLink: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  restaurantImage: { width: 104, height: 104 },
  restaurantCopy: { flex: 1, paddingHorizontal: 12, gap: 5 },
  restaurantName: { fontSize: 15, fontWeight: '700' },
  restaurantCuisine: { fontSize: 12 },
  restaurantMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 12, fontWeight: '700' },
  deliveryTime: { fontSize: 11, marginLeft: 5 },
  removeButton: { padding: 13 },
});
