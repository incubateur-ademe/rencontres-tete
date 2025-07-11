import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
          {/* 1. TarteauCitron — juste après <head> */}
                  <script
            src="https://tarteaucitron.io/load.js?domain=rencontres.territoiresentransitions.fr&uuid=2df1000bf385655312abede8e30421664e7d594e"
            async
          />

          {/* 2. Google Tag Manager (hard-coded en PROD) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W9NPH5XK');`
            }}
          />
      </Head>
      <body>
        <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W9NPH5XK"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>`
            }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TB396KTB"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
