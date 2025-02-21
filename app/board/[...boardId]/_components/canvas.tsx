"use client";

import React, { useCallback, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import {Camera, CanvasMode, CanvasState} from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation } from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import { pointerEventToCanvasPoint } from "@/lib/utils";


interface CanvasProps{
  boardId:string;
}


export const Canvas = ({
  boardId
}:CanvasProps) => { 
  const [canvasState,setCanvasState] = useState<CanvasState>({mode:CanvasMode.None});

  const [camera,setcamera] = useState<Camera>({x:0,y:0});

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const history = useHistory();

  const onWheel = useCallback((e: React.WheelEvent)=>{
    setcamera((camera)=>({
      x:camera.x - e.deltaX,
      y:camera.y - e.deltaY,
    }))
  },[]);

  const onPointerMove = useMutation((
    {setMyPresence},
    e:React.PointerEvent
  )=>{
    e.preventDefault();
    const current = pointerEventToCanvasPoint(e,camera);

    // console.log({current});
    setMyPresence({cursor:current});
  },[]);

  const onPointerLeave=useMutation((
    {setMyPresence}
  )=>{
    setMyPresence({cursor:null})
  },[]);

  return (
    <main className="h-screen w-screen relative bg-neutral-100 touch-none">
      <Info boardId={boardId}/>
      <Participants />
      <Toolbar 
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <svg
        className="h-[100vh] w-[100vw] "
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <g>
          <CursorPresence />
        </g>
      </svg>
    </main>
  )
}