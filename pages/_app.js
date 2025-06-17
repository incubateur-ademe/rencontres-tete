import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Head from 'next/head'
import Script from 'next/script';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@/styles/responsify-min.css'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {

  NProgress.configure({ showSpinner: false });

  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());

  const router = useRouter();
  const isPresencePage = router.pathname === '/presence';

  return (
    <>
      <Head>
        <link rel="icon" href="favicon.ico" />
        <Script id="gtm-script" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TB396KTB');
        `}
      </Script>
      </Head>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet" />
      {!isPresencePage && <Header />}
      <div className="page">
        <Component {...pageProps} />
      </div>
      {!isPresencePage && <Footer />}
    </>
  )
}
