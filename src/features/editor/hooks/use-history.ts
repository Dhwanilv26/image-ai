/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { JSON_KEYS } from '../types';
interface useHistoryProps {
  canvas: fabric.Canvas | null;
}

export const useHistory = ({ canvas }: useHistoryProps) => {
  const [historyIndex, setHistoryIndex] = useState(0);

  const canvasHistory = useRef<string[]>([]); // useref used to prevent constant reloading like in usestate.. this is not gonna directly render the things..

  const skipSave = useRef(false); // prevent save method to be triggered on undo and redo .. history will be filled infintely

  const canUndo = useCallback(() => {
    return historyIndex > 0;
    // undo only possible if there are items in the history
  }, [historyIndex]);

  const canRedo = useCallback(() => {
    return historyIndex < canvasHistory.current.length - 1;
  }, [historyIndex]);

  const save = useCallback(
    (skip = false) => {
      // this skip is used for usecases where we directly want to save the data but we dont wanna put the data into undo or redo
      if (!canvas) return;

      const currentState = canvas.toJSON(JSON_KEYS);
      // adding certain extra imp proprties req in the output
      const json = JSON.stringify(currentState);

      if (!skip && !skipSave.current) {
        canvasHistory.current.push(json);
        setHistoryIndex(canvasHistory.current.length - 1);
      }

      // todo : save callback (save to the database in via autosave in realtime )
    },
    [canvas],
  );

  const undo = useCallback(() => {
    if (canUndo()) {
      skipSave.current = true;
      canvas?.clear().renderAll();

      const previousIndex = historyIndex - 1;
      const previousState = JSON.parse(canvasHistory.current[previousIndex]);

      canvas?.loadFromJSON(previousState, () => {
        canvas.renderAll();
        setHistoryIndex(previousIndex);
        skipSave.current = false;
      });
    }
  }, [canUndo, canvas, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo()) {
      skipSave.current = true;
      canvas?.clear().renderAll();

      const nextIndex = historyIndex + 1;
      const nextState = JSON.parse(canvasHistory.current[nextIndex]);

      canvas?.loadFromJSON(nextState, () => {
        canvas.renderAll();
        setHistoryIndex(nextIndex);
        skipSave.current = false;
      });
    }
  }, [canRedo, canvas, historyIndex]);

  return { save, canUndo, canRedo, undo, redo, setHistoryIndex, canvasHistory };
};
