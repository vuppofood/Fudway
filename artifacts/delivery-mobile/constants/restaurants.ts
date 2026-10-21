export type Restaurant = {
  name: string;
  cuisine: string;
  rating: string;
  delivery: string;
  category: string;
  image?: number;
  storeImage?: number;
  categoryImage?: number;
  categoryRating?: string;
  categoryDelivery?: string;
  categoryDeliveryFee?: number;
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
    categoryImage: require('../assets/images/reference/combo-classico.jpg'),
    categoryRating: '4.3',
    categoryDelivery: '25–35 min',
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
    categoryImage: require('../assets/images/reference/buncker-bacon.jpg'),
    categoryRating: '4.8',
    categoryDelivery: '30–40 min',
    categoryDeliveryFee: 4.9,
    openNow: true,
    nearby: true,
    promotion: false,
    freeDelivery: false,
  },
  {
    name: 'Burger House',
    cuisine: 'Hambúrgueres',
    rating: '4.6',
    delivery: '20–30 min',
    category: 'Sanduíches',
    image: require('../assets/images/reference/buncker-classico.jpg'),
    categoryImage: require('../assets/images/reference/buncker-classico.jpg'),
    categoryRating: '4.6',
    categoryDelivery: '20–30 min',
    verified: true,
    openNow: true,
    nearby: false,
    promotion: false,
    freeDelivery: true,
  },
  {
    name: 'The Burger Spot',
    cuisine: 'Hambúrgueres',
    rating: '4.9',
    delivery: '35–45 min',
    category: 'Sanduíches',
    image: require('../assets/images/reference/buncker-duplo.jpg'),
    categoryImage: require('../assets/images/reference/buncker-duplo.jpg'),
    categoryRating: '4.9',
    categoryDelivery: '35–45 min',
    categoryDeliveryFee: 6,
    verified: true,
    openNow: true,
    nearby: false,
    promotion: true,
    freeDelivery: false,
  },
];
