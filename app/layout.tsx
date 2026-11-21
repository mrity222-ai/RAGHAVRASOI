import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { StorefrontCartProvider } from '@/context/StorefrontCartContext';
import { CustomerAuthProvider } from '@/context/CustomerAuthContext';
import MobileBottomNavBar from '@/components/storefront/MobileBottomNavBar';

export const metadata: Metadata = {
  title: 'राघव रसोई (Raghav Rasoi) - Taste of Tradition',
  description: 'Authentic Indian restaurant, traditional recipes, freshly prepared dishes and genuine hospitality.',
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
