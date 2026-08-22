import Script from 'next/script';

/**
 * Injects Meta Pixel + Google tag loaders — only when their env IDs are set.
 * Page views are fired by <PageViewTracker/> on every route change (both
 * snippets are configured NOT to auto-send page views, to avoid double counts).
 *   NEXT_PUBLIC_META_PIXEL_ID · NEXT_PUBLIC_GA_ID
 */
export default function AnalyticsScripts() {
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const ga = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}',{send_page_view:false});`}
          </Script>
        </>
      )}
      {pixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');`}
        </Script>
      )}
    </>
  );
}
