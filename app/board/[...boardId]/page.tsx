import { Canvas } from "./_components/canvas";
import { Room } from "@/components/room";
import { Loading } from "./_components/canvas-loading";

interface BoardIdPageProps {
  params: {
    boardId:string[];
  };
};

const BoardIdPage = ({params}:BoardIdPageProps) => {

  return(
    <Room roomId={params.boardId[0]} fallback={<Loading/>}>
      <Canvas boardId={params.boardId[0]}/>
    </Room>
  )
}

export default BoardIdPage;