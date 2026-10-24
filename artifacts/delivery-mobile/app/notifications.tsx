import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const notifications = [
  {
    id: 'delivery',
    title: 'Seu pedido saiu para entrega!',
    description: 'Psiu Fast Delivery · Pedido #4821',
    time: 'Há 12 min',
    icon: 'truck' as const,
    color: '#279653',
    image: require('../assets/images/reference/buncker-classico.jpg'),
    unread: true,
  },
  {
    id: 'delivered',
    title: 'Pedido entregue',
    description: 'La Petit Pizzaria · Pedido #4798',
    time: 'Há 2 h',
    icon: 'check' as const,
    color: '#279653',
    image: require('../assets/images/reference/category-pizza.jpg'),
  },
  {
    id: 'coupon',
    title: 'Cupom de R$ 15 liberado!',
    description: "Válido em Jack's Burger até amanhã",
    time: 'Hoje, 18:30',
    icon: 'percent' as const,
    color: '#e64b37',
  },
  {
    id: 'nearby',
    title: 'Novidades perto de você',
    description: 'Psiu Fast Delivery e mais 3 lojas com frete grátis',
    time: 'Ontem',
    icon: 'bell' as const,
    color: '#279653',
  },
  {
    id: 'review',
    title: 'Avalie seu último pedido',
    description: "Jack's Burger · Como foi a experiência?",
    time: 'Ontem',
    icon: 'star' as const,
    color: '#dcebd4',
    iconColor: '#279653',
  },
];

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.screen, { backgroundColor: '#f7f7f7' }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 20 : 8),
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Feather name="arrow-left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Notificações
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.notificationList,
          { paddingBottom: Math.max(insets.bottom, 24) + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification) => (
          <View
            key={notification.id}
            accessibilityLabel={`${notification.title}. ${notification.description}. ${notification.time}`}
            style={styles.notificationCard}
          >
            {notification.unread ? <View style={styles.unreadDot} /> : null}
            <View
              style={[
                styles.notificationIcon,
                { backgroundColor: notification.color },
              ]}
            >
              <Feather
                name={notification.icon}
                size={notification.icon === 'truck' ? 25 : 27}
                color={notification.iconColor ?? '#ffffff'}
              />
            </View>
            <View style={styles.notificationCopy}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationDescription}>
                {notification.description}
              </Text>
            </View>
            <View style={styles.notificationAside}>
              {notification.image ? (
                <Image
                  source={notification.image}
                  style={styles.notificationImage}
                  resizeMode="cover"
                />
              ) : null}
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ffffff',
  },
  headerButton: {
    width: 40,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  notificationList: { paddingHorizontal: 16, paddingTop: 16 },
  notificationCard: {
    minHeight: 114,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  unreadDot: {
    position: 'absolute',
    left: 4,
    top: '50%',
    width: 10,
    height: 10,
    marginTop: -5,
    borderRadius: 5,
    backgroundColor: '#279653',
  },
  notificationIcon: {
    width: 58,
    height: 58,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderRadius: 29,
  },
  notificationCopy: { flex: 1, justifyContent: 'center', gap: 6 },
  notificationTitle: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
  notificationDescription: {
    color: '#686868',
    fontSize: 13,
    lineHeight: 18,
  },
  notificationAside: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    marginLeft: 8,
  },
  notificationImage: { width: 58, height: 58, borderRadius: 12 },
  notificationTime: { color: '#686868', fontSize: 12 },
});
