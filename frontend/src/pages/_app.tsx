import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AngelProvider } from 'angel_ui'
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AngelProvider>
        <Component {...pageProps} />
      </AngelProvider>
    </ChakraProvider>
  )
}

export default MyApp
