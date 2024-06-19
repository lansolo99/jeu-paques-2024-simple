/* eslint-disable react-hooks/exhaustive-deps */
import { basePath } from "@/config/index";
import differencesCoordinates from "@/datas/differences-coords";
import { useGameContext } from "@/stores/gameContext";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";

import { Draft, produce } from "immer";
import ExportedImage from "next-image-export-optimizer";

import { useCallback, useEffect, useRef, useState } from "react";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";

type Coords = { x: number; y: number };

import ConfettiExplosion from "react-confetti-explosion";
import { useMediaQuery, useWindowSize } from "usehooks-ts";
import { GameboardBtn, GameboardModalStart } from ".";
import GameboardModalEnd from "./gameboard-modal-end";

const Gameboard = () => {
  // States
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFxWinRef = useRef<HTMLAudioElement | null>(null);
  const audioFxStartRef = useRef<HTMLAudioElement | null>(null);

  const { width = 0 } = useWindowSize();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const imgRef = useRef<HTMLImageElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pinchZoomRef = useRef(null);
  const [game, setGame] = useGameContext();

  const x = useMotionValue(0);

  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const [isAudioPlaying, setisAudioPlaying] = useState(false);
  const [hasGameSessionStarted, setHasGameSessionStarted] = useState(false);

  const [minZoomScale, setMinZoomScale] = useState(1);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  const differencesFound = Object.values(game.differencesFound);
  const totalDifferences = differencesFound.length;
  const foundDiffCount = differencesFound.filter(
    (value) => value === true
  ).length;
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Game logic
  const isWithinDifferencesCoordinates = (cursorCoords: Coords) => {
    const areaSizeInPercent = 10;

    for (const zone of differencesCoordinates) {
      const [minX, minY] = zone.coords[0];
      const maxX = minX + areaSizeInPercent;
      const maxY = minY + areaSizeInPercent;

      const { x, y } = cursorCoords;

      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        return { isInZone: true, id: zone.id };
      }
    }

    return { isInZone: false, id: null };
  };

  const updateFoundDifferences = (id: number) => {
    setGame((prevGame) =>
      produce(prevGame, (draft: Draft<typeof prevGame>) => {
        const key = `d${id}` as keyof typeof prevGame.differencesFound;
        draft.differencesFound[key] = true;
      })
    );
  };

  // UI logic
  const handleImageClick = (e: {
    target: any;
    clientX: number;
    clientY: number;
  }) => {
    const div = e.target;
    const rect = div.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const coords = { x, y };

    const differenceCheck = isWithinDifferencesCoordinates(coords);

    if (differenceCheck.isInZone) {
      if (isMobile) startSidebarItemsDrag(differenceCheck.id as number);
      if (audioFxWinRef.current) audioFxWinRef.current.play();

      updateFoundDifferences(differenceCheck.id as number);
    } else {
    }
  };

  const toogleSound = () => {
    if (isAudioPlaying) {
      setisAudioPlaying(false);
      audioRef.current?.pause();
      if (audioFxWinRef.current) {
        audioFxWinRef.current.volume = 0;
      }
    } else {
      setisAudioPlaying(true);
      audioRef.current?.play();
      if (audioFxWinRef.current) {
        audioFxWinRef.current.volume = 0.5;
      }
    }
  };

  const handleStartGame = () => {
    audioFxStartRef.current?.play();
    setHasGameSessionStarted(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current?.play();
        audioRef.current.volume = 0.5;
        audioRef.current.loop = true;
      }
      setisAudioPlaying(true);
    }, 500);
  };

  const handleRestartGame = () => {
    audioFxStartRef.current?.play();
    setGame((prevGame) =>
      produce(prevGame, (draft: Draft<typeof prevGame>) => {
        for (let key in draft.differencesFound) {
          draft.differencesFound[
            key as keyof typeof prevGame.differencesFound
          ] = false;
        }
        draft.errors = 0;
      })
    );
    setIsGameFinished(false);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current?.play();
        audioRef.current.volume = 0.5;
        audioRef.current.loop = true;
      }
      setisAudioPlaying(true);
    }, 500);
  };

  // Event handlers
  const onUpdate = useCallback(
    ({ x, y, scale }: { x: number; y: number; scale: number }) => {
      const img = imgRef.current;
      if (img) {
        const value = make3dTransformValue({ x, y, scale });
        img.style.setProperty("transform", value);
      }
    },
    []
  );

  const startSidebarItemsDrag = (id: number) => {
    const decrementedId = id - 1;
    const newXValue = -decrementedId * 75;
    x.set(newXValue);
  };

  //Side effects
  useEffect(() => {
    console.log("width has changed: ", width);

    let newZoomScale = 1;
    let offsetX = 0;
    let offsetY = 0;

    switch (true) {
      case width <= 480:
        offsetX = 200;
        offsetY = 0;
        newZoomScale = 4;
        break;
      case width <= 768:
        offsetX = 400;
        offsetY = 0;
        newZoomScale = 4;
        break;
      case width <= 1024:
        offsetX = 500;
        offsetY = 0;
        newZoomScale = 3;
        break;
      case width <= 1920:
        offsetX = 200;
        offsetY = 300;
        newZoomScale = 1.8;
        break;
      default:
        offsetX = 600;
        offsetY = 100;
        newZoomScale = 1.7;
    }

    setMinZoomScale((prev) => newZoomScale);

    setTimeout(() => {
      console.log("pinchZoomRef: ", pinchZoomRef.current);
      //@ts-ignore
      pinchZoomRef.current?.scaleTo({
        scale: newZoomScale,
        x: offsetX,
        y: offsetY,
      });
    }, 500);

    setSidebarWidth(sidebarRef.current?.offsetWidth ?? 0);
  }, [width]);

  useEffect(() => {
    if (foundDiffCount === totalDifferences) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsGameFinished(true);
      }
    }
  }, [foundDiffCount]);

  useEffect(() => {
    audioRef.current = new Audio(`${basePath}/music/morning-tea.mp3`);
    audioFxWinRef.current = new Audio(`${basePath}/music/gui-fx-02.mp3`);
    audioFxStartRef.current = new Audio(`${basePath}/music/swoop.mp3`);

    audioFxStartRef.current.volume = 0.5;
    audioFxWinRef.current.volume = 0.5;

    if (audioRef.current) {
      audioRef.current.addEventListener(
        "canplaythrough",
        () => {
          setIsAudioLoading(false);
        },
        false
      );
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("hasRefreshed")) {
      setTimeout(() => {
        localStorage.setItem("hasRefreshed", "true");
        window.location.reload();
      }, 700);
    }
  }, [minZoomScale]);

  return (
    <section className="relative w-full text-white p-2 md2:p-[20px] flex flex-col-reverse lg:flex-row gap-2 mx-auto md2:container h-[100dvh]">
      {/* sidebar */}
      <div
        id="sidebar"
        className="p-2 bg-yellow-500 rounded-lg  lg:w-[110px] flex lg:flex-col gap-4 items-center"
        ref={sidebarRef}
      >
        <p className="ml-2 font-bold text-center text-black lg:mt-2 lg:ml-0">
          Objets
        </p>
        <div className="overflow-hidden lg:overflow-visible">
          <motion.div
            id="items-draggable-rail"
            className="flex gap-2 lg:cursor-auto lg:flex-col"
            drag="x"
            dragConstraints={{
              left: isMobile ? -sidebarWidth : 0,
              right: 0,
            }}
            style={{ x }}
          >
            {differencesCoordinates.map((item, i) => {
              const { name } = item;
              const isDiffFound = differencesFound[i];

              return (
                <div
                  key={`item-${name}`}
                  className="relative flex items-center justify-center bg-white rounded-lg w-[75px] h-[75px] lg:w-auto lg:h-auto aspect-square"
                >
                  <ExportedImage
                    priority
                    src={`${basePath}/images/gameboard/item-${name}.png`}
                    alt={name}
                    width={87}
                    height={87}
                    className={`block object-cover w-full h-full pointer-events-none select-none ${
                      isDiffFound ? "opacity-50" : "opacity-100"
                    }`}
                  />
                  {isDiffFound && (
                    <motion.img
                      id={`checkmark-${i}`}
                      initial={{ scale: 0 }}
                      animate={{
                        scale: 1,
                        transition: { type: "spring", duration: 0.4 },
                      }}
                      width="20"
                      src={`${basePath}/images/gameboard/game-dff-check.svg`}
                      alt={name}
                      className="w-[40px] lg:w-[40px] absolute pointer-events-none bottom-0 lg:bottom-[-7px] right-0 lg:right-[-7px]"
                    />
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* map */}

      <div
        id="map"
        className="relative overflow-hidden bg-blue-500 rounded-lg grow"
      >
        <QuickPinchZoom
          ref={pinchZoomRef}
          onUpdate={onUpdate}
          enforceBoundsDuringZoom={true}
          shouldInterceptWheel={() => false}
          maxZoom={4}
          minZoom={minZoomScale}
          setOffsetsOnce={false}
          shouldCancelHandledTouchEndEvents={true}
          containerProps={{
            className: "w-full h-full aspect-[3840/2160] cursor-pointer",
          }}
        >
          <div
            ref={imgRef}
            onClick={(e) => {
              handleImageClick(e);
            }}
            className="w-[3840px] h-[2160px]"
          >
            <ExportedImage
              id="map"
              priority
              src={`${basePath}/images/gameboard/gameboard.jpg`}
              alt="Jeu de Pâques 2024"
              width={3840}
              height={2160}
              // width={isMobile ? 1920 : 3840}
              // height={isMobile ? 1080 : 2160}
              style={{ imageRendering: "-webkit-optimize-contrast" }}
              className="w-[3840px] h-[2160px]"
            />

            {differencesFound.map((diffState, i) => {
              const diffId = Object.keys(game.differencesFound)[i];

              const coords = differencesCoordinates[i].coords[0];
              const name = differencesCoordinates[i].name;
              const x = coords[0];
              const y = coords[1];

              if (diffState) {
                return (
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      transition: { type: "spring", duration: 0.4 },
                    }}
                    key={`diff-${i}-${diffId}`}
                    width="60"
                    src={`${basePath}/images/gameboard/game-dff-check.svg`}
                    alt={name}
                    className="w-[120px] absolute pointer-events-none"
                    style={{ top: `${y}%`, left: `${x}%` }}
                  />
                );
              }
            })}
          </div>
        </QuickPinchZoom>

        <div className="absolute top-[10px] right-[10px] flex gap-4">
          <GameboardBtn
            id="sound"
            onClick={() => toogleSound()}
            img={isAudioPlaying ? "sound-on" : "sound-off"}
          />

          <div
            id="counter"
            className="h-[50px] px-1 flex items-center justify-center gap-1 bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex gap-[3px] px-2 py-1 font-bold text-black rounded-lg text-lg items-center">
              <span className="relative ">{foundDiffCount}</span>
              <span>/</span>
              <span>7</span>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {!hasGameSessionStarted && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center "
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GameboardModalStart
                onClick={() => handleStartGame()}
                status={isAudioLoading ? "loading" : "ready"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isGameFinished && (
        <div className="fixed inset-0 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 flex items-center justify-center "
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameboardModalEnd
              onClick={() => handleRestartGame()}
              status={isAudioLoading ? "loading" : "ready"}
            />
          </motion.div>
          <ConfettiExplosion />
        </div>
      )}
    </section>
  );
};

export default Gameboard;
