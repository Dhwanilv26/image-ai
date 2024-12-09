'use client';

import { useEditor } from '../hooks/use-editor';
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
export const Editor = () => {
  const { init } = useEditor();

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(
      canvasRef.current, 
      {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({ initialCanvas: canvas, initialContainer: containerRef.current! });
  }, [init]);

  // sif init change hua to hi re render.. and usecallback mtlb no rendering bcz init is cached over there
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 h-[calc(100%-124px)] bg-muted" ref={containerRef}>
        <canvas ref={canvasRef}  />
      </div>
    
    </div>
  );
  
};
