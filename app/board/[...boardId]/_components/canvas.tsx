"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import {Camera, CanvasMode, CanvasState, Color, EllipseLayer, LayerType, NoteLayer, PathLayer, Point, ReactangleLayer, TextLayer,Layer, Side, XYWH} from "@/types/canvas";
import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useStorage } from "@liveblocks/react/suspense";
import { CursorPresence } from "./cursor-presence";
import { connectionIdToColor, findIntersectingLayerWithRectangle, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { set } from "date-fns";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
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
    layerType:LayerType.Ellipse | LayerType.Reactangle | LayerType.Text | LayerType.Path |LayerType.Note,
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

  const translateSelectedLayer = useMutation((
    {storage,self},
    point:Point
  )=>{
    if(canvasState.mode !== CanvasMode.Translating){
      return ;
    }
    const offset={
      x:point.x - canvasState.current.x,
      y:point.y - canvasState.current.y
    }

    const liveLayers = storage.get("layers");
    
    for(const id of self.presence.selection){
      const layer = liveLayers.get(id);
      if(layer){
        layer.update({
          x:layer.get("x") + offset.x,
          y:layer.get("y") + offset.y
        });
      }
    }

    setCanvasState({mode:CanvasMode.Translating,current:point});
  },[canvasState]);

  const unSelectLayer = useMutation((
    {setMyPresence,self}
  )=>{

    if(self.presence.selection.length>0){
      setMyPresence({selection:[]},{addToHistory:true});
    }

  },[]);

  const updateSelectionNet = useMutation((
    { storage,setMyPresence },
    current:Point,
    origin:Point
  )=>{
    const layers = storage.get("layers");
    setCanvasState({
      mode:CanvasMode.SelectionNet,
      origin,
      current
    });

    const ids = findIntersectingLayerWithRectangle(
      layerIds,
      new Map(
        Array.from(layers.entries()).map(([key, liveObject]) => [key, liveObject.toObject()])
      ),
      origin,
      current
    );

    console.log("SELECTION NET IDS",{ids});

    setMyPresence({selection:ids});
  },[layerIds]);

  const startMultiSelection = useCallback((
    current:Point,
    origin:Point
  )=>{
    if(
      Math.abs(current.x-origin.x) + Math.abs(current.y-origin.y) > 5
    ){
      console.log("ATTEMPTING TO SELECTION NET");
      setCanvasState({
        mode:CanvasMode.SelectionNet,
        origin,
        current
      });
    }
  },[])

  const resizeSelectedLayer = useMutation((
    {storage,self},
    point:Point,
  )=>{
    if(canvasState.mode !== CanvasMode.Resizing){
      return ;
    }

    const bounds=resizeBounds(canvasState.initialBounds,canvasState.corner,point);

    const liveLayers = storage.get("layers");
    const layer = liveLayers.get(self.presence.selection[0]);

    if(layer){
      layer.update(bounds);
    };
  },[canvasState]);

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
    if(canvasState.mode==CanvasMode.Pressing){
      startMultiSelection(current,canvasState.origin);
    }else if(canvasState.mode==CanvasMode.SelectionNet){
      updateSelectionNet(current,canvasState.origin);
    }else if(canvasState.mode === CanvasMode.Translating){
      console.log("Translating"); 
      translateSelectedLayer(current);
    }else if(canvasState.mode === CanvasMode.Resizing){
      //console.log("Resizing");
      resizeSelectedLayer(current);
    }
    setMyPresence({cursor:current});
  },[canvasState,resizeSelectedLayer,camera]);

  const onPointerLeave=useMutation((
    {setMyPresence}
  )=>{
    setMyPresence({cursor:null})
  },[]);

  const onPointerDown = useCallback((e:React.PointerEvent)=>{
    e.preventDefault();
    const current = pointerEventToCanvasPoint(e,camera);

    if(canvasState.mode === CanvasMode.Inserting){
      return;
    }

    setCanvasState({
      mode:CanvasMode.Pressing,
      origin:current
    });

  },[camera,canvasState.mode,setCanvasState]);

  const onPointerUp = useMutation((
    {},
    e
  )=>{
    const points = pointerEventToCanvasPoint(e,camera);

    console.log({points,mode:canvasState.mode});
    if(
      canvasState.mode === CanvasMode.None ||
      canvasState.mode === CanvasMode.Pressing 
    ){
      unSelectLayer();
      setCanvasState({
        mode:CanvasMode.None,
      });
    }else if(canvasState.mode === CanvasMode.Inserting ){
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

  const onResizeHandlePointerDown = useCallback((corner:Side,initialBounds:XYWH)=>{
    history.pause();
    setCanvasState({
      mode:CanvasMode.Resizing,
      corner,
      initialBounds
    })

  },[history]);
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
      <SelectionTools 
        camera={camera}
        setLastUsedColor={setLastUsedColor}
      />
      <svg
        className="h-[100vh] w-[100vw] "
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
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
          {canvasState.mode===CanvasMode.SelectionNet && canvasState.current != null && (
            <rect
              className="fill-blue-500/5 stroke-blue-500 stroke-1"
              x={Math.min(canvasState.current.x,canvasState.origin.x)}
              y={Math.min(canvasState.current.y,canvasState.origin.y)}
              width={Math.abs(canvasState.current.x-canvasState.origin.x)}
              height={Math.abs(canvasState.current.y-canvasState.origin.y)}
            /> 
          )}
          <SelectionBox
            onResizeHandlePointerDown={onResizeHandlePointerDown}
          />
          <CursorPresence />
        </g>
      </svg>
    </main>
  )
};