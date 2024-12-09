'use client';

import { useEditor } from '../hooks/use-editor';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { Toolbar } from './toolbar';
import { Footer } from './footer';
import { ActiveTool } from '../types';
import { ShapeSidebar } from './shape-sidebar';
export const Editor = () => {
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');

  const onChangeActiveTool = useCallback((tool: ActiveTool) => {
    if (tool === activeTool) {
      return setActiveTool('select');
    }

    if(tool==='draw'){
      // todo : enable draw mode
    }

    if(activeTool==='draw'){
      // todo : disable draw mode
    }

    setActiveTool(tool);
  }, [activeTool]);

  const { init } = useEditor();

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({ initialCanvas: canvas, initialContainer: containerRef.current! });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  // sif init change hua to hi re render.. and usecallback mtlb no rendering bcz init is cached over there
  return (
    <div className="h-full flex flex-col ">
      <Navbar
       activeTool={activeTool}
       onChangeActiveTool={onChangeActiveTool} />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        {/* using this div to prevent overflow and constant flickering issues */}

        <Sidebar
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool} />

        <ShapeSidebar
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
        />

        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar />
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted "
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};
