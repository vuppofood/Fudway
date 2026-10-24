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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const GREEN = '#20A35A';
const TEXT = '#242424';
const MUTED = '#666666';
const BORDER = '#A9B2AD';
const FIELD_BACKGROUND = '#FAFCFA';
const PLACEHOLDER = '#6F7973';
const TOTAL_STEPS = 6;

type DeliveryMethod = 'WhatsApp' | 'SMS';

function digitsOnly(value: string) {
  return value.replace(/\D/g, '');
}

function formatPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCpf(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function isValidCpf(value: string) {
  const cpf = digitsOnly(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const calculateDigit = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(cpf[index]) * (length + 1 - index);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calculateDigit(9) === Number(cpf[9]) &&
    calculateDigit(10) === Number(cpf[10])
  );
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

export default function SignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(
    null,
  );
  const [phoneCode, setPhoneCode] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(59);

  const isCodeStep = step === 2 || step === 4;

  useEffect(() => {
    if (!isCodeStep || resendSeconds === 0) return undefined;
    const timer = setInterval(() => {
      setResendSeconds((remaining) => Math.max(remaining - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCodeStep, resendSeconds]);

  const goBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((current) => current - 1);
  };

  const continueFromEmail = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('E-mail inválido', 'Informe um endereço de e-mail válido.');
      return;
    }
    setEmailCode('');
    setResendSeconds(59);
    setStep(2);
  };

  const continueFromEmailCode = () => {
    if (digitsOnly(emailCode).length !== 6) {
      Alert.alert('Código incompleto', 'Digite os 6 dígitos para continuar.');
      return;
    }
    setStep(3);
  };

  const continueFromPhone = () => {
    if (digitsOnly(phone).length !== 11) {
      Alert.alert('Número inválido', 'Informe um celular com DDD.');
      return;
    }
    if (!deliveryMethod) {
      Alert.alert(
        'Escolha como receber',
        'Selecione WhatsApp ou SMS para receber o código.',
      );
      return;
    }
    setPhoneCode('');
    setResendSeconds(59);
    setStep(4);
  };

  const continueFromPhoneCode = () => {
    if (digitsOnly(phoneCode).length !== 6) {
      Alert.alert('Código incompleto', 'Digite os 6 dígitos para continuar.');
      return;
    }
    setStep(5);
  };

  const continueFromDetails = () => {
    if (!name.trim()) {
      Alert.alert('Nome obrigatório', 'Informe seu nome completo.');
      return;
    }
    if (!isValidCpf(cpf)) {
      Alert.alert('CPF inválido', 'Confira o CPF informado.');
      return;
    }
    setStep(6);
  };

  const finishSignup = () => {
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
  };

  const resendCode = () => {
    setResendSeconds(59);
  };

  const passwordStrength = getPasswordStrength(password);

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
            onPress={goBack}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={TEXT} />
          </Pressable>

          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(step / TOTAL_STEPS) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressLabel}>
              {step} de {TOTAL_STEPS}
            </Text>
          </View>

          {step === 1 && (
            <>
              <View style={styles.heading}>
                <Text style={styles.title}>Qual o seu e-mail?</Text>
              </View>
              <FormField
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="seuemail@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
              <BottomAction>
                <PrimaryButton label="Continuar" onPress={continueFromEmail} />
              </BottomAction>
            </>
          )}

          {step === 2 && (
            <>
              <View style={styles.heading}>
                <Text style={styles.title}>
                  Digite o código de 6 dígitos que enviamos para seu e-mail
                </Text>
                <Text style={styles.subtitle}>{email}</Text>
              </View>
              <CodeEntry
                label="Código de verificação do e-mail"
                value={emailCode}
                onChangeText={setEmailCode}
              />
              <ResendCode
                seconds={resendSeconds}
                onPress={resendCode}
              />
              <BottomAction>
                <PrimaryButton
                  label="Continuar"
                  onPress={continueFromEmailCode}
                />
              </BottomAction>
            </>
          )}

          {step === 3 && (
            <>
              <View style={styles.heading}>
                <Text style={styles.title}>
                  Qual o número do seu celular?
                </Text>
              </View>
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
                  placeholderTextColor={PLACEHOLDER}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  maxLength={15}
                />
              </View>
              <Text style={styles.methodHeading}>
                Como deseja receber o código?
              </Text>
              <View style={styles.methodOptions}>
                <DeliveryOption
                  label="Receber por WhatsApp"
                  icon="message-circle"
                  selected={deliveryMethod === 'WhatsApp'}
                  onPress={() => setDeliveryMethod('WhatsApp')}
                />
                <DeliveryOption
                  label="Receber por SMS"
                  icon="message-square"
                  selected={deliveryMethod === 'SMS'}
                  onPress={() => setDeliveryMethod('SMS')}
                />
              </View>
              <BottomAction>
                <PrimaryButton label="Continuar" onPress={continueFromPhone} />
              </BottomAction>
            </>
          )}

          {step === 4 && (
            <>
              <View style={styles.heading}>
                <Text style={styles.title}>
                  Digite o código de 6 dígitos que enviamos por{' '}
                  {deliveryMethod}
                </Text>
                <Text style={styles.subtitle}>{phone}</Text>
              </View>
              <CodeEntry
                label={`Código de verificação enviado por ${deliveryMethod}`}
                value={phoneCode}
                onChangeText={setPhoneCode}
              />
              <ResendCode
                seconds={resendSeconds}
                onPress={resendCode}
              />
              <BottomAction>
                <PrimaryButton
                  label="Continuar"
                  onPress={continueFromPhoneCode}
                />
              </BottomAction>
            </>
          )}

          {step === 5 && (
            <>
              <View style={styles.heading}>
                <Text style={styles.title}>
                  Complete as informações da sua conta
                </Text>
              </View>
              <View style={styles.formFields}>
                <FormField
                  label="Nome completo"
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome completo"
                  autoCapitalize="words"
                  textContentType="name"
                />
                <FormField
                  label="CPF"
                  value={cpf}
                  onChangeText={(value) => setCpf(formatCpf(value))}
                  placeholder="000.000.000-00"
                  keyboardType="number-pad"
                  maxLength={14}
                />
              </View>
              <BottomAction>
                <PrimaryButton
                  label="Continuar"
                  onPress={continueFromDetails}
                />
              </BottomAction>
            </>
          )}

          {step === 6 && (
            <>
              <View style={styles.heading}>
                <Text style={styles.title}>Crie uma senha</Text>
              </View>
              <View style={styles.passwordFields}>
                <PasswordField
                  label="Senha"
                  value={password}
                  onChangeText={setPassword}
                  visible={showPassword}
                  onToggleVisibility={() =>
                    setShowPassword((visible) => !visible)
                  }
                />
                <View style={styles.strengthSection}>
                  <View style={styles.strengthHeading}>
                    <Text style={styles.fieldLabel}>Força da senha:</Text>
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
                                : GREEN,
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
                    label="Pelo menos 1 caractere especial (!@#$%...)"
                    met={/[^A-Za-z0-9]/.test(password)}
                  />
                </View>
                <PasswordField
                  label="Confirmar senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  visible={showConfirmPassword}
                  onToggleVisibility={() =>
                    setShowConfirmPassword((visible) => !visible)
                  }
                />
              </View>
              <BottomAction>
                <PrimaryButton label="Criar conta" onPress={finishSignup} />
              </BottomAction>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function BottomAction({ children }: { children: React.ReactNode }) {
  return <View style={styles.bottomAction}>{children}</View>;
}

function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        { opacity: pressed ? 0.82 : 1 },
      ]}
    >
      <Text style={styles.primaryButtonLabel}>{label}</Text>
    </Pressable>
  );
}

function FormField({
  label,
  ...inputProps
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...inputProps}
        style={styles.input}
        placeholderTextColor={PLACEHOLDER}
      />
    </View>
  );
}

function CodeEntry({
  label,
  value,
  onChangeText,
}: {
  label: string;
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
        accessibilityLabel={label}
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

function ResendCode({
  seconds,
  onPress,
}: {
  seconds: number;
  onPress: () => void;
}) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = String(seconds % 60).padStart(2, '0');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: seconds > 0 }}
      disabled={seconds > 0}
      onPress={onPress}
      style={styles.resendButton}
    >
      <Text style={styles.resendLabel}>
        {seconds > 0
          ? `Para reenviar, espere ${minutes}:${remainingSeconds}`
          : 'Reenviar código'}
      </Text>
    </Pressable>
  );
}

function DeliveryOption({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: 'message-circle' | 'message-square';
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.deliveryOption, selected && styles.deliveryOptionSelected]}
    >
      <Feather
        name={icon}
        size={21}
        color={selected ? GREEN : MUTED}
      />
      <Text
        style={[
          styles.deliveryOptionLabel,
          selected && styles.deliveryOptionLabelSelected,
        ]}
      >
        {label}
      </Text>
      {selected && <Feather name="check" size={18} color={GREEN} />}
    </Pressable>
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
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.passwordField}>
        <TextInput
          accessibilityLabel={label}
          style={styles.passwordInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor={PLACEHOLDER}
          secureTextEntry={!visible}
          autoCapitalize="none"
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
    paddingBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 42,
    minWidth: 42,
    justifyContent: 'center',
  },
  progressSection: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 42,
  },
  progressTrack: {
    width: '100%',
    height: 5,
    borderRadius: 5,
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  progressFill: {
    height: 5,
    borderRadius: 5,
    backgroundColor: GREEN,
  },
  progressLabel: {
    marginTop: 12,
    color: MUTED,
    fontSize: 16,
  },
  heading: {
    marginBottom: 28,
  },
  title: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 9,
    color: MUTED,
    fontSize: 16,
    lineHeight: 23,
  },
  fieldLabel: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
  formField: {
    gap: 9,
  },
  input: {
    minHeight: 62,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: FIELD_BACKGROUND,
    paddingHorizontal: 16,
    color: TEXT,
    fontSize: 17,
  },
  phoneField: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: FIELD_BACKGROUND,
    paddingHorizontal: 14,
  },
  flag: {
    fontSize: 23,
  },
  countryCode: {
    marginLeft: 8,
    color: TEXT,
    fontSize: 17,
  },
  countryDivider: {
    height: 32,
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
  },
  methodOptions: {
    gap: 12,
  },
  deliveryOption: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: FIELD_BACKGROUND,
    paddingHorizontal: 16,
  },
  deliveryOptionSelected: {
    borderColor: GREEN,
    backgroundColor: '#F3FBF6',
  },
  deliveryOptionLabel: {
    flex: 1,
    color: TEXT,
    fontSize: 16,
    fontWeight: '500',
  },
  deliveryOptionLabelSelected: {
    color: TEXT,
  },
  codeEntry: {
    position: 'relative',
  },
  codeBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  codeBox: {
    flex: 1,
    height: 60,
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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  resendLabel: {
    color: MUTED,
    fontSize: 15,
    textAlign: 'center',
  },
  formFields: {
    gap: 22,
  },
  bottomAction: {
    flex: 1,
    justifyContent: 'flex-end',
    minHeight: 130,
    paddingTop: 32,
  },
  primaryButton: {
    minHeight: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: GREEN,
    paddingHorizontal: 20,
  },
  primaryButtonLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  passwordFields: {
    gap: 18,
  },
  passwordField: {
    minHeight: 62,
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
    minHeight: 60,
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
    color: TEXT,
  },
});
