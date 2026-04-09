import { useCallback, useEffect, useRef, useState } from "react";

const PREVIEW_DURATION = 4000;

export const useGameLogic = (imageNames, pairCount) => {
  const previewTimeoutRef = useRef(null);
  const turnTimeoutRef = useRef(null);

  const clearTimeouts = useCallback(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }

    if (turnTimeoutRef.current) {
      clearTimeout(turnTimeoutRef.current);
      turnTimeoutRef.current = null;
    }
  }, []);

  const shuffleArray = useCallback((array) => {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, []);

  const createCards = useCallback(
    (nextPairCount, flipped = false) => {
      const selectedImages = shuffleArray(imageNames).slice(0, nextPairCount);
      const shuffledCards = shuffleArray([...selectedImages, ...selectedImages]);

      return shuffledCards.map((value, index) => ({
        id: index,
        value,
        isFlipped: flipped,
        isMatched: false,
      }));
    },
    [imageNames, shuffleArray]
  );

  const [cards, setCards] = useState(() => createCards(pairCount, false));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const schedulePreviewHide = useCallback(() => {
    previewTimeoutRef.current = setTimeout(() => {
      setCards((prev) =>
        prev.map((card) => ({
          ...card,
          isFlipped: false,
        }))
      );
      setIsLocked(false);
      previewTimeoutRef.current = null;
    }, PREVIEW_DURATION);
  }, []);

  const resetToIdle = useCallback(
    (nextPairCount = pairCount) => {
      clearTimeouts();
      setCards(createCards(nextPairCount, false));
      setFlippedCards([]);
      setMatchedCards([]);
      setScore(0);
      setMoves(0);
      setIsLocked(true);
      setIsGameStarted(false);
    },
    [pairCount, clearTimeouts, createCards]
  );

  const initializeGame = useCallback(
    (nextPairCount = pairCount) => {
      clearTimeouts();
      setCards(createCards(nextPairCount, true));
      setFlippedCards([]);
      setMatchedCards([]);
      setScore(0);
      setMoves(0);
      setIsLocked(true);
      setIsGameStarted(true);
      schedulePreviewHide();
    },
    [pairCount, clearTimeouts, createCards, schedulePreviewHide]
  );

  useEffect(() => {
    return clearTimeouts;
  }, [clearTimeouts]);

  const handleCardClick = (card) => {
    if (
      !isGameStarted ||
      card.isFlipped ||
      card.isMatched ||
      isLocked ||
      flippedCards.length === 2
    ) {
      return;
    }

    const newCards = cards.map((c) => {
      if (c.id === card.id) {
        return { ...c, isFlipped: true };
      }

      return c;
    });

    setCards(newCards);

    const newFlippedCards = [...flippedCards, card.id];
    setFlippedCards(newFlippedCards);

    if (flippedCards.length === 1) {
      setIsLocked(true);
      const firstCard = cards[flippedCards[0]];

      if (firstCard.value === card.value) {
        turnTimeoutRef.current = setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCard.id, card.id]);
          setScore((prev) => prev + 1);

          setCards((prev) =>
            prev.map((c) => {
              if (c.id === card.id || c.id === firstCard.id) {
                return { ...c, isMatched: true };
              }

              return c;
            })
          );

          setFlippedCards([]);
          setIsLocked(false);
          turnTimeoutRef.current = null;
        }, 500);
      } else {
        turnTimeoutRef.current = setTimeout(() => {
          const flippedBackCards = newCards.map((c) => {
            if (newFlippedCards.includes(c.id)) {
              return { ...c, isFlipped: false };
            }

            return c;
          });

          setCards(flippedBackCards);
          setIsLocked(false);
          setFlippedCards([]);
          turnTimeoutRef.current = null;
        }, 1000);
      }

      setMoves((prev) => prev + 1);
    }
  };

  const isGameComplete =
    isGameStarted && cards.length > 0 && matchedCards.length === cards.length;

  return {
    cards,
    score,
    moves,
    isGameComplete,
    isGameStarted,
    initializeGame,
    resetToIdle,
    handleCardClick,
  };
};