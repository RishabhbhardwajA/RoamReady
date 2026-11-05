import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CompareProvider } from '@/context/CompareContext';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingCompareBar } from '@/components/compare/FloatingCompareBar';

export const metadata: Metadata = {
  title: 'RoamReady — Engineered Travel Gear Essentials & Luggage Accessories',
  description: 'Specialised online store for TSA combination locks, privacy luggage tags, compression packing cubes, heavy-duty baggage straps, and packable travel duffels.',
  keywords: 'TSA lock, luggage accessories, compression cubes, luggage tags, travel gear, duffel bag, flight essentials India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen flex flex-col font-sans bg-white selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <AnnouncementBar />
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <CartDrawer />
                <FloatingCompareBar />
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

