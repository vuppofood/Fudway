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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDeliveryAddress, setDeliveryAddress } from '@/constants/delivery-address';

const GREEN = '#06462B';
const TEXT = '#242424';
const MUTED = '#66736C';
const BORDER = '#D8E0DB';
const PALE_GREEN = '#F5F8F6';

type LocationStep = 'list' | 'map' | 'details';
type AddressLabel = 'Casa' | 'Trabalho' | 'Outro';

type SavedAddress = {
  street: string;
  detail: string;
  label: string;
  icon: 'home' | 'briefcase' | 'grid';
  postalCode?: string;
  neighborhood?: string;
  number?: string;
  complement?: string;
  reference?: string;
  noNumber?: boolean;
  noComplement?: boolean;
};

const initialAddresses: SavedAddress[] = [
  {
    street: 'Rua das Palmeiras, 123',
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
  const { source } = useLocalSearchParams<{ source?: string }>();
  const isAccountAddress = source === 'profile';
  const [step, setStep] = useState<LocationStep>('list');
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState(getDeliveryAddress);
  const [openAddressMenu, setOpenAddressMenu] = useState<string | null>(null);
  const [editingAddressKey, setEditingAddressKey] = useState<string | null>(null);
  const [addressSearch, setAddressSearch] = useState('');
  const [street, setStreet] = useState('Rua das Palmeiras');
  const [postalCode, setPostalCode] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [number, setNumber] = useState('123');
  const [complement, setComplement] = useState('');
  const [reference, setReference] = useState('');
  const [noNumber, setNoNumber] = useState(false);
  const [noComplement, setNoComplement] = useState(false);
  const [label, setLabel] = useState<AddressLabel>('Casa');
  const [customLabel, setCustomLabel] = useState('');

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

  const confirmLocation = () => {
    setStep('details');
  };

  const editAddress = (address: SavedAddress, key: string) => {
    const numberMatch = address.street.match(/,\s*(\d+)$/);
    setStreet(address.street.replace(/,\s*\d+$/, ''));
    setNumber(address.number ?? numberMatch?.[1] ?? '');
    setPostalCode(address.postalCode ?? '');
    setNeighborhood(address.neighborhood ?? '');
    setComplement(address.complement ?? '');
    setReference(address.reference ?? '');
    setNoNumber(address.noNumber ?? !numberMatch);
    setNoComplement(address.noComplement ?? false);
    if (address.label === 'Casa' || address.label === 'Trabalho') {
      setLabel(address.label);
      setCustomLabel('');
    } else {
      setLabel('Outro');
      setCustomLabel(address.label);
    }
    setEditingAddressKey(key);
    setOpenAddressMenu(null);
    setStep('details');
  };

  const deleteAddress = (address: SavedAddress, key: string) => {
    Alert.alert(
      'Excluir endereço',
      `Deseja excluir ${address.street}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const remainingAddresses = addresses.filter(
              (item) => `${item.street}-${item.label}` !== key,
            );
            setAddresses(remainingAddresses);
            setOpenAddressMenu(null);
            if (selectedAddress === address.street) {
              const nextAddress = remainingAddresses[0]?.street ?? '';
              setSelectedAddress(nextAddress);
              setDeliveryAddress(nextAddress);
            }
          },
        },
      ],
    );
  };

  const searchAddress = () => {
    const query = addressSearch.trim();
    if (!query) return;

    const numberMatch = query.match(/,\s*(\d+)$/);
    setStreet(query.replace(/,\s*\d+$/, ''));
    if (numberMatch) {
      setNumber(numberMatch[1]);
      setNoNumber(false);
    } else {
      setNumber('');
      setNoNumber(false);
    }
    setStep('map');
  };

  const saveAddress = () => {
    if (!postalCode.trim() || !street.trim() || !neighborhood.trim()) {
      Alert.alert(
        'Endereço incompleto',
        'Informe o CEP, a rua e o bairro para continuar.',
      );
      return;
    }
    if (!noNumber && !number.trim()) {
      Alert.alert('Número obrigatório', 'Informe o número do endereço.');
      return;
    }
    if (!noComplement && !complement.trim()) {
      Alert.alert(
        'Complemento obrigatório',
        'Informe o complemento ou marque “Sem complemento”.',
      );
      return;
    }
    if (!reference.trim()) {
      Alert.alert('Referência obrigatória', 'Informe um ponto de referência.');
      return;
    }
    if (label === 'Outro' && !customLabel.trim()) {
      Alert.alert('Nome obrigatório', 'Digite um nome para identificar o endereço.');
      return;
    }
    const fullAddress = `${street.trim()}${noNumber ? '' : `, ${number.trim()}`}`;
    const savedLabel = label === 'Outro' ? customLabel.trim() : label;
    const detail = [
      savedLabel,
      neighborhood.trim(),
      noComplement ? '' : complement.trim(),
    ]
      .filter(Boolean)
      .join(' · ');
    const savedAddress: SavedAddress = {
      street: fullAddress,
      detail,
      label: savedLabel,
      icon:
        label === 'Casa' ? 'home' : label === 'Trabalho' ? 'briefcase' : 'grid',
      postalCode: postalCode.trim(),
      neighborhood: neighborhood.trim(),
      number: noNumber ? '' : number.trim(),
      complement: noComplement ? '' : complement.trim(),
      reference: reference.trim(),
      noNumber,
      noComplement,
    };
    setAddresses((current) => [
      savedAddress,
      ...current.filter(
        (address) =>
          `${address.street}-${address.label}` !== editingAddressKey &&
          address.street !== fullAddress,
      ),
    ]);
    setSelectedAddress(fullAddress);
    setDeliveryAddress(fullAddress);
    setEditingAddressKey(null);
    setOpenAddressMenu(null);
    setStep('list');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.headerBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={goBack}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color={TEXT} />
            </Pressable>
            <Text style={styles.headerTitle}>{getTitle(step, isAccountAddress)}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {step === 'list' && (
            <ScrollView
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setEditingAddressKey(null);
                  setStreet('Rua das Palmeiras');
                  setNumber('123');
                  setStep('map');
                }}
                style={styles.locationButton}
              >
                <View style={styles.locationIcon}>
                  <Feather name="map-pin" size={22} color={GREEN} />
                </View>
                <View style={styles.actionCopy}>
                  <Text style={styles.actionTitle}>Usar localização atual</Text>
                </View>
                <Feather name="chevron-right" size={20} color={MUTED} />
              </Pressable>

              <Text style={styles.sectionTitle}>Meus endereços</Text>
              <View style={styles.addressList}>
                {addresses.map((address) => {
                  const addressKey = `${address.street}-${address.label}`;
                  const isSelected = selectedAddress === address.street;
                  return (
                    <View
                      key={`${address.street}-${address.label}`}
                      style={[
                        styles.addressCard,
                        isSelected && styles.addressCardSelected,
                      ]}
                    >
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => chooseAddress(address.street)}
                        style={styles.addressMain}
                      >
                        <View style={styles.addressIcon}>
                          <Feather name={address.icon} size={20} color={GREEN} />
                        </View>
                        <View style={styles.actionCopy}>
                          <Text style={styles.addressStreet}>{address.street}</Text>
                          <Text style={styles.addressDetail}>{address.detail}</Text>
                        </View>
                        {isSelected ? (
                          <Feather name="check" size={21} color={GREEN} />
                        ) : null}
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Opções de ${address.street}`}
                        accessibilityState={{
                          expanded: openAddressMenu === addressKey,
                        }}
                        onPress={() =>
                          setOpenAddressMenu((current) =>
                            current === addressKey ? null : addressKey,
                          )
                        }
                        hitSlop={8}
                        style={styles.addressMenuButton}
                      >
                        <Feather name="more-vertical" size={21} color={MUTED} />
                      </Pressable>
                      {openAddressMenu === addressKey ? (
                        <View style={styles.addressMenu}>
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => editAddress(address, addressKey)}
                            style={styles.addressMenuItem}
                          >
                            <Feather name="edit-2" size={16} color={TEXT} />
                            <Text style={styles.addressMenuText}>Editar</Text>
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => deleteAddress(address, addressKey)}
                            style={styles.addressMenuItem}
                          >
                            <Feather name="trash-2" size={16} color="#C0392B" />
                            <Text style={styles.addressMenuDeleteText}>Excluir</Text>
                          </Pressable>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>

            </ScrollView>
          )}

          {step === 'map' && (
            <View style={styles.pageContent}>
              <View style={styles.mapSearchContainer}>
                <View style={[styles.searchField, styles.mapSearchField]}>
                  <Feather name="search" size={20} color={MUTED} />
                  <TextInput
                    accessibilityLabel="Buscar endereço ou CEP"
                    style={styles.searchInput}
                    value={addressSearch}
                    onChangeText={setAddressSearch}
                    onSubmitEditing={searchAddress}
                    placeholder="Busque endereço ou CEP..."
                    placeholderTextColor={MUTED}
                    returnKeyType="search"
                  />
                  {addressSearch.length > 0 ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Buscar endereço"
                      onPress={searchAddress}
                      hitSlop={8}
                    >
                      <Feather name="arrow-right" size={20} color={GREEN} />
                    </Pressable>
                  ) : null}
                </View>
              </View>
              <View style={styles.mapPlaceholder}>
                <MapIllustration />
              </View>
              <View style={styles.mapAddressSheet}>
                <Text style={styles.mapAddressTitle}>
                  {street || 'Rua das Palmeiras'}, {number || '123'}
                </Text>
                <Text style={styles.mapAddressSubtitle}>
                  Vila Nova • São Paulo - SP
                </Text>
                <View style={styles.mapAddressDivider} />
                <Pressable
                  accessibilityRole="button"
                  onPress={confirmLocation}
                  style={({ pressed }) => [
                    styles.confirmAddressButton,
                    { opacity: pressed ? 0.78 : 1 },
                  ]}
                >
                  <Text style={styles.confirmAddressText}>Confirmar Endereço</Text>
                </Pressable>
              </View>
            </View>
          )}

          {step === 'details' && (
            <ScrollView
              contentContainerStyle={styles.detailsContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.detailsMapPreview}>
                <MapIllustration />
              </View>
              <FormField
                label="CEP"
                required
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="00000-000"
                keyboardType="number-pad"
              />
              <FormField
                label="Rua"
                required
                value={street}
                onChangeText={setStreet}
                placeholder="Nome da rua"
              />
              <FormField
                label="Bairro"
                required
                value={neighborhood}
                onChangeText={setNeighborhood}
                placeholder="Nome do bairro"
              />
              <FormField
                label="Número do endereço"
                required={!noNumber}
                value={number}
                onChangeText={setNumber}
                placeholder="Número"
                keyboardType="number-pad"
              />
              <ToggleOption
                label="Sem número"
                selected={noNumber}
                onPress={() => {
                  setNoNumber((current) => !current);
                  if (!noNumber) setNumber('');
                }}
              />
              <FormField
                label="Complemento"
                required={!noComplement}
                value={complement}
                onChangeText={setComplement}
                placeholder="Apto, bloco..."
              />
              <ToggleOption
                label="Sem complemento"
                selected={noComplement}
                onPress={() => {
                  setNoComplement((current) => !current);
                  if (!noComplement) setComplement('');
                }}
              />
              <FormField
                label="Ponto de referência"
                required
                value={reference}
                onChangeText={setReference}
                placeholder="Próximo ao..."
              />
              <Text style={styles.labelHeading}>Salvar como</Text>
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
                <AddressLabelButton
                  label="Outro"
                  icon="grid"
                  selected={label === 'Outro'}
                  onPress={() => setLabel('Outro')}
                />
              </View>
              {label === 'Outro' ? (
                <FormField
                  label="Nome do endereço"
                  required
                  value={customLabel}
                  onChangeText={setCustomLabel}
                  placeholder="Ex.: Casa da mãe"
                  autoFocus
                />
              ) : null}
              <PrimaryButton label="Salvar endereço" onPress={saveAddress} />
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getTitle(step: LocationStep, isAccountAddress: boolean) {
  if (step === 'map') return 'Endereço de entrega';
  if (step === 'details') return 'Endereço de entrega';
  if (isAccountAddress) return 'Endereço de entrega';
  return 'Onde você está?';
}

function FormField({
  label,
  required = false,
  ...inputProps
}: React.ComponentProps<typeof TextInput> & {
  label: string;
  required?: boolean;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={styles.requiredMark}> *</Text> : null}
      </Text>
      <TextInput
        {...inputProps}
        style={styles.fieldInput}
        placeholderTextColor={MUTED}
      />
    </View>
  );
}

function ToggleOption({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={styles.toggleOption}
    >
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected ? <Feather name="check" size={15} color="#FFFFFF" /> : null}
      </View>
      <Text style={styles.toggleLabel}>{label}</Text>
    </Pressable>
  );
}

function MapIllustration() {
  return (
    <>
      <View style={styles.mapPark} />
      <View style={styles.mapRoadHorizontal} />
      <View style={styles.mapRoadVertical} />
      <View style={styles.mapRoadDiagonal} />
      <View style={styles.mapRoadCross} />
      <View style={styles.mapStreetLabelTop}>
        <Text style={styles.mapStreetText}>Rua das Palmeiras</Text>
      </View>
      <View style={styles.mapStreetLabelBottom}>
        <Text style={styles.mapStreetText}>Vila Nova</Text>
      </View>
      <View style={styles.mapStreetLabelCenter}>
        <Text style={styles.mapStreetText}>Av. Brasil</Text>
      </View>
      <Text style={styles.mapParkLabel}>Parque Nova{'\n'}Esperança</Text>
      <View style={styles.mapPin}>
        <Feather name="map-pin" size={42} color={GREEN} />
      </View>
    </>
  );
}

function AddressLabelButton({
  label,
  icon,
  selected,
  onPress,
}: {
  label: AddressLabel;
  icon: 'home' | 'briefcase' | 'grid';
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
  headerBar: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 42,
  },
  headerTitle: {
    position: 'absolute',
    left: 42,
    right: 42,
    color: TEXT,
    fontSize: 19,
    fontWeight: '600',
    textAlign: 'center',
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
  mapSearchContainer: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  mapSearchField: {
    marginBottom: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
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
    position: 'relative',
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  addressMain: {
    minHeight: 72,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 13,
  },
  addressCardSelected: {
    borderColor: GREEN,
    backgroundColor: '#F6FAF7',
  },
  addressMenuButton: {
    width: 42,
    minHeight: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressMenu: {
    position: 'absolute',
    top: 46,
    right: 8,
    zIndex: 2,
    minWidth: 142,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  addressMenuItem: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 13,
  },
  addressMenuText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '500',
  },
  addressMenuDeleteText: {
    color: '#C0392B',
    fontSize: 14,
    fontWeight: '500',
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
  pageContent: {
    flex: 1,
    marginHorizontal: -22,
  },
  mapPlaceholder: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#F0F1EF',
    position: 'relative',
  },
  detailsMapPreview: {
    height: 210,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#F0F1EF',
    position: 'relative',
    marginHorizontal: -22,
    marginBottom: 2,
  },
  mapPark: {
    position: 'absolute',
    width: '44%',
    height: '31%',
    left: '-7%',
    bottom: '11%',
    borderRadius: 48,
    backgroundColor: '#C7E9B9',
    transform: [{ rotate: '24deg' }],
  },
  mapRoadHorizontal: {
    position: 'absolute',
    top: '50%',
    left: '-15%',
    width: '135%',
    height: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E1E3E1',
    transform: [{ rotate: '14deg' }],
  },
  mapRoadVertical: {
    position: 'absolute',
    top: '-10%',
    left: '46%',
    width: 20,
    height: '125%',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E1E3E1',
    transform: [{ rotate: '-10deg' }],
  },
  mapRoadDiagonal: {
    position: 'absolute',
    top: '25%',
    left: '-12%',
    width: '130%',
    height: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E1E3E1',
    transform: [{ rotate: '-35deg' }],
  },
  mapRoadCross: {
    position: 'absolute',
    top: '9%',
    right: '18%',
    width: 15,
    height: '112%',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E1E3E1',
    transform: [{ rotate: '34deg' }],
  },
  mapStreetLabelTop: {
    position: 'absolute',
    top: '18%',
    left: '13%',
    transform: [{ rotate: '-16deg' }],
  },
  mapStreetLabelBottom: {
    position: 'absolute',
    right: '11%',
    top: '52%',
  },
  mapStreetLabelCenter: {
    position: 'absolute',
    left: '37%',
    top: '58%',
    transform: [{ rotate: '14deg' }],
  },
  mapStreetText: {
    color: '#3F4742',
    fontSize: 14,
    fontWeight: '600',
  },
  mapParkLabel: {
    position: 'absolute',
    left: '9%',
    bottom: '23%',
    color: TEXT,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  mapPin: {
    position: 'absolute',
    top: '43%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -21,
    marginTop: -21,
  },
  mapAddressSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  mapAddressTitle: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '700',
  },
  mapAddressSubtitle: {
    color: '#737982',
    fontSize: 14,
    marginTop: 5,
  },
  mapAddressDivider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 16,
    marginBottom: 14,
    backgroundColor: BORDER,
  },
  confirmAddressButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#16824C',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  confirmAddressText: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '700',
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
    paddingTop: 8,
    paddingBottom: 20,
    gap: 10,
  },
  fieldContainer: {
    minHeight: 76,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDE2EE',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  fieldLabel: {
    color: '#737982',
    fontSize: 13,
    fontWeight: '500',
  },
  requiredMark: {
    color: '#E5483D',
    fontWeight: '700',
  },
  fieldInput: {
    minHeight: 30,
    color: TEXT,
    fontSize: 15,
    paddingVertical: 2,
  },
  toggleOption: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: -5,
    marginBottom: 1,
  },
  checkbox: {
    width: 19,
    height: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#9099A8',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    borderColor: GREEN,
    backgroundColor: GREEN,
  },
  toggleLabel: {
    color: '#737982',
    fontSize: 14,
  },
  labelHeading: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 5,
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
    color: TEXT,
    fontWeight: '600',
  },
});
