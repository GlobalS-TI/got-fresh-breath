import Script from 'next/script'

// ID del contenedor de GTM (formato GTM-XXXXXXX). Ver .env — si no está configurado,
// ambos componentes no renderizan nada (útil en local/dev sin trackear).
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/**
 * Snippet de cabecera de Google Tag Manager. Inicializa `window.dataLayer` y carga
 * gtm.js de forma asíncrona. GA4, Google Ads y cualquier otro tag/pixel se configuran
 * dentro de tagmanager.google.com — no hace falta tocar este archivo para agregarlos.
 */
export function GoogleTagManagerHead() {
  if (!GTM_ID) return null

  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  )
}

/**
 * Fallback <noscript> de GTM — debe ir justo después de la apertura de <body>.
 * Solo se activa si el visitante tiene JavaScript deshabilitado.
 */
export function GoogleTagManagerBody() {
  if (!GTM_ID) return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="gtm"
      />
    </noscript>
  )
}
