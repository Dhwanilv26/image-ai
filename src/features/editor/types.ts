import { fabric } from 'fabric';
import { ITextboxOptions } from 'fabric/fabric-impl';

import * as material from 'material-colors';

export const fonts = [
  'Arial',
  'Arial Black',
  'Verdana',
  'Helvitica',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Georgia',
  'Garamond',
  'Courier New',
  'Brush Script MT',
  'Palatino',
  'Bookman',
  'Comic Sans MS',
  'Impact',
  'Lucida Sans Unicode',
  'Geneva',
  'Lucida Console',
];

export const selectionDependentTools = [
  'fill',
  'font',
  'filter',
  'opacity',
  'remove-bg',
  'stroke-color',
  'stroke-width',
];

export const colors = [
  material.red['500'],
  material.pink['500'],
  material.purple['500'],
  material.deepPurple['500'],
  material.indigo['500'],
  material.lightBlue['500'],
  material.cyan['500'],
  material.teal['500'],
  material.green['500'],
  material.lightGreen['500'],
  material.lime['500'],
  material.yellow['500'],
  material.amber['500'],
  material.orange['500'],
  material.deepOrange['500'],
  material.brown['500'],
  material.blueGrey['500'],
  'transparent',
];
export type ActiveTool =
  | 'select'
  | 'shapes'
  | 'text'
  | 'images'
  | 'draw'
  | 'fill'
  | 'stroke-color'
  | 'stroke-width'
  | 'font'
  | 'opacity'
  | 'filter'
  | 'settings'
  | 'ai'
  | 'remove-bg'
  | 'templates';

export interface EditorHookProps {
  clearSelectionCallback?: () => void;
}

export type BuildEditorProps = {
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectedObjects: fabric.Object[];
  strokeDashArray: number[];
  setStrokeDashArray: (value: number[]) => void;
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  setStrokeWidth: (value: number) => void;
  fontFamily: string;
  setFontFamily: (value: string) => void;
};

// ensuring proper type and name safety

// these are the getter and setter methods used in the editor for different properties implemented
export interface Editor {
  getActiveTextAlign: () => string;
  changeTextAlign: (value: string) => void;
  changeFontUnderline: (value: boolean) => void;
  getActiveFontUnderline: () => boolean;
  changeFontLinethrough: (value: boolean) => void;
  getActiveFontLinethrough: () => boolean;
  changeFontStyle: (value: string) => void;
  getActiveFontStyle: () => string;
  changeFontWeight: (value: number) => void;
  getActiveFontWeight: () => number;
  getActiveFontFamily: () => string;
  changeFontFamily: (value: string) => void;
  addText: (value: string, options?: ITextboxOptions) => void;
  getActiveOpacity: () => number;
  changeOpacity: (value: number) => void;
  canvas: fabric.Canvas;
  bringForward: () => void;
  sendBackwards: () => void;
  getActiveFillColor: () => string;
  getActiveStrokeColor: () => string;
  getActiveStrokeWidth: () => number;
  getActiveStrokeDashArray: () => number[];
  selectedObjects: fabric.Object[];
  changeFillColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  changeStrokeColor: (value: string) => void;
  changeStrokeDashArray: (value: number[]) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
}

export const FILL_COLOR = 'rgba(0,0,0,1)';
export const STROKE_COLOR = 'rgba(0,0,0,1)';
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = [];
export const FONT_FAMILY = 'Arial';
export const FONT_SIZE = 32;
export const FONT_WEIGHT = 400;

export const TEXT_OPTIONS = {
  type: 'textbox',
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  fontSize: FONT_SIZE,
  fontFamily: FONT_FAMILY,
  fontWeight: FONT_WEIGHT,
};

export const CIRCLE_OPTIONS = {
  radius: 225,
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
};

export const RECTANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const TRIANGLE_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};

export const DIAMOND_OPTIONS = {
  left: 100,
  top: 100,
  fill: FILL_COLOR,
  stroke: STROKE_COLOR,
  strokeWidth: STROKE_WIDTH,
  width: 400,
  height: 400,
  angle: 0,
};
