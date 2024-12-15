import { fabric } from 'fabric';

import { useEvent } from 'react-use';
interface UseHotKeysProps {
  canvas: fabric.Canvas | null;
  undo: () => void;
  redo: () => void;
  save: (skip?: boolean) => void;
  copy: () => void;
  paste: () => void;
}

export const useHotkeys = ({
  canvas,
  undo,
  redo,
  save,
  copy,
  paste,
}: UseHotKeysProps) => {
  useEvent('keydown', (event) => {
    const isCtrlKey = event.ctrlKey || event.metaKey; // meta key (cmd for macbooks)

    const isBackspace = event.key === 'Backspace';

    const isInput = ['INPUT', 'TEXTAREA'].includes(
      (event.target as HTMLElement).tagName,
    );
    // cant apply hotkeys in input elements

    if (isInput) {
      return;
    }

    if (isBackspace) {
      canvas?.remove(...canvas.getActiveObjects());
      // getactiveobjects returns an array
      // but remove needs the input to be object wise (one-by-one (o1,o2,o3) and not [o1,o2,o3]) 
      // therefore the spread operator is used

      canvas?.discardActiveObject();
    }
    if(event.key==='Escape'){
        canvas?.discardActiveObject();
        canvas?.renderAll();
    }

    if (isCtrlKey && event.key === 'z') {
      event.preventDefault();
      undo();
    }

    if (isCtrlKey && event.key === 'y') {
      event.preventDefault();
      redo();
    }
    if (isCtrlKey && event.key === 'c') {
      event.preventDefault();
      copy();
    }
    if (isCtrlKey && event.key === 'v') {
      event.preventDefault();
      paste();
    }
    if (isCtrlKey && event.key === 's') {
      event.preventDefault();
      save(true); // now cant undo and redo (not beig pushed into the refs created)
    }
    if (isCtrlKey && event.key === 'a') {
      event.preventDefault();
      // preventing the browser default activity to select everything on the website

      canvas?.discardActiveObject();
      // treat as new selection and discard already selected objects

      const allObjects = canvas
        ?.getObjects()
        .filter((object) => object.selectable);

      canvas?.setActiveObject(
        new fabric.ActiveSelection(allObjects, { canvas }),
      );

      canvas?.renderAll();
    }
  });
};
