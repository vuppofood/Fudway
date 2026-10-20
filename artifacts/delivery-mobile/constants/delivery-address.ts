let currentDeliveryAddress = 'Rua das Palmeiras, 123';

export function getDeliveryAddress() {
  return currentDeliveryAddress;
}

export function setDeliveryAddress(address: string) {
  currentDeliveryAddress = address;
}
