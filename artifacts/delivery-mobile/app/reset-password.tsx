import React, { useEffect, useState } from 'react';
import {
  Alert,
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
const FIELD_BACKGROUND = '#FAFCFA';

type DeliveryMethod = 'WhatsApp' | 'SMS';
type RecoveryStep = 'method' | 'email' | 'phone' | 'code' | 'password' | 'success';

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function formatPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getPasswordStrength(password: string) {
  const score = [
    password.length >= 8,
    /[A-Za-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (score < 2) return { label: 'Fraca', score };
  if (score < 4) return { label: 'Média', score };
  return { label: 'Forte', score };
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<RecoveryStep>('method');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(
    null,
  );
  const [code, setCode] = useState('');
  const [resendSeconds, setResendSeconds] = useState(59);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (step !== 'code' || resendSeconds === 0) return undefined;
    const timer = setInterval(() => {
      setResendSeconds((remaining) => Math.max(remaining - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, resendSeconds]);

  const goBack = () => {
    switch (step) {
      case 'method':
        router.back();
        break;
      case 'email':
      case 'phone':
        setStep('method');
        break;
      case 'code':
        setStep(deliveryMethod ? 'phone' : 'email');
        break;
      case 'password':
        setStep('code');
        break;
      case 'success':
        router.replace('/login');
        break;
    }
  };

  const startEmailRecovery = () => {
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      Alert.alert('E-mail inválido', 'Informe um endereço de e-mail válido.');
      return;
    }
    setDeliveryMethod(null);
    setCode('');
    setResendSeconds(59);
    setStep('code');
  };

  const startPhoneRecovery = (method: DeliveryMethod) => {
    if (digitsOnly(phone).length !== 11) {
      Alert.alert('Número inválido', 'Informe um celular com DDD.');
      return;
    }
    setDeliveryMethod(method);
    setCode('');
    setResendSeconds(59);
    setStep('code');
  };

  const continueFromCode = () => {
    if (digitsOnly(code).length !== 6) {
      Alert.alert('Código incompleto', 'Digite os 6 dígitos para continuar.');
      return;
    }
    setStep('password');
  };

  const resetPassword = () => {
    const strength = getPasswordStrength(password);
    if (strength.score < 4) {
      Alert.alert(
        'Senha incompleta',
        'Use pelo menos 8 caracteres, uma letra, um número e um caractere especial.',
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'Confirme a mesma senha nos dois campos.');
      return;
    }
    setStep('success');
  };

  const resendCode = () => {
    setResendSeconds(59);
  };

  const passwordStrength = getPasswordStrength(password);
  const destination =
    deliveryMethod === null ? email.trim() : formatPhone(phone);

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
          {step !== 'success' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={goBack}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color={TEXT} />
              <Text style={styles.backLabel}>{getHeading(step)}</Text>
            </Pressable>
          )}

          {step === 'method' && (
            <View style={styles.content}>
              <Text style={styles.title}>
                Como você quer receber o código de redefinição?
              </Text>
              <View style={styles.options}>
                <OptionButton
                  icon="mail"
                  label="Por e-mail"
                  onPress={() => setStep('email')}
                />
                <OptionButton
                  icon="smartphone"
                  label="Por celular"
                  onPress={() => setStep('phone')}
                />
              </View>
            </View>
          )}

          {step === 'email' && (
            <View style={styles.content}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  accessibilityLabel="E-mail"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor={MUTED}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="done"
                  onSubmitEditing={startEmailRecovery}
                />
              </View>
              <PrimaryButton
                label="Enviar código"
                onPress={startEmailRecovery}
                bottom
              />
            </View>
          )}

          {step === 'phone' && (
            <View style={styles.content}>
              <View style={styles.phoneField}>
                <Text style={styles.flag}>🇧🇷</Text>
                <Text style={styles.countryCode}>+55</Text>
                <View style={styles.countryDivider} />
                <TextInput
                  accessibilityLabel="Número de celular com DDD"
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={(value) => setPhone(formatPhone(value))}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor={MUTED}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  maxLength={15}
                />
              </View>
              <Text style={styles.methodHeading}>
                Como deseja receber o código?
              </Text>
              <View style={styles.options}>
                <OptionButton
                  icon="message-circle"
                  label="Receber por WhatsApp"
                  onPress={() => startPhoneRecovery('WhatsApp')}
                />
                <OptionButton
                  icon="message-square"
                  label="Receber por SMS"
                  onPress={() => startPhoneRecovery('SMS')}
                />
              </View>
            </View>
          )}

          {step === 'code' && (
            <View style={styles.content}>
              <Text style={styles.subtitle}>
                Enviamos para:{'\n'}
                <Text style={styles.destination}>{destination}</Text>
                {deliveryMethod ? ` (${deliveryMethod})` : ''}
              </Text>
              <CodeEntry value={code} onChangeText={setCode} />
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: resendSeconds > 0 }}
                disabled={resendSeconds > 0}
                onPress={resendCode}
                style={styles.resendButton}
              >
                <Text style={styles.resendLabel}>
                  {resendSeconds > 0
                    ? `Não recebeu? Reenviar em 0:${String(resendSeconds).padStart(2, '0')}`
                    : 'Não recebeu? Reenviar código'}
                </Text>
              </Pressable>
              <PrimaryButton
                label="Continuar"
                onPress={continueFromCode}
                bottom
              />
            </View>
          )}

          {step === 'password' && (
            <View style={styles.content}>
              <View style={styles.passwordFields}>
                <PasswordField
                  label="Nova senha"
                  value={password}
                  onChangeText={setPassword}
                  visible={showPassword}
                  onToggleVisibility={() =>
                    setShowPassword((visible) => !visible)
                  }
                />
                <View style={styles.strengthSection}>
                  <View style={styles.strengthHeading}>
                    <Text style={styles.label}>Força da senha:</Text>
                    <Text style={styles.strengthLabel}>
                      {passwordStrength.label}
                    </Text>
                  </View>
                  <View
                    accessibilityLabel={`Força da senha: ${passwordStrength.label}`}
                    style={styles.strengthTrack}
                  >
                    <View
                      style={[
                        styles.strengthFill,
                        {
                          width: `${(passwordStrength.score / 4) * 100}%`,
                          backgroundColor:
                            passwordStrength.score === 4
                              ? GREEN
                              : passwordStrength.score >= 2
                                ? '#E4A12B'
                                : '#D9534F',
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.passwordRequirements}>
                  <PasswordRequirement
                    label="Mínimo 8 caracteres"
                    met={password.length >= 8}
                  />
                  <PasswordRequirement
                    label="Pelo menos 1 letra"
                    met={/[A-Za-z]/.test(password)}
                  />
                  <PasswordRequirement
                    label="Pelo menos 1 número"
                    met={/\d/.test(password)}
                  />
                  <PasswordRequirement
                    label="Pelo menos 1 caractere especial"
                    met={/[^A-Za-z0-9]/.test(password)}
                  />
                </View>
                <PasswordField
                  label="Confirmar nova senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  visible={showConfirmPassword}
                  onToggleVisibility={() =>
                    setShowConfirmPassword((visible) => !visible)
                  }
                />
                <PrimaryButton
                  label="Redefinir senha"
                  onPress={resetPassword}
                  bottom
                />
              </View>
            </View>
          )}

          {step === 'success' && (
            <View style={styles.successContent}>
              <View style={styles.successMessage}>
                <View style={styles.successIcon}>
                  <Feather name="check" size={36} color="#FFFFFF" />
                </View>
                <Text style={styles.successTitle}>Senha redefinida{'\n'}com sucesso!</Text>
                <Text style={styles.successSubtitle}>
                  Agora você já pode entrar com a nova senha.
                </Text>
              </View>
              <PrimaryButton
                label="Ir para o login"
                onPress={() => router.replace('/login')}
                bottom
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getHeading(step: RecoveryStep) {
  switch (step) {
    case 'method':
      return 'Esqueci minha senha';
    case 'email':
      return 'Qual o seu e-mail?';
    case 'phone':
      return 'Qual o seu celular?';
    case 'code':
      return 'Digite o código de 6 dígitos';
    case 'password':
      return 'Crie uma nova senha';
    case 'success':
      return '';
  }
}

function OptionButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionButton,
        { opacity: pressed ? 0.78 : 1 },
      ]}
    >
      <Feather name={icon} size={21} color={GREEN} />
      <Text style={styles.optionLabel}>{label}</Text>
      <Feather name="chevron-right" size={20} color={MUTED} />
    </Pressable>
  );
}

function CodeEntry({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.codeEntry}>
      <View pointerEvents="none" style={styles.codeBoxes}>
        {Array.from({ length: 6 }, (_, index) => (
          <View key={index} style={styles.codeBox}>
            <Text style={styles.codeDigit}>{value[index] ?? ''}</Text>
          </View>
        ))}
      </View>
      <TextInput
        accessibilityLabel="Código de redefinição de 6 dígitos"
        style={styles.codeInput}
        value={value}
        onChangeText={(text) => onChangeText(digitsOnly(text).slice(0, 6))}
        keyboardType="number-pad"
        maxLength={6}
        textContentType="oneTimeCode"
        caretHidden
      />
    </View>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  onToggleVisibility,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  visible: boolean;
  onToggleVisibility: () => void;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordField}>
        <TextInput
          accessibilityLabel={label}
          style={styles.passwordInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor={MUTED}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onPress={onToggleVisibility}
          hitSlop={8}
        >
          <Feather
            name={visible ? 'eye-off' : 'eye'}
            size={21}
            color={MUTED}
          />
        </Pressable>
      </View>
    </View>
  );
}

function PasswordRequirement({
  label,
  met,
}: {
  label: string;
  met: boolean;
}) {
  return (
    <View style={styles.requirementRow}>
      <Feather
        name={met ? 'check-circle' : 'circle'}
        size={16}
        color={met ? GREEN : MUTED}
      />
      <Text style={[styles.requirementLabel, met && styles.requirementMet]}>
        {label}
      </Text>
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  bottom = false,
}: {
  label: string;
  onPress: () => void;
  bottom?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        bottom && styles.bottomButton,
        { opacity: pressed ? 0.82 : 1 },
      ]}
    >
      <Text style={styles.primaryButtonLabel}>{label}</Text>
    </Pressable>
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
    paddingBottom: 24,
  },
  backButton: {
    minHeight: 38,
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
  content: {
    flex: 1,
    paddingTop: 34,
  },
  title: {
    color: TEXT,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 34,
    marginBottom: 28,
  },
  subtitle: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 24,
    marginTop: -12,
    marginBottom: 28,
  },
  destination: {
    color: TEXT,
    fontWeight: '600',
  },
  options: {
    gap: 14,
  },
  bottomOptions: {
    marginTop: 'auto',
    marginBottom: 12,
  },
  optionButton: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: FIELD_BACKGROUND,
    paddingHorizontal: 16,
  },
  optionLabel: {
    flex: 1,
    color: TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
  fieldGroup: {
    gap: 9,
  },
  label: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    minHeight: 58,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: FIELD_BACKGROUND,
    paddingHorizontal: 16,
    color: TEXT,
    fontSize: 17,
  },
  phoneField: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: FIELD_BACKGROUND,
    paddingHorizontal: 14,
  },
  flag: {
    fontSize: 22,
  },
  countryCode: {
    marginLeft: 8,
    color: TEXT,
    fontSize: 17,
  },
  countryDivider: {
    height: 30,
    width: 1,
    marginHorizontal: 12,
    backgroundColor: BORDER,
  },
  phoneInput: {
    flex: 1,
    color: TEXT,
    fontSize: 17,
    paddingVertical: 12,
  },
  methodHeading: {
    marginTop: 28,
    marginBottom: 14,
    color: TEXT,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
  codeEntry: {
    position: 'relative',
    marginBottom: 4,
  },
  codeBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  codeBox: {
    flex: 1,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: FIELD_BACKGROUND,
  },
  codeDigit: {
    color: TEXT,
    fontSize: 23,
    fontWeight: '600',
  },
  codeInput: {
    ...StyleSheet.absoluteFill,
    color: 'transparent',
    backgroundColor: 'transparent',
    opacity: 0.02,
  },
  resendButton: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 22,
  },
  resendLabel: {
    color: GREEN,
    fontSize: 15,
    textAlign: 'center',
  },
  passwordFields: {
    flex: 1,
    gap: 18,
  },
  passwordField: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: FIELD_BACKGROUND,
    paddingLeft: 16,
    paddingRight: 14,
  },
  passwordInput: {
    flex: 1,
    minHeight: 56,
    color: TEXT,
    fontSize: 17,
  },
  strengthSection: {
    gap: 9,
  },
  strengthHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthLabel: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '600',
  },
  strengthTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: '#E5E9E6',
    overflow: 'hidden',
  },
  strengthFill: {
    height: 8,
    borderRadius: 8,
  },
  passwordRequirements: {
    gap: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementLabel: {
    flex: 1,
    color: MUTED,
    fontSize: 14,
  },
  requirementMet: {
    color: GREEN,
  },
  primaryButton: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: GREEN,
    paddingHorizontal: 20,
  },
  bottomButton: {
    marginTop: 'auto',
    marginBottom: 12,
  },
  primaryButtonLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  successContent: {
    flex: 1,
    paddingHorizontal: 4,
  },
  successMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: GREEN,
    marginBottom: 28,
  },
  successTitle: {
    color: TEXT,
    fontSize: 27,
    fontWeight: '700',
    lineHeight: 36,
    textAlign: 'center',
  },
  successSubtitle: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 32,
  },
});
