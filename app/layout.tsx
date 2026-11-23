import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { StorefrontCartProvider } from '@/context/StorefrontCartContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import MobileBottomNavBar from '@/components/storefront/MobileBottomNavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://raghavrasoi.com'),
  title: 'राघव रसोई (Raghav Rasoi) - Taste of Tradition | Gundardehi, Chhattisgarh',
  description:
    'Authentic Pure Vegetarian restaurant in Gundardehi, Chhattisgarh. Homestyle recipes, traditional breakfast, thali junction, and fast online ordering.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'राघव रसोई (Raghav Rasoi) - Taste of Tradition',
    description:
      'Pure Vegetarian Restaurant in Gundardehi, Chhattisgarh. Fresh breakfast, rich gravies, and delicious thalis.',
    url: 'https://raghavrasoi.com',
    siteName: 'Raghav Rasoi',
    locale: 'en_IN',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-black selection:text-white">
        <CustomerAuthProvider>
          <CartProvider>
            <StorefrontCartProvider>
              {children}
              <MobileBottomNavBar />
            </StorefrontCartProvider>
          </CartProvider>
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
