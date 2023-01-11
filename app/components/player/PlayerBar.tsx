import { Box, useColorModeValue } from '@chakra-ui/react';
import type { Playback, Track } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { useDataRefresh } from 'remix-utils';

const PlayerBar = ({ playback }: { playback: Playback & { track: Track } }) => {
  const color = useColorModeValue('music.900', 'music.50');
  const { refresh } = useDataRefresh();
  const [shouldRefresh, setToRefresh] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (shouldRefresh) {
      refresh();
    }
  }, [shouldRefresh, refresh]);

  const progress = playback.progress ?? 0;
  const duration = playback.track?.duration ?? 0;

  useEffect(() => {
    const step = (timestamp: number) => {
      if (!boxRef.current) return;

      const current = progress + timestamp; // add time elapsed to always get current progress
      const percentage = (current / duration) * 100;

      if (percentage <= 100) {
        boxRef.current.style.width = `${percentage}%`;
      }

      if (percentage >= 101) {
        // 100 fetches too early?
        setToRefresh(true);
      } else {
        requestRef.current = requestAnimationFrame(step);
      }
    };

    requestRef.current && cancelAnimationFrame(requestRef.current); // reset timestamp for new track
    requestRef.current = requestAnimationFrame(step);

    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
    };
  }, [playback, duration, progress]);

  const initial = `${(progress / duration) * 100}%`;

  return <Box ref={boxRef} h="2px" background={color} width={initial} />;
};

export default PlayerBar;
