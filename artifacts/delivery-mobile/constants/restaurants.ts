export type Restaurant = {
  name: string;
  cuisine: string;
  rating: string;
  delivery: string;
  category: string;
  image?: number;
  logo?: string;
  verified?: boolean;
};

export const restaurants: Restaurant[] = [
  {
    name: 'Subway',
    cuisine: 'Sanduíches',
    rating: '4.8',
    delivery: '25–40 min',
    category: 'Sanduíches',
    logo: 'SUBWAY',
    verified: true,
  },
  {
    name: 'Subway King',
    cuisine: 'Hambúrgueres',
    rating: '4.6',
    delivery: '30–50 min',
    category: 'Sanduíches',
    image: require('../assets/images/restaurant-burger.jpg'),
  },
  {
    name: 'Bebidas & Cia',
    cuisine: 'Bebidas e bowls',
    rating: '4.7',
    delivery: '20–35 min',
    category: 'Bebidas',
    image: require('../assets/images/restaurant-bowl.jpg'),
  },
  {
    name: 'Combo da Casa',
    cuisine: 'Combos especiais',
    rating: '4.9',
    delivery: '25–40 min',
    category: 'Combos',
    image: require('../assets/images/restaurant-burger.jpg'),
  },
];
