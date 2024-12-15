/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActiveTool } from '../types';
import { cn } from '@/lib/utils';
import { ToolSidebarHeader } from './tool-sidebar-header';
import { ToolSidebarClose } from './tool-sidebar-close';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from './color-picker';
import { Editor } from '../types';
import { useEffect, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SettingsSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const SettingsSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: SettingsSidebarProps) => {
  const workSpace = editor?.getWorkSpace();

  const initialWidth = useMemo(() => `${workSpace?.width ?? 0}`, [workSpace]);
  const initialHeight = useMemo(() => `${workSpace?.height ?? 0}`, [workSpace]);
  const initialBackground = useMemo(
    () => workSpace?.fill ?? '#ffffff',
    [workSpace],
  );

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  const [background, setBackground] = useState(initialBackground);

  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
    setBackground(initialBackground);
  }, [initialBackground, initialHeight, initialWidth]);

  const onClose = () => {
    onChangeActiveTool('select');
  };

  const changeWidth = (value: string) => setWidth(value);
  const changeHeight = (value: string) => setHeight(value);

  const changeBackground = (value: string) => {
    setBackground(value);
    editor?.changeBackground(value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editor?.changeSize({
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });
  };

  // Render only if activeTool is 'settings'
  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
        activeTool === 'settings' ? 'visible' : 'hidden',
      )}
    >
      <ToolSidebarHeader
        title="Settings"
        description="Change the look of your workspace"
      />

      <ScrollArea>
        <form className="space-y-4 p-2" onSubmit={onSubmit}>
          <div className="space-y-4">
            <Label>Height</Label>
            <Input
              placeholder="Height"
              value={height}
              type="number"
              onChange={(e) => changeHeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Width</Label>
            <Input
              placeholder="Width"
              value={width}
              type="number"
              onChange={(e) => changeWidth(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Resize
          </Button>
        </form>
      </ScrollArea>

      <div className="p-6">
        <ColorPicker value={background as string} onChange={changeBackground}
         />
      </div>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
