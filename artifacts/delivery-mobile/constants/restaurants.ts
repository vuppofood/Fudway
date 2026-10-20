export type Restaurant = {
  name: string;
  cuisine: string;
  rating: string;
  delivery: string;
  category: string;
  image?: number;
  storeImage?: number;
  logo?: string;
  verified?: boolean;
  openNow: boolean;
  nearby: boolean;
  promotion: boolean;
  freeDelivery: boolean;
};

export const restaurants: Restaurant[] = [
  {
    name: 'Psiu Fast Delivery',
    cuisine: 'Hambúrgueres',
    rating: '4.3',
    delivery: '70–80 min',
    category: 'Sanduíches',
    image: require('../assets/images/reference/nearby-piu.jpg'),
    storeImage: require('../assets/images/reference/storefront-piu.jpg'),
    verified: true,
    openNow: true,
    nearby: true,
    promotion: false,
    freeDelivery: true,
  },
  {
    name: 'La Petit Pizzaria',
    cuisine: 'Pizzas',
    rating: '5.0',
    delivery: '90–100 min',
    category: 'Restaurantes',
    image: require('../assets/images/reference/nearby-pizza.jpg'),
    storeImage: require('../assets/images/reference/storefront-lapetit.jpg'),
    openNow: true,
    nearby: true,
    promotion: false,
    freeDelivery: false,
  },
  {
    name: 'Jack’s Burger',
    cuisine: 'Hambúrgueres',
    rating: '4.8',
    delivery: '90–100 min',
    category: 'Sanduíches',
    image: require('../assets/images/reference/nearby-jacks.jpg'),
    storeImage: require('../assets/images/reference/storefront-jacks.jpg'),
    openNow: true,
    nearby: true,
    promotion: false,
    freeDelivery: false,
  },
];
