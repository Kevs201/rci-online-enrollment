import type { AppProps } from "next/app";

export default function myApp({Component, pageProps}: AppProps) {
    return <Component {...pageProps}/>
}