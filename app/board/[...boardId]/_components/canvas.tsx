"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import {Camera, CanvasMode, CanvasState, Color, EllipseLayer, LayerType, NoteLayer, PathLayer, Point, ReactangleLayer, TextLayer,Layer} from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useStorage } from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import { connectionIdToColor, pointerEventToCanvasPoint } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { set } from "date-fns";
import { SelectionBox } from "./selection-box";
// import { headers } from "next/headers";

const MAX_LAYERS = 100;

interface CanvasProps{
  boardId:string;
}


export const Canvas = ({
  boardId
}:CanvasProps) => { 
  const layerIds = useStorage((root)=>root.layerIds);

  const [canvasState,setCanvasState] = useState<CanvasState>({mode:CanvasMode.None});

  const [camera,setCamera] = useState<Camera>({x:0,y:0});

  const [lastUsedColor,setLastUsedColor] = useState<Color>({
    r:0,
    g:0,
    b:0
  });

  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const history = useHistory();

  const insertLayer = useMutation((
    {storage,setMyPresence},
    layerType:LayerType.Ellipse | LayerType.Reactangle | LayerType.Text | LayerType.Path,
    position: Point
  )=>{
    const liveLayers = storage.get("layers");
    if(liveLayers.size>=MAX_LAYERS){
      return;
    }

    const liveLayersIds = storage.get("layerIds");
    const layerId=nanoid();

    let newlayer =  new LiveObject({
      type: layerType,
      x: position.x,
      y: position.y,
      height: 100,
      width: 100,
      fill: lastUsedColor,
    });

    //console.log({newlayer});
  
    liveLayersIds.push(layerId);
    liveLayers.set(layerId, newlayer!);

    setMyPresence({selection:[layerId]},{addToHistory:true});
    setCanvasState({mode:CanvasMode.None});

  },[lastUsedColor]);

  const onWheel = useCallback((e: React.WheelEvent)=>{
    setCamera((camera)=>({
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

  const onPointerUp = useMutation((
    {},
    e
  )=>{
    const points = pointerEventToCanvasPoint(e,camera);

    console.log({points,mode:canvasState.mode});
    if(canvasState.mode === CanvasMode.Inserting && canvasState.layerType !== LayerType.Note){
      insertLayer(canvasState.layerType, points);
    }else{
      setCanvasState({
        mode:CanvasMode.None,
      });
    }

    history.resume();
  },[canvasState,camera,history,insertLayer]);

  const selections = useOthersMapped((other)=>other.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdToColor: Record<string, string> = {};

    layerIds.forEach((layerId,connectionId) => {
      layerIdToColor[layerId] = connectionIdToColor(connectionId);
    });

    return layerIdToColor;
  },[selections]);

  const onLayerPointerDown = useMutation((
    {self,setMyPresence},
    e:React.PointerEvent,
    layerId:string
  )=>{
    if(
      canvasState.mode === CanvasMode.Pencil ||
      canvasState.mode === CanvasMode.Inserting
    ){
      return;
    }

    history.pause();
    e.stopPropagation();

    const point = pointerEventToCanvasPoint(e,camera);

    if(!self.presence.selection.includes(layerId)){
      setMyPresence({selection:[layerId]},{addToHistory:true});  
    }

    setCanvasState({
      mode:CanvasMode.Translating,
      current:point,
    });
  },[setCanvasState,canvasState.mode,camera,history]);

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
        onPointerUp={onPointerUp}
      >
        <g 
          style={{
            transform:`translate(${camera.x}px, ${camera.y}px) `
          }}
        >
          {layerIds.map((layerId)=>(
            <LayerPreview 
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox
            onResizeHandlePointerDown={()=>{}}
          />
          <CursorPresence />
        </g>
      </svg>
    </main>
  )
};