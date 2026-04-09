import { useEffect, useMemo, useState } from "react";
import { Card } from "./components/Card";
import { GameHeader } from "./components/GameHeader";
import { WinMessage } from "./components/WinMessage";
import { useGameLogic } from "./hooks/useGameLogic";

const imageNames = [
  "almeja.png",
  "ancla.png",
  "atardecer.png",
  "bikini.png",
  "boya-salvavidas.png",
  "brocheta.png",
  "camara-fotografica.png",
  "cangrejo.png",
  "caracol-de-mar.png",
  "castillo-de-arena.png",
  "chalecos-salvavidas.png",
  "chancletas.png",
  "chiringuito.png",
  "clima-caliente.png",
  "coco.png",
  "coctel-rojo.png",
  "coctel-verde.png",
  "cubo-de-arena.png",
  "cucurucho-de-helado.png",
  "estrella-de-mar.png",
  "faro.png",
  "furgoneta-de-surf.png",
  "gafas-de-sol.png",
  "hamaca.png",
  "hoguera.png",
  "huella.png",
  "lata-de-refresco.png",
  "mascara-de-buceo.png",
  "onda.png",
  "paleta-de-hielo.png",
  "pantalones-cortos.png",
  "pelota-de-playa.png",
  "pescado.png",
  "pina.png",
  "playa-hamaca.png",
  "playa-palmera.png",
  "playa.png",
  "protector-solar.png",
  "radio.png",
  "sandia.png",
  "sol.png",
  "sombrero-para-el-sol.png",
  "sombrilla.png",
  "tabla-de-surf.png",
  "toalla-de-playa.png",
  "tortuga.png",
  "velero.png",
  "verderon.png",
  "voleibol.png",
  "windsurf.png",
];

const getBoardOptions = (width) => {
  if (width < 640) {
    return [{ value: 8, label: "4 x 4" }];
  }

  return [
    { value: 8, label: "4 x 4" },
    { value: 15, label: "5 x 6" },
  ];
};

const getGridConfig = (pairCount) => {
  if (pairCount === 15) {
    return { columns: 5, maxWidth: "780px" };
  }

  return { columns: 4, maxWidth: "620px" };
};

function App() {
  const [boardOptions, setBoardOptions] = useState(() =>
    typeof window !== "undefined"
      ? getBoardOptions(window.innerWidth)
      : getBoardOptions(1200)
  );

  const [pairCount, setPairCount] = useState(() => {
    const initialOptions =
      typeof window !== "undefined"
        ? getBoardOptions(window.innerWidth)
        : getBoardOptions(1200);

    return initialOptions[0].value;
  });

  const {
    cards,
    score,
    moves,
    handleCardClick,
    initializeGame,
    resetToIdle,
    isGameComplete,
  } = useGameLogic(imageNames, pairCount);

  useEffect(() => {
    const handleResize = () => {
      const newOptions = getBoardOptions(window.innerWidth);
      setBoardOptions(newOptions);

      const isCurrentSizeValid = newOptions.some(
        (option) => option.value === pairCount
      );

      if (!isCurrentSizeValid) {
        const nextSize = newOptions[0].value;
        setPairCount(nextSize);
        resetToIdle(nextSize);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [pairCount, resetToIdle]);

  const gridConfig = useMemo(() => getGridConfig(pairCount), [pairCount]);

  const handleBoardSizeChange = (nextSize) => {
    setPairCount(nextSize);
    resetToIdle(nextSize);
  };

  return (
    <div className="app">
      <GameHeader
        score={score}
        moves={moves}
        onReset={initializeGame}
        boardSize={pairCount}
        boardOptions={boardOptions}
        onBoardSizeChange={handleBoardSizeChange}
      />

      {isGameComplete && (
        <WinMessage moves={moves} onClose={() => resetToIdle()} />
      )}

      <div
        className="cards-grid"
        style={{
          "--grid-columns": gridConfig.columns,
          "--grid-max-width": gridConfig.maxWidth,
        }}
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;