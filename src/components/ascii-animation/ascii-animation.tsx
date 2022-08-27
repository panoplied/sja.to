import { useState, useEffect } from 'react';

function ASCIIAnimation({ frames, rate }: { frames: Array<JSX.Element>, rate: number }) {

  const animationLength = frames.length - 1;

  const [currentFrameNum, setCurrentFrameNum] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentFrameNum < animationLength) {
        setCurrentFrameNum(currentFrameNum + 1);
      } else {
        setCurrentFrameNum(0);
      }
    }, rate);
    return () => clearInterval(timer);
  });

  return(
    <>
      {frames[currentFrameNum]}
    </>
  );
}

export default ASCIIAnimation;