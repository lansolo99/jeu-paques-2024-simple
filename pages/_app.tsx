import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";

import initialGameState from "@/datas/initial-game-state";
import GameProvider from "@/stores/gameContext";
import { ThemeProvider } from "@material-tailwind/react";

// import { SpacerBpFrameTop } from "@/components/ui";

import "iframe-resizer";

import "@/styles/globals.css";
import "@/styles/loaders.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta name="robots" content="noindex"></meta>
        <title>À la recherche des trésors de Pâques !</title>
      </Head>

      <main
        className={`font-sans flex flex-col items-center justify-center overflow-hidden w-full max-w-[1920px] mx-auto !px-0 !py-0 `}
      >
        <GameProvider game={initialGameState}>
          <ThemeProvider>
            <AnimatePresence mode="wait">
              <motion.div
                key={router.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <Component {...pageProps} />
              </motion.div>
            </AnimatePresence>
          </ThemeProvider>
        </GameProvider>
      </main>
    </>
  );
}
