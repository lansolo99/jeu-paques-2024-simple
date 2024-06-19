/* eslint-disable react-hooks/exhaustive-deps */

import Page from "@/components/ui/page";
import { motion } from "framer-motion";

import { Gameboard } from "@/components/gameboard";
import { useWindowSize } from "usehooks-ts";

export default function Game() {
  const { width = 0, height = 0 } = useWindowSize();

  return (
    <Page>
      <motion.div key={`new-dim-${width}/${height}`}>
        <Gameboard />
        <motion.div
          id="initial-loading"
          className="fixed inset-0 flex items-center justify-center bg-white pointer-events-none h-[100dvh]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="ball-pulse ball-pulse--gameboard relative top-[2px] scale-50">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </motion.div>
      </motion.div>
    </Page>
  );
}
