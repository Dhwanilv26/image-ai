/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActiveTool } from '../types';
import { cn } from '@/lib/utils';
import { ToolSidebarHeader } from './tool-sidebar-header';
import { ToolSidebarClose } from './tool-sidebar-close';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Editor } from '../types';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useGenerateImage } from '@/features/ai/api/use-generate-image';

import { usePayawall } from '@/features/subscriptions/hooks/use-paywall';
interface AiSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const AiSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: AiSidebarProps) => {
  const mutation = useGenerateImage();

  const {shouldBlock,triggerPaywall}=usePayawall();

  const [value, setValue] = useState('');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(shouldBlock){
      triggerPaywall();
      return;
    }

    mutation
      .mutateAsync({ prompt: value })
      .then((result) => {
        if ('image' in result) {
          editor?.addImage(result.image);
        } else if ('error' in result) {
          console.error('Error:', result.error);
        }
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });

      setValue('');
  };

  const onClose = () => {
    onChangeActiveTool('select');
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col ',
        activeTool === 'ai' ? 'visible' : 'hidden',
      )}
    >
      <ToolSidebarHeader title="AI" description="Generate an image using AI" />

      <ScrollArea>
        <form onSubmit={onSubmit} className="p-4 space-y-6">
          <Textarea
            disabled={mutation.isPending}
            value={value}
            placeholder="An astronaut riding a horse on mars,hd, dramatic lighting"
            cols={30}
            rows={10}
            required
            minLength={3}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={mutation.isPending}
            type="submit"
            className="w-full"
          >
            Generate
          </Button>
        </form>
      </ScrollArea>

      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
