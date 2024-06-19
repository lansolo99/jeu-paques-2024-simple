import { basePath } from "@/config/index";
import { motion } from "framer-motion";

type Props = {
  onClick: () => void;
  id?: string;
  img: string;
};

const GameboardBtn = ({ onClick, img }: Props) => {
  return (
    <motion.button
      onClick={onClick}
      className="p-1 bg-white rounded-lg shadow-lg cursor-pointer h-50px"
      whileTap={{ scale: 0.9 }}
    >
      <div className="flex items-center justify-center w-full h-full px-3 duration-100 rounded-lg hover:bg-gray-200">
        <img
          className="inline-block pointer-events-none select-none"
          src={`${basePath}/images/icons/${img}.svg`}
          alt="zoom +"
        />
      </div>
    </motion.button>
  );
};

export default GameboardBtn;
