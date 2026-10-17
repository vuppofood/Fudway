import React, { useState } from 'react';
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
import { getDeliveryAddress, setDeliveryAddress } from '@/constants/delivery-address';

const GREEN = '#06462B';
const TEXT = '#242424';
const MUTED = '#66736C';
const BORDER = '#D8E0DB';
const PALE_GREEN = '#F5F8F6';

type LocationStep = 'list' | 'map' | 'details';
type AddressLabel = 'Casa' | 'Trabalho';

type SavedAddress = {
  street: string;
  detail: string;
  label: AddressLabel;
  icon: 'home' | 'briefcase';
};

const initialAddresses: SavedAddress[] = [
  {
    street: 'Rua das Palmeiras, 258',
    detail: 'Casa',
    label: 'Casa',
    icon: 'home',
  },
  {
    street: 'Av. Paulista, 1000',
    detail: 'Trabalho',
    label: 'Trabalho',
    icon: 'briefcase',
  },
];

export default function LocationScreen() {
  const router = useRouter();
  const [step, setStep] = useState<LocationStep>('list');
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState(getDeliveryAddress);
  const [search, setSearch] = useState('');
  const [street, setStreet] = useState('Rua das Palmeiras');
  const [number, setNumber] = useState('258');
  const [complement, setComplement] = useState('');
  const [reference, setReference] = useState('');
  const [label, setLabel] = useState<AddressLabel>('Casa');

  const goBack = () => {
    if (step === 'details') {
      setStep('map');
      return;
    }
    if (step === 'map') {
      setStep('list');
      return;
    }
    router.back();
  };

  const chooseAddress = (address: string) => {
    setDeliveryAddress(address);
    router.back();
  };

  const searchAddress = () => {
    const query = search.trim();
    if (!query) return;
    setStreet(query.replace(/,\s*\d+$/, ''));
    const numberMatch = query.match(/,\s*(\d+)$/);
    if (numberMatch) setNumber(numberMatch[1]);
    setStep('map');
  };

  const saveAddress = () => {
    if (!number.trim()) {
      Alert.alert('Número obrigatório', 'Informe o número do endereço.');
      return;
    }
    const fullAddress = `${street}, ${number.trim()}`;
    const detail = [label, complement.trim()].filter(Boolean).join(' · ');
    const savedAddress: SavedAddress = {
      street: fullAddress,
      detail,
      label,
      icon: label === 'Casa' ? 'home' : 'briefcase',
    };
    setAddresses((current) => [
      savedAddress,
      ...current.filter((address) => address.street !== fullAddress),
    ]);
    setSelectedAddress(fullAddress);
    setDeliveryAddress(fullAddress);
    setStep('list');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={goBack}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={TEXT} />
            <Text style={styles.headerTitle}>{getTitle(step)}</Text>
          </Pressable>

          {step === 'list' && (
            <ScrollView
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setStreet('Rua das Palmeiras');
                  setNumber('258');
                  setStep('map');
                }}
                style={styles.locationButton}
              >
                <View style={styles.locationIcon}>
                  <Feather name="crosshair" size={22} color={GREEN} />
                </View>
                <View style={styles.actionCopy}>
                  <Text style={styles.actionTitle}>Usar localização atual</Text>
                  <Text style={styles.actionSubtitle}>
                    Encontre endereços perto de você
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={MUTED} />
              </Pressable>

              <View style={styles.searchField}>
                <Feather name="search" size={20} color={MUTED} />
                <TextInput
                  accessibilityLabel="Busque endereço ou CEP"
                  style={styles.searchInput}
                  value={search}
                  onChangeText={setSearch}
                  onSubmitEditing={searchAddress}
                  placeholder="Busque endereço ou CEP..."
                  placeholderTextColor={MUTED}
                  returnKeyType="search"
                />
                {search.length > 0 && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Limpar busca"
                    onPress={() => setSearch('')}
                    hitSlop={8}
                  >
                    <Feather name="x" size={18} color={MUTED} />
                  </Pressable>
                )}
              </View>

              <Text style={styles.sectionTitle}>Meus endereços</Text>
              <View style={styles.addressList}>
                {addresses.map((address) => {
                  const isSelected = selectedAddress === address.street;
                  return (
                    <Pressable
                      key={`${address.street}-${address.label}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => chooseAddress(address.street)}
                      style={[
                        styles.addressCard,
                        isSelected && styles.addressCardSelected,
                      ]}
                    >
                      <View style={styles.addressIcon}>
                        <Feather name={address.icon} size={20} color={GREEN} />
                      </View>
                      <View style={styles.actionCopy}>
                        <Text style={styles.addressStreet}>{address.street}</Text>
                        <Text style={styles.addressDetail}>{address.detail}</Text>
                      </View>
                      {isSelected && (
                        <Feather name="check" size={21} color={GREEN} />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setStreet('');
                  setNumber('');
                  setComplement('');
                  setReference('');
                  setLabel('Casa');
                  setStep('map');
                }}
                style={styles.addAddressButton}
              >
                <Feather name="plus" size={20} color={GREEN} />
                <Text style={styles.addAddressText}>Adicionar novo endereço</Text>
              </Pressable>
            </ScrollView>
          )}

          {step === 'map' && (
            <View style={styles.pageContent}>
              <View style={styles.mapPlaceholder}>
                <View style={styles.mapPark} />
                <View style={styles.mapRoadHorizontal} />
                <View style={styles.mapRoadVertical} />
                <View style={styles.mapRoadDiagonal} />
                <View style={styles.mapStreetLabelTop}>
                  <Text style={styles.mapStreetText}>R. Augusta</Text>
                </View>
                <View style={styles.mapStreetLabelBottom}>
                  <Text style={styles.mapStreetText}>Av. Paulista</Text>
                </View>
                <View style={styles.mapPin}>
                  <Feather name="map-pin" size={36} color={GREEN} />
                </View>
                <View style={styles.mapZoom}>
                  <Feather name="move" size={17} color={GREEN} />
                </View>
              </View>
              <View style={styles.mapAddress}>
                <View style={styles.mapAddressIcon}>
                  <Feather name="map-pin" size={20} color={GREEN} />
                </View>
                <View style={styles.actionCopy}>
                  <Text style={styles.addressStreet}>
                    {street || 'Escolha um endereço'}
                    {number ? `, ${number}` : ''}
                  </Text>
                  <Text style={styles.addressDetail}>
                    Arraste o mapa para ajustar
                  </Text>
                </View>
              </View>
              <PrimaryButton
                label="Confirmar localização"
                onPress={() => setStep('details')}
              />
            </View>
          )}

          {step === 'details' && (
            <ScrollView
              contentContainerStyle={styles.detailsContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.detailHeading}>
                {street || 'Novo endereço'}
              </Text>
              <FormField
                label="Número *"
                value={number}
                onChangeText={setNumber}
                placeholder="Número"
                keyboardType="number-pad"
              />
              <FormField
                label="Complemento"
                value={complement}
                onChangeText={setComplement}
                placeholder="Apto, bloco..."
              />
              <FormField
                label="Ponto de referência"
                value={reference}
                onChangeText={setReference}
                placeholder="Próximo ao..."
              />
              <Text style={styles.labelHeading}>Salvar como:</Text>
              <View style={styles.labelOptions}>
                <AddressLabelButton
                  label="Casa"
                  icon="home"
                  selected={label === 'Casa'}
                  onPress={() => setLabel('Casa')}
                />
                <AddressLabelButton
                  label="Trabalho"
                  icon="briefcase"
                  selected={label === 'Trabalho'}
                  onPress={() => setLabel('Trabalho')}
                />
              </View>
              <PrimaryButton label="Salvar endereço" onPress={saveAddress} />
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getTitle(step: LocationStep) {
  if (step === 'map') return 'Confirmar localização';
  if (step === 'details') return 'Completar endereço';
  return 'Onde você está?';
}

function FormField({
  label,
  ...inputProps
}: React.ComponentProps<typeof TextInput> & { label: string }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...inputProps}
        style={styles.input}
        placeholderTextColor={MUTED}
      />
    </View>
  );
}

function AddressLabelButton({
  label,
  icon,
  selected,
  onPress,
}: {
  label: AddressLabel;
  icon: 'home' | 'briefcase';
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.labelOption, selected && styles.labelOptionSelected]}
    >
      <Feather name={icon} size={17} color={selected ? GREEN : MUTED} />
      <Text style={[styles.labelOptionText, selected && styles.labelOptionTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
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
      <Text style={styles.primaryButtonText}>{label}</Text>
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
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  backButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: TEXT,
    fontSize: 19,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 26,
    paddingBottom: 22,
  },
  locationButton: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    backgroundColor: PALE_GREEN,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7F1EB',
  },
  actionCopy: {
    flex: 1,
  },
  actionTitle: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
  actionSubtitle: {
    color: MUTED,
    fontSize: 13,
    marginTop: 4,
  },
  searchField: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 28,
  },
  searchInput: {
    flex: 1,
    color: TEXT,
    fontSize: 15,
    paddingVertical: 12,
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 13,
  },
  addressList: {
    gap: 11,
  },
  addressCard: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
  },
  addressCardSelected: {
    borderColor: GREEN,
    backgroundColor: '#F6FAF7',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF2ED',
  },
  addressStreet: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '600',
  },
  addressDetail: {
    color: MUTED,
    fontSize: 13,
    marginTop: 4,
  },
  addAddressButton: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderWidth: 1.5,
    borderColor: GREEN,
    borderStyle: 'dashed',
    borderRadius: 13,
    marginTop: 16,
  },
  addAddressText: {
    color: GREEN,
    fontSize: 15,
    fontWeight: '600',
  },
  pageContent: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 14,
  },
  mapPlaceholder: {
    flex: 1,
    minHeight: 270,
    maxHeight: 430,
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#E9EFEA',
    position: 'relative',
  },
  mapPark: {
    position: 'absolute',
    width: '42%',
    height: '36%',
    top: '9%',
    right: '-4%',
    borderRadius: 28,
    backgroundColor: '#CFE3D2',
    transform: [{ rotate: '-12deg' }],
  },
  mapRoadHorizontal: {
    position: 'absolute',
    top: '48%',
    left: '-12%',
    width: '125%',
    height: 42,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#D8E0DA',
    transform: [{ rotate: '-8deg' }],
  },
  mapRoadVertical: {
    position: 'absolute',
    top: '-12%',
    left: '46%',
    width: 38,
    height: '130%',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#D8E0DA',
    transform: [{ rotate: '17deg' }],
  },
  mapRoadDiagonal: {
    position: 'absolute',
    top: '18%',
    left: '-12%',
    width: '125%',
    height: 21,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#D8E0DA',
    transform: [{ rotate: '29deg' }],
  },
  mapStreetLabelTop: {
    position: 'absolute',
    top: '23%',
    left: '12%',
  },
  mapStreetLabelBottom: {
    position: 'absolute',
    right: '8%',
    bottom: '18%',
  },
  mapStreetText: {
    color: '#77857C',
    fontSize: 11,
    fontWeight: '500',
  },
  mapPin: {
    position: 'absolute',
    top: '42%',
    left: '48%',
    width: 46,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapZoom: {
    position: 'absolute',
    right: 13,
    bottom: 13,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  mapAddress: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 14,
  },
  mapAddressIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#EAF2ED',
  },
  primaryButton: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: GREEN,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  detailsContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 20,
  },
  detailHeading: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    color: TEXT,
    fontSize: 16,
  },
  labelHeading: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: -8,
  },
  labelOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  labelOption: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  labelOptionSelected: {
    borderColor: GREEN,
    backgroundColor: '#F2F8F4',
  },
  labelOptionText: {
    color: MUTED,
    fontSize: 15,
    fontWeight: '500',
  },
  labelOptionTextSelected: {
    color: GREEN,
    fontWeight: '600',
  },
});
