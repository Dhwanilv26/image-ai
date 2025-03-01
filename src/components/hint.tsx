import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"

export interface HintProps{
    label:string;
    children:React.ReactNode;
    side?:"top" | "bottom" | "left" | "right";
    align?:'start'|'center'|'end';
    sideOffset?:number;
    alignOffset?:number;
}

export const Hint=(
    {
     label,children,side,sideOffset,alignOffset   
    }:HintProps
)=>{
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
            {children}

                </TooltipTrigger>
                <TooltipContent
                className="text-white bg-slate-800 border-slate-800"
                side={side}
                sideOffset={sideOffset}
                alignOffset={alignOffset}>
                    <p className="fpnt-semibold capitalize">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}