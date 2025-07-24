import type { Metadata } from 'next';
import StyledComponentsRegistry from './registry';

export const metadata: Metadata = {
  title: 'CANAGOOD 69 APP - Mini Application | Boutique Lyon',
  description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon. Livraison (69) (71) (01) (42) (38). Service professionnel.',
  keywords: 'CANAGOOD, Lyon, boutique, livraison, 69, cannabis, CBD',
  robots: 'index, follow',
  metadataBase: new URL('https://juniorrrrr345.github.io/Cosa-'),
  openGraph: {
    title: 'CANAGOOD 69 APP',
    description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CANAGOOD 69 APP',
    description: 'Boutique CANAGOOD 69 - Numéro 1 Lyon',
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