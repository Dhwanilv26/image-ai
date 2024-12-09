// creating a hook to use the editor
// usecallback caches the interactions allowing less re rendering
import { fabric } from 'fabric';
import { useCallback, useState } from 'react';
import { useAutoResize } from './use-auto-resize';

export const useEditor = () => {

  const [canvas,setCanvas]=useState<fabric.Canvas| null>(null);
  const[container,setContainer]=useState<HTMLDivElement | null>(null);

  useAutoResize({
    canvas,container
  });
 
  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {

      fabric.Object.prototype.set({
        cornerColor:'#FFF',
        cornerStyle:'circle',
        borderColor:'#3b82f6',
        borderScaleFactor:1.5,
        transparentCorners:false,
        borderOpacityWhenMoving:1,
        cornerStrokeColor:'#3b83f6'
      })
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

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const test=new fabric.Rect({
        height:100,
        width:100,
        fill:'black'
      })
    
      initialCanvas.add(test);
      initialCanvas.centerObject(test);
    },

   
    [],
  );
  

  return { init };
};
