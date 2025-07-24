'use client';

import Head from 'next/head';
import { useConfig } from '@/hooks/useConfig';

export default function MetaTags() {
  const config = useConfig();

  return (
    <Head>
      {/* Métadonnées de base */}
      <title>{config.seoTitle || 'BIPCOSA06 - CANAGOOD 69 APP | Boutique Cannabis Lyon'}</title>
      <meta name="description" content={config.seoDescription || 'BIPCOSA06 - Boutique CANAGOOD 69 - Numéro 1 Lyon. Livraison (69) (71) (01) (42) (38). Service professionnel.'} />
      <meta name="keywords" content={config.seoKeywords || 'BIPCOSA06, CANAGOOD, Lyon, boutique, livraison, 69, cannabis, CBD'} />
      <meta name="robots" content="index, follow" />
      
      {/* Langue et région */}
      <html lang={config.language || 'fr'} />
      <meta name="language" content={config.language || 'fr'} />
      <meta name="geo.region" content={config.region || 'FR'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={config.ogTitle || 'BIPCOSA06 - CANAGOOD 69 APP'} />
      <meta property="og:description" content={config.ogDescription || 'BIPCOSA06 - Boutique CANAGOOD 69 - Numéro 1 Lyon'} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={config.siteUrl || 'https://juniorrrrr345.github.io/Cosa-'} />
      <meta property="og:locale" content={`${config.language || 'fr'}_${config.region || 'FR'}`} />
      {config.ogImage && <meta property="og:image" content={config.ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={config.ogTitle || 'BIPCOSA06 - CANAGOOD 69 APP'} />
      <meta name="twitter:description" content={config.ogDescription || 'BIPCOSA06 - Boutique CANAGOOD 69 - Numéro 1 Lyon'} />
      {config.ogImage && <meta name="twitter:image" content={config.ogImage} />}
      
      {/* Google Analytics */}
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
      
      {/* Google Search Console */}
      {config.googleSiteVerification && (
        <meta name="google-site-verification" content={config.googleSiteVerification} />
      )}
      
      {/* Autres métadonnées utiles */}
      <meta name="author" content={config.shopName || 'BIPCOSA06'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={config.siteUrl || 'https://juniorrrrr345.github.io/Cosa-'} />
    </Head>
  );
}