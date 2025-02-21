"use client";

import { useOthersConnectionIds } from "@liveblocks/react/suspense";
import { connect } from "http2";
import { memo } from "react";
import { Cursor } from "./cursor";
const Cursors = () => {
  const ids = useOthersConnectionIds();
  return (
    <>
      {ids.map((connectionId) => (
        <Cursor
          key={connectionId}
          connectionId={connectionId}
        />
      ))}
    </>
  )
}

export const CursorPresence = memo(() => {
  return (
    <>
      <Cursors/>
    </>
  )
});

CursorPresence.displayName = "CursorPresence";