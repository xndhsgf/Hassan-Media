export type Category = 'AI Tools' | 'Design Tools' | 'Operating Systems' | 'Security' | 'Productivity';

export type ProductType = 'License Key' | 'Account' | 'Subscription';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  type: ProductType;
  image: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  features: string[];
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'ChatGPT Plus Premium Account (1 Month)',
    description: 'Get advanced features, faster response times, and priority access to new features.',
    price: 18.99,
    originalPrice: 20.00,
    category: 'AI Tools',
    type: 'Account',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 342,
    stock: 50,
    features: ['GPT-4 Access', 'DALL-E 3 Image Generation', 'Advanced Data Analysis', 'Priority Support']
  },
  {
    id: '2',
    name: 'Adobe Creative Cloud 2024 All Apps',
    description: '1 Year Subscription to all Adobe apps including Photoshop, Illustrator, Premiere Pro.',
    price: 299.99,
    originalPrice: 599.88,
    category: 'Design Tools',
    type: 'Subscription',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 1205,
    stock: 12,
    features: ['20+ Creative Apps', '100GB Cloud Storage', 'Adobe Fonts', 'Auto Updates']
  },
  {
    id: '3',
    name: 'Windows 11 Pro OEM Key',
    description: 'Lifetime activation for 1 PC. Instant delivery to your email/dashboard.',
    price: 15.50,
    originalPrice: 199.99,
    category: 'Operating Systems',
    type: 'License Key',
    image: 'https://images.unsplash.com/photo-1629654291663-b91ad427698f?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 5630,
    stock: 999,
    features: ['Lifetime License', 'Global Activation', 'Full Pro Features', 'BitLocker Support']
  },
  {
    id: '4',
    name: 'Kaspersky Total Security 2024',
    description: 'Premium protection for up to 3 devices for 1 Year. VPN included.',
    price: 24.00,
    originalPrice: 49.99,
    category: 'Security',
    type: 'License Key',
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=600&q=80',
    rating: 4.5,
    reviewsCount: 215,
    stock: 45,
    features: ['Anti-virus', 'Free VPN (300MB/day)', 'Safe Money', 'Password Manager']
  },
  {
    id: '5',
    name: 'Microsoft Office 2021 Professional Plus',
    description: 'Genuine license key for Lifetime use. Binds to your Microsoft account.',
    price: 29.90,
    originalPrice: 249.99,
    category: 'Productivity',
    type: 'License Key',
    image: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 890,
    stock: 150,
    features: ['Word, Excel, PowerPoint', 'Outlook, Publisher, Access', 'Lifetime Access', 'One-time purchase']
  },
  {
    id: '6',
    name: 'Midjourney Pro Account (Shared)',
    description: 'Shared premium account for unlimited fast rendering. 30 Days access.',
    price: 12.99,
    category: 'AI Tools',
    type: 'Account',
    image: 'https://images.unsplash.com/photo-1681412330773-4f9e160ab557?auto=format&fit=crop&w=600&q=80',
    rating: 4.2,
    reviewsCount: 98,
    stock: 20,
    features: ['Fast GPU Time', 'Stealth Mode', 'No queue', 'Discord Integration']
  }
];

export const testimonials = [
  {
    id: 1,
    name: 'Ahmed Fathi',
    role: 'Freelance Designer',
    text: "Got my Adobe CC subscription half the price! The account was delivered instantly. Amazing service.",
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah M.',
    role: 'Software Engineer',
    text: "Purchased a Windows 11 Pro key. Activated without a single issue. The dashboard is super clean.",
    rating: 5
  },
  {
    id: 3,
    name: 'Omar Tarek',
    role: 'Agency Owner',
    text: "We buy all our productivity keys here. Safe, reliable, and their live chat support is actually helpful.",
    rating: 4
  }
];
