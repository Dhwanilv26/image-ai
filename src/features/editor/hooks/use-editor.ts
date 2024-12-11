/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// creating a hook to use the editor
// usecallback caches the interactions allowing less re rendering
import { fabric } from 'fabric';
import { useCallback, useState, useMemo } from 'react';
import { useAutoResize } from './use-auto-resize';
import {
  BuildEditorProps,
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  Editor,
  EditorHookProps,
  FILL_COLOR,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TRIANGLE_OPTIONS,
} from '../types';
import { useCanvasEvents } from './use-canvas-events';
import { isTextType } from '../utils';

const buildEditor = ({
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  strokeDashArray,
  setStrokeDashArray,
}: BuildEditorProps): Editor => {
  const getWorkSpace = () => {
    return canvas.getObjects().find((object) => object.name === 'clip');
  };
  const center = (object: fabric.Object) => {
    const workspace = getWorkSpace();

    const center = workspace?.getCenterPoint();

    if (!center) return;

    // @ts-ignore
    canvas._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };
  return {
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 1;
      }

      const value = selectedObject.get('opacity') || 1;

      return value;
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });

      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();

      const workspace = getWorkSpace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });

      canvas.renderAll();

      const workspace = getWorkSpace();
      workspace?.sendToBack();
    },

    changeFillColor: (value: string) => {
      setFillColor(value); // this is in the useState

      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });

      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);

      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fill: value });
          // no strokes for text
          return;
        }
        object.set({ stroke: value });
      });

      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);

      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });

      canvas.renderAll();
    },

    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);

      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });

      canvas.renderAll();
    },

    // spreading allows dynamic updates here
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      // to reduce undo and redo history states.. the roder matters
      addToCanvas(object);
    },

    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        rx: 50,
        ry: 50,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },

    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashArray,
      });
      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = 400;
      const WIDTH = 400;

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        },
      );
      addToCanvas(object);
    },

    addDiamond: () => {
      const HEIGHT = 400;
      const WIDTH = 400;

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashArray,
        },
      );
      addToCanvas(object);
    },
    canvas,
    getActiveFillColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return fillColor; // return the latest fill color
      }
      const value = selectedObject.get('fill') || fillColor;

      // currently gradients and patterns arent supported
      return value as string;
    },

    getActiveStrokeColor: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeColor; // return the latest fill color
      }
      const value = selectedObject.get('stroke') || STROKE_COLOR;

      // currently gradients and patterns arent supported
      return value;
    },

    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeWidth; // return the latest fill color
      }
      const value = selectedObject.get('strokeWidth') || strokeWidth;

      // currently gradients and patterns arent supported
      return value;
    },

    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeDashArray; // return the latest fill color
      }
      const value = selectedObject.get('strokeDashArray') || strokeDashArray;

      // currently gradients and patterns arent supported
      return value;
    },

    selectedObjects,
  };
};

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  // selectedobjects is not needed
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });
  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        strokeDashArray,
        setStrokeDashArray,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObjects,
      });
    }

    return undefined;
  }, [
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
    strokeDashArray,
  ]);

  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      fabric.Object.prototype.set({
        cornerColor: '#FFF',
        cornerStyle: 'circle',
        borderColor: '#3b82f6',
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: '#3b83f6',
      });
      const initialWorkSpace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: 'clip',
        fill: 'white',
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.8)',
          blur: 5,
        }),
      });

      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkSpace);
      initialCanvas.centerObject(initialWorkSpace);

      // other elements outside the workspace wont be visible
      initialCanvas.clipPath = initialWorkSpace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },

    [],
  );

  return { init, editor };
};
