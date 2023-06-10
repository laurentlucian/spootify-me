import { Box, Stack } from '@chakra-ui/react';

import SearchInput from '~/components/search/SearchInput';

import FullscreenFadeLayout from '../shared/FullscreenFadeLayout';
import FullscreenQueueTracks from './FullscreenQueueTracks';

const FullscreenQueue = (props: { userId: string }) => {
  return (
    <FullscreenFadeLayout>
      <Stack w="100%" align="center" id="dont-close">
        <SearchInput
          flexShrink={0}
          param="fullscreen"
          w={['100%']}
          maxW={['unset', '800px']}
          mt={['2px', '10px', '50px']}
          autoFocus
        />
        <Box overflowX="hidden" w="100%">
          <FullscreenQueueTracks userId={props.userId} />
        </Box>
      </Stack>
    </FullscreenFadeLayout>
  );
};

export default FullscreenQueue;
