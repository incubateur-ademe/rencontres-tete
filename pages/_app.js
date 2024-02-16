import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '@/styles/responsify-min.css'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="favicon.ico" />
      </Head>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet" />
      <Header />
        <div className="page">
          <Component {...pageProps} />
        </div>   
      <Footer />
    </>
  )
}
