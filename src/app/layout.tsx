import type { Metadata } from 'next';
import StyledComponentsRegistry from './registry';
import { dataService } from '@/services/dataService';

// Génération des métadonnées basées sur la configuration statique
function generateMetadata(): Metadata {
  // Utilisation directe du service pour éviter les hooks React dans le server component
  const config = dataService.getConfigSync();
  
  return {
    title: config.seoTitle || 'BIPCOSA06 - CANAGOOD 69 APP | Boutique Cannabis Lyon',
    description: config.seoDescription || 'BIPCOSA06 - Boutique CANAGOOD 69 - Numéro 1 Lyon. Livraison (69) (71) (01) (42) (38). Service professionnel.',
    keywords: config.seoKeywords || 'BIPCOSA06, CANAGOOD, Lyon, boutique, livraison, 69, cannabis, CBD',
    robots: 'index, follow',
    metadataBase: new URL(config.siteUrl || 'https://juniorrrrr345.github.io/Cosa-'),
    openGraph: {
      title: config.ogTitle || 'BIPCOSA06 - CANAGOOD 69 APP',
      description: config.ogDescription || 'BIPCOSA06 - Boutique CANAGOOD 69 - Numéro 1 Lyon',
      type: 'website',
      locale: `${config.language || 'fr'}_${config.region || 'FR'}`,
      url: config.siteUrl || 'https://juniorrrrr345.github.io/Cosa-',
      ...(config.ogImage && { images: [{ url: config.ogImage }] })
    },
    twitter: {
      card: 'summary_large_image',
      title: config.ogTitle || 'BIPCOSA06 - CANAGOOD 69 APP',
      description: config.ogDescription || 'BIPCOSA06 - Boutique CANAGOOD 69 - Numéro 1 Lyon',
      ...(config.ogImage && { images: [config.ogImage] })
    },
    ...(config.googleSiteVerification && {
      verification: {
        google: config.googleSiteVerification
      }
    })
  };
}

export const metadata: Metadata = generateMetadata();

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = dataService.getConfigSync();
  
  return (
    <html lang={config.language || 'fr'}>
      <head>
        {/* Google Analytics si configuré */}
        {config.googleAnalyticsId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${config.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}
      </head>
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