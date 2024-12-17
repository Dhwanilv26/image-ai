import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { JSON_KEYS } from '@/features/editor/types';

interface UseLoadStateProps {
  autoZoom: () => void;
  canvas: fabric.Canvas | null;
  initialState: React.RefObject<string | undefined>;
  canvasHistory: React.RefObject<string[]>;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useLoadState = ({
  autoZoom,
  canvas,
  initialState,
  canvasHistory,
  setHistoryIndex,
}: UseLoadStateProps) => {
  const initalized = useRef(false);

  useEffect(() => {
    if (!initalized.current && initialState?.current && canvas) {
      canvas.loadFromJSON(JSON.parse(initialState.current), () => {
        const currentState = JSON.stringify(canvas.toJSON(JSON_KEYS));

        // setting the history paramters properly and giving leverage to perform undo and redo operations
        canvasHistory.current = [currentState];
        setHistoryIndex(0);
        autoZoom();
      });
      initalized.current = true;
    }
  }, [canvas, autoZoom, initialState, canvasHistory, setHistoryIndex]);
};
