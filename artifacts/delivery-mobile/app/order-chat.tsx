import React, { useEffect, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type Message = {
  id: string;
  sender: 'support' | 'user';
  text: string;
  imageUri?: string;
};

type ChatOrder = {
  restaurant: string;
  total: number;
  logo: number;
};

const orders: Record<string, ChatOrder> = {
  '123456': {
    restaurant: 'Subway',
    total: 51.6,
    logo: require('../assets/images/order-subway.png'),
  },
  '123455': {
    restaurant: 'Burger King',
    total: 48.9,
    logo: require('../assets/images/order-burger-king.png'),
  },
  '123454': {
    restaurant: "McDonald's",
    total: 42.3,
    logo: require('../assets/images/order-mcdonalds.png'),
  },
  '123453': {
    restaurant: 'Pizzaria Itália',
    total: 36.9,
    logo: require('../assets/images/order-pizzeria.png'),
  },
};

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function createInitialMessages(orderId: string, issue: string, issueId: string): Message[] {
  const missingItem = issueId === 'wrong';
  return [
    {
      id: 'welcome',
      sender: 'support',
      text: `Olá! Sou o assistente do suporte. Como posso te ajudar com o pedido #${orderId}?`,
    },
    {
      id: 'issue',
      sender: 'user',
      text: missingItem ? 'Meu pedido veio incompleto, faltou um item.' : issue,
    },
    {
      id: 'photo-request',
      sender: 'support',
      text: missingItem
        ? 'Entendi. Você pode enviar uma foto do pedido recebido? Isso ajuda a agilizar a análise.'
        : 'Entendi. Pode me contar um pouco mais sobre o que aconteceu com seu pedido?',
    },
    {
      id: 'next-step',
      sender: 'support',
      text: missingItem
        ? 'Enquanto isso, posso oferecer um cupom de desconto ou reembolso parcial do item. Qual você prefere?'
        : 'Vou ajudar você com isso. Envie mais detalhes ou uma foto para continuarmos.',
    },
  ];
}

export default function OrderChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string | string[];
    issue?: string | string[];
    issueId?: string | string[];
  }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const issue = Array.isArray(params.issue) ? params.issue[0] : params.issue;
  const issueId = Array.isArray(params.issueId) ? params.issueId[0] : params.issueId;
  const order = orderId ? orders[orderId] : undefined;
  const [messages, setMessages] = useState<Message[]>(() =>
    orderId ? createInitialMessages(orderId, issue || 'Preciso de ajuda com meu pedido.', issueId || '') : [],
  );
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const appendMessage = (text: string, imageUri?: string) => {
    const message = text.trim();
    if (!message && !imageUri) return;

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, sender: 'user', text: message, imageUri },
    ]);
    setDraft('');

    if (imageUri) return;

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `support-${Date.now()}`,
          sender: 'support',
          text: 'Entendi. Obrigado por explicar. Se tiver mais detalhes ou uma foto, pode enviar por aqui.',
        },
      ]);
    }, 650);
  };

  const attachPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });
      const imageUri = result.canceled ? undefined : result.assets[0]?.uri;
      if (imageUri) appendMessage('', imageUri);
    } catch (error) {
      console.error('Não foi possível anexar a foto ao chat:', error);
      Alert.alert('Não foi possível anexar', 'Tente selecionar a foto novamente.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.card }]}>
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
          accessibilityLabel="Voltar à ajuda do pedido"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={23} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Suporte</Text>
        <Feather name="headphones" size={23} color={colors.brandGreen} />
      </View>

      {order ? (
        <>
          <View style={[styles.orderSummary, { borderBottomColor: colors.border }]}>
            <Image source={order.logo} style={styles.orderLogo} resizeMode="contain" />
            <Text numberOfLines={1} style={[styles.orderLabel, { color: colors.foreground }]}>
              {order.restaurant} · #{orderId} · <Text style={{ color: colors.foreground }}>Entregue</Text>
            </Text>
            <Text style={[styles.orderTotal, { color: colors.foreground }]}>{formatPrice(order.total)}</Text>
          </View>

          <KeyboardAvoidingView
            style={styles.chatArea}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={insets.top + 60}
          >
            <ScrollView
              ref={scrollRef}
              style={styles.messagesScroll}
              contentContainerStyle={styles.messages}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {messages.map((message) => {
                const fromUser = message.sender === 'user';
                return (
                  <View
                    key={message.id}
                    style={[
                      styles.messageBubble,
                      fromUser ? styles.userBubble : styles.supportBubble,
                      {
                        backgroundColor: fromUser ? colors.brandGreen : colors.muted,
                        alignSelf: fromUser ? 'flex-end' : 'flex-start',
                      },
                    ]}
                  >
                    {message.imageUri ? (
                      <Image source={{ uri: message.imageUri }} style={styles.messageImage} resizeMode="cover" />
                    ) : null}
                    {message.text ? (
                      <Text style={[styles.messageText, { color: fromUser ? '#ffffff' : colors.foreground }]}>
                        {message.text}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </ScrollView>

            <View style={[styles.composer, { borderColor: colors.border, marginBottom: Math.max(insets.bottom, 10) }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Anexar uma foto"
                onPress={attachPhoto}
                style={styles.attachButton}
              >
                <Feather name="paperclip" size={22} color={colors.foreground} />
              </Pressable>
              <TextInput
                accessibilityLabel="Digite sua mensagem"
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={() => appendMessage(draft)}
                placeholder="Digite sua mensagem..."
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="send"
                style={[styles.messageInput, { color: colors.foreground }]}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Enviar mensagem"
                disabled={!draft.trim()}
                onPress={() => appendMessage(draft)}
                style={({ pressed }) => [
                  styles.sendButton,
                  {
                    backgroundColor: colors.brandGreen,
                    opacity: !draft.trim() ? 0.55 : pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Feather name="send" size={19} color="#ffffff" />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </>
      ) : (
        <View style={styles.notFound}>
          <Feather name="alert-circle" size={28} color={colors.brandMutedGreen} />
          <Text style={[styles.notFoundText, { color: colors.foreground }]}>
            Não foi possível encontrar este pedido.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButton: {
    position: 'absolute',
    left: 17,
    bottom: 8,
    width: 30,
    height: 38,
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  orderSummary: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  orderLogo: { width: 58, height: 52 },
  orderLabel: { flex: 1, fontSize: 11, fontWeight: '500' },
  orderTotal: { fontSize: 13, fontWeight: '800' },
  chatArea: { flex: 1 },
  messagesScroll: { flex: 1 },
  messages: { flexGrow: 1, paddingHorizontal: 17, paddingTop: 21, paddingBottom: 18, gap: 15 },
  messageBubble: { maxWidth: '88%', borderRadius: 15, paddingHorizontal: 13, paddingVertical: 11 },
  supportBubble: { borderTopLeftRadius: 5 },
  userBubble: { borderTopRightRadius: 5 },
  messageText: { fontSize: 14, lineHeight: 22 },
  messageImage: { width: 190, height: 150, borderRadius: 9, marginBottom: 4 },
  composer: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    paddingLeft: 9,
    paddingRight: 6,
    borderWidth: 1,
    borderRadius: 30,
    shadowColor: '#10261b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    backgroundColor: '#ffffff',
  },
  attachButton: { width: 39, height: 42, alignItems: 'center', justifyContent: 'center' },
  messageInput: { flex: 1, minHeight: 44, paddingHorizontal: 6, fontSize: 14 },
  sendButton: { width: 43, height: 43, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 24 },
  notFoundText: { fontSize: 14, textAlign: 'center' },
});
