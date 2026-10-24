import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const GREEN = '#06462B';
const TEXT = '#242424';
const MUTED = '#666666';
const BORDER = '#A9B2AD';

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const signIn = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={TEXT} />
            <Text style={styles.backLabel}>Entrar</Text>
          </Pressable>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail ou celular</Text>
              <TextInput
                accessibilityLabel="E-mail ou celular"
                style={styles.input}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder=" "
                placeholderTextColor={MUTED}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="username"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordInput}>
                <TextInput
                  accessibilityLabel="Senha"
                  style={styles.passwordTextInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder=" "
                  placeholderTextColor={MUTED}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={signIn}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? 'Ocultar senha' : 'Mostrar senha'
                  }
                  onPress={() => setShowPassword((visible) => !visible)}
                  hitSlop={10}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={MUTED}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('./reset-password')}
              style={styles.forgotButton}
            >
              <Text style={styles.forgotLabel}>Esqueci minha senha</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={signIn}
              style={({ pressed }) => [
                styles.submitButton,
                styles.bottomButton,
                { opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <Text style={styles.submitLabel}>Entrar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 10,
  },
  backLabel: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    marginTop: 36,
  },
  fieldGroup: {
    marginBottom: 22,
  },
  label: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 9,
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    color: TEXT,
    fontSize: 16,
  },
  passwordInput: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingLeft: 14,
    paddingRight: 16,
  },
  passwordTextInput: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 0,
    color: TEXT,
    fontSize: 16,
  },
  forgotButton: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    marginTop: -5,
    marginBottom: 26,
  },
  forgotLabel: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '500',
  },
  submitButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: GREEN,
    paddingHorizontal: 20,
  },
  bottomButton: {
    marginTop: 'auto',
    marginBottom: 12,
  },
  submitLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
