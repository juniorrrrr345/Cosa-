import type { Metadata } from 'next';
import StyledComponentsRegistry from './registry';

export const metadata: Metadata = {
  title: 'BIPCOSA06 - Boutique Premium | Votre référence qualité',
  description: 'BIPCOSA06 - Votre boutique de confiance. Produits premium, service professionnel, livraison rapide.',
  keywords: 'BIPCOSA06, boutique, livraison, qualité, service, premium',
  robots: 'index, follow',
  metadataBase: new URL('https://juniorrrrr345.github.io/Cosa-'),
  openGraph: {
    title: 'BIPCOSA06 - Boutique Premium',
    description: 'BIPCOSA06 - Votre boutique de confiance pour des produits de qualité',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BIPCOSA06 - Boutique Premium',
    description: 'BIPCOSA06 - Votre boutique de confiance pour des produits de qualité',
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: '#000',
        color: 'white'
      }}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}