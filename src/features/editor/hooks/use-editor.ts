// creating a hook to use the editor
// usecallback caches the interactions allowing less re rendering
import { fabric } from 'fabric';
import { useCallback } from 'react';

export const useEditor = () => {
  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {

      const initialWorkSpace=new fabric.Rect({
        width:900,
        height:1200,
        name:'clip',
        fill:'white',
        selectable:false,
        hasControls:false,
        shadow:new fabric.Shadow({
          color:"rgba(0,0,0,0.8)",
          blur:5
        })
      })

      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkSpace);
      initialCanvas.centerObject(initialWorkSpace);

      // other elements outside the workspace wont be visible
      initialCanvas.clipPath=initialWorkSpace
    },
    [],
  );

  return { init };
};
