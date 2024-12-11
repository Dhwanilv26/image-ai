/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActiveTool, Editor, FONT_WEIGHT } from '../types';
import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { BsBorderWidth } from 'react-icons/bs';
import { RxTransparencyGrid } from 'react-icons/rx';
import { isTextType } from '../utils';
import { FaBold } from 'react-icons/fa6';

import { useState } from 'react';
interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {


  const fillColor = editor?.getActiveFillColor();
  const strokeColor = editor?.getActiveStrokeColor();

  const selectedObject = editor?.selectedObjects[0];
  const selectedObjectType = editor?.selectedObjects[0]?.type;

  const fontFamily = editor?.getActiveFontFamily();

  const isText = isTextType(selectedObjectType);

  const initialFontWeight = editor?.getActiveFontWeight() || FONT_WEIGHT;

  const [properties,setProperties]=useState({
    fontWeight:initialFontWeight
  })

  const toggleBold = () => {
    const selectedObject = editor?.selectedObjects[0];

    if (!selectedObject) {
      return;
    }

    const newValue = properties.fontWeight > 500 ? 500 : 700;

    editor?.changeFontWeight(newValue);
    setProperties((current)=>({
      ...current,
      fontWeight:newValue
    }))
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      <div className="flex items-center h-full justify-center">
        <Hint label="Color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool('fill')}
            size="icon"
            variant="ghost"
            className={cn(activeTool === 'fill' && 'bg-gray-100')}
          >
            <div
              className="rounded-sm size-4 border "
              style={{
                backgroundColor: fillColor,
              }}
            ></div>
          </Button>
        </Hint>
      </div>

      <div className="flex items-center h-full justify-center">
        <Hint label="Border color" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool('stroke-color')}
            size="icon"
            variant="ghost"
            className={cn(activeTool === 'stroke-color' && 'bg-gray-100')}
          >
            <div
              className="rounded-sm size-4 border-2 bg-white "
              style={{
                borderColor: strokeColor,
              }}
            ></div>
          </Button>
        </Hint>
      </div>

      {!isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Border width" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool('stroke-width')}
              size="icon"
              variant="ghost"
              className={cn(activeTool === 'stroke-width' && 'bg-gray-100')}
            >
              <BsBorderWidth className="size-4" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Font" side="bottom" sideOffset={5}>
            <Button
              onClick={() => onChangeActiveTool('font')}
              size="icon"
              variant="ghost"
              className={cn(
                'w-auto px-2 text-sm',
                activeTool === 'font' && 'bg-gray-100',
              )}
            >
              <div className="max-w-[100px] truncate">{fontFamily}</div>
              <ChevronDown className="size-4 ml-2 shrink-0" />
            </Button>
          </Hint>
        </div>
      )}

      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Bold" side="bottom" sideOffset={5}>
            <Button
              onClick={() => toggleBold()}
              size="icon"
              variant="ghost"
              className={cn(properties.fontWeight > 500 && 'bg-gray-100')}
            >
              <FaBold />
            </Button>
          </Hint>
        </div>
      )}
      <div className="flex items-center h-full justify-center">
        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className="flex items-center h-full justify-center">
        <Hint label="Send backwards" side="bottom" sideOffset={5}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>

      <div className="flex items-center h-full justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            onClick={() => onChangeActiveTool('opacity')}
            size="icon"
            variant="ghost"
            className={cn(activeTool === 'opacity' && 'bg-gray-100')}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

// will contain specific options once selected according to the shape of the container
