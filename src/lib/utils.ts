/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { clsx, type ClassValue } from 'clsx';
import type { RGBColor } from 'react-color';
import { twMerge } from 'tailwind-merge';
import { fabric } from 'fabric';

import { uuid } from 'uuidv4';

// recursive function to transform the text type
export function transformText(objects: any) {
  if (!objects) return;

  objects.forEach((item: any) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === 'text' && (item.type === 'textbox');
    }
  });
}

export function downloadFile(file: string, type: string) {
  const anchorElement = document.createElement('a');

  anchorElement.href = file;
  anchorElement.download = `${uuid()}.${type}`;

  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
}

export function rgbaObjectToString(rgba: RGBColor | 'transparent') {
  if (rgba === 'transparent') {
    return 'rgba(0,0,0,0)';
  }

  const alpha = rgba.a === undefined ? 1 : rgba.a;

  return `rgba(${rgba.r},${rgba.g},${rgba.b},${alpha})`;
}

export const createFilter = (value: string) => {
  let effect;

  switch (value) {
    case 'Greyscale':
      effect = new fabric.Image.filters.Grayscale();
      break;
    case 'Polaroid':
      // @ts-ignore
      effect = new fabric.Image.filters.Polaroid();
      break;
    case 'Sepia':
      effect = new fabric.Image.filters.Sepia();
      break;
    case 'Kodachrome':
      // @ts-ignore
      effect = new fabric.Image.filters.Kodachrome();
      break;
    case 'Contrast':
      effect = new fabric.Image.filters.Contrast({ contrast: 0.3 });
      break;
    case 'Brightness':
      effect = new fabric.Image.filters.Brightness({ brightness: 0.8 });
      break;
    case 'Brownie':
      // @ts-ignore
      effect = new fabric.Image.filters.Brownie();
      break;
    case 'Vintage':
      // @ts-ignore
      effect = new fabric.Image.filters.Vintage();
      break;
    case 'Technicolor':
      // @ts-ignore
      effect = new fabric.Image.filters.Technicolor();
      break;
    case 'Pixelate':
      effect = new fabric.Image.filters.Pixelate();
      break;
    case 'Invert':
      effect = new fabric.Image.filters.Invert();
      break;
    case 'Blur':
      effect = new fabric.Image.filters.Blur();
      break;
    case 'Sharpen':
      effect = new fabric.Image.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });
      break;
    case 'Emboss':
      effect = new fabric.Image.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });
      break;
    case 'Removecolor':
      // @ts-ignore
      effect = new fabric.Image.filters.RemoveColor({
        threshold: 0.2,
        distance: 0.5,
      });
      break;
    case 'Blacknwhite':
      // @ts-ignore
      effect = new fabric.Image.filters.BlackWhite();
      break;
    case 'Vibrance':
      // @ts-ignore
      effect = new fabric.Image.filters.Vibrance({
        vibrance: 1,
      });
      break;
    case 'Blendcolor':
      effect = new fabric.Image.filters.BlendColor({
        color: '#00ff00',
        mode: 'multiply',
      });
      break;
    case 'Huerotate':
      effect = new fabric.Image.filters.HueRotation({
        rotation: 0.5,
      });
      break;
    case 'Resize':
      effect = new fabric.Image.filters.Resize();
      break;
    case 'Gamma':
      // @ts-ignore
      effect = new fabric.Image.filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });
    case 'Saturation':
      effect = new fabric.Image.filters.Saturation({
        saturation: 0.7,
      });
      break;
    default:
      effect = null;
      return;
  }

  return effect;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
