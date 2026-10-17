let currentDeliveryAddress = 'Rua das Palmeiras, 258';

export function getDeliveryAddress() {
  return currentDeliveryAddress;
}

export function setDeliveryAddress(address: string) {
  currentDeliveryAddress = address;
}
