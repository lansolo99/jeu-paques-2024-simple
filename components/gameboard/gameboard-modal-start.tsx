import { basePath } from "@/config/index";
import { Button } from "@material-tailwind/react";
import { motion } from "framer-motion";
type Props = {
  onClick: () => void;
  status: "ready" | "loading";
};

const GameboardModalStart = ({ onClick, status }: Props) => {
  const overloadedStatus = "ready";
  return (
    <div
      id="backdrop"
      className="absolute inset-0 flex items-center justify-center p-5 bg-black/50"
    >
      <div
        id="modal"
        className="flex flex-col items-center justify-center gap-6 py-8 px-4  bg-white rounded-lg shadow-xl w-full max-w-[300px]"
      >
        <p className="text-center text-black">
          Déplacez-vous sur la carte interactive et cliquez pour trouver les
          objets présents dans l&apos;inventaire.
        </p>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onClick}
            disabled={overloadedStatus !== "ready"}
            size="lg"
            className={`hover:shadow-none duration-150 rounded w-[250px] bg-blue-500 text-lg normal-case hover:bg-blue-400 disabled:opacity-100 disabled:bg-blue-400 flex items-center justify-center gap-4 shadow opacity-100 `}
          >
            {overloadedStatus === "ready" ? (
              <>
                <img
                  className="inline-block"
                  src={`${basePath}/images/icons/sound-on-inverted.svg`}
                  alt="zoom +"
                />
                <p className="">C&apos;est parti&nbsp;!</p>
              </>
            ) : (
              <div className="ball-pulse relative top-[2px] scale-50">
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GameboardModalStart;
