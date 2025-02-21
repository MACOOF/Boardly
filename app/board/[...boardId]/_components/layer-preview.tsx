"use client";

import { LayerType } from "@/types/canvas";
import { useStorage } from "@liveblocks/react/suspense";
import React, { memo } from "react";
import { Rectangle } from "./rectangle";
interface LayerPreviewProps {
  id:string;
  onLayerPointerDown:(e:React.PointerEvent,layerId:string)=> void;
  selectionColor?:string;
}

export const LayerPreview = memo(({
  id,
  onLayerPointerDown,
  selectionColor
}:LayerPreviewProps) => {
  const layer = useStorage((root)=>root.layers.get(id));

  if(!layer) return null;

  console.log({layer},"LayerPreview");
  
  switch(layer.type){
    case LayerType.Reactangle:
      return (
          <Rectangle
            id={id}
            onLayerPointerDown={onLayerPointerDown}
            layer={layer}
            selectionColor={selectionColor}
          />
      );
    default:
      console.warn("Unknown layer type",layer.type);
      return null;
  }
});

LayerPreview.displayName = "LayerPreview";