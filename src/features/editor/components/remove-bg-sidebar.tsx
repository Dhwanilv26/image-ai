/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ActiveTool } from '../types';
import { cn } from '@/lib/utils';
import { ToolSidebarHeader } from './tool-sidebar-header';
import { ToolSidebarClose } from './tool-sidebar-close';
import { Editor } from '../types';

import { useRemoveBackground } from '@/features/ai/api/use-remove-bg';
import UnavailableService from './unavailable-service';  // Import the new component

interface RemoveBgSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const RemoveBgSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: RemoveBgSidebarProps) => {
  // const selectedObject = editor?.selectedObjects[0];
  const mutation = useRemoveBackground();
  
  // @ts-ignore
  // const imageSrc = selectedObject?._originalElement?.currentSrc;

  // const onClick = () => {
  //   // Simulate background removal action or trigger API call
  //   // todo : block with paywall
  //   mutation.mutate(
  //     {
  //       image: imageSrc,
  //     },
  //     {
  //       onSuccess: (response: any) => {
  //         if ('image' in response) {
  //           editor?.addImage(response.image);
  //         } else {
  //           console.error('Error: ', response.error);
  //         }
  //       },
  //       onError: (error) => {
  //         console.error('Mutation failed: ', error.message);
  //       },
  //     },
  //   );
  // };

  const onClose = () => {
    onChangeActiveTool('select');
  };

  const onRetry = () => {
    // Add retry logic here, for example, re-triggering the background removal API call
    mutation.reset(); // Reset the mutation state
  };

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col ',
        activeTool === 'remove-bg' ? 'visible' : 'hidden',
      )}
    >
      <ToolSidebarHeader
        title="Background Removal"
        description="Remove background from image using AI"
      />

      {/* Unavailable Service Message Displayed when Sidebar Opens */}
      <UnavailableService
        title="Service Unavailable"
        message="Background removal is temporarily unavailable. We're working on it and will be back soon."
        onRetry={onRetry}
      />

      
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
