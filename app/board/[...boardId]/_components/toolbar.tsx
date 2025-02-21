import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, Type, Undo2 } from "lucide-react"
import { ToolButton } from "./tool-button"
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";


interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState:(newState:CanvasState) => void;
  undo:()=>void;
  redo:()=>void
  canUndo:boolean;
  canRedo:boolean;
};

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canRedo,
  canUndo
}:ToolbarProps) => {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-2 flex
    flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col 
      items-center shadow-md">
        <ToolButton
          lable="Select"
          icon={MousePointer2}
          onClick={()=>setCanvasState({mode:CanvasMode.None,})}
          isActive={
            canvasState.mode === CanvasMode.None || 
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.Resizing ||
            canvasState.mode === CanvasMode.Pressing
          }
        />
         <ToolButton
          lable="Text"
          icon={Type}
          onClick={()=>setCanvasState({
            mode:CanvasMode.Inserting,
            layerType:LayerType.Text
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting && 
            canvasState.layerType === LayerType.Text
          }
        />
         <ToolButton
          lable="Sticky note"
          icon={StickyNote}
          onClick={()=>setCanvasState({
            mode:CanvasMode.Inserting,
            layerType:LayerType.Note
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting && 
            canvasState.layerType === LayerType.Note
          }
        />
         <ToolButton
          lable="Rectangle"
          icon={Square}
          onClick={()=>setCanvasState({
            mode:CanvasMode.Inserting,
            layerType:LayerType.Reactangle
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting && 
            canvasState.layerType === LayerType.Reactangle
          }
        />
         <ToolButton
          lable="Ellipse"
          icon={Circle}
          onClick={()=>setCanvasState({
            mode:CanvasMode.Inserting,
            layerType:LayerType.Ellipse
          })}
          isActive={
            canvasState.mode === CanvasMode.Inserting && 
            canvasState.layerType === LayerType.Ellipse
          }
        />
        <ToolButton
          lable="Pen"
          icon={Pencil}
          onClick={()=>setCanvasState({
            mode:CanvasMode.Pencil,
          })}
          isActive={
            canvasState.mode === CanvasMode.Pencil
          }
        />
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col
      items-center shadow-md">
        <ToolButton
          lable="Undo"
          icon={Undo2}
          onClick={()=>{}}
          isActive={false}
          isDisabled={!canUndo}
        />
        <ToolButton
          lable="Redo"
          icon={Redo2}
          onClick={()=>{}}
          isActive={false}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  )
}

export const ToolbarSkeleton =()=>{
  return(
    <div className="absolute top-1/2 -translate-y-1/2 left-2 flex
    flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md"/>
  )
}