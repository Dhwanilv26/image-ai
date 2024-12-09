import { ActiveTool } from "../types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "./tool-sidebar-header";
interface ShapeSidebarProps{
    activeTool:ActiveTool;
    onChangeActiveTool:(tool:ActiveTool)=>void;
}

export const ShapeSidebar=({activeTool,onChangeActiveTool}:ShapeSidebarProps)=>{
// yaha par class hi aisa banaya hai dynamic ki click hone par hi dikhega.. bcz click hone par hi activetool shapes hoga so
    return (
       <aside
    className={cn('bg-white relative border-r z-[40] w-[360px] h-full flex flex-col ',
    activeTool==='shapes' ? 'visible' :'hidden',)}
    
    >
        <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your canvas"/>
    </aside>
    )
}