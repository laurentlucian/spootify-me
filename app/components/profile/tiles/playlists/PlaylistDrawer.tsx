import { useRef } from 'react';

import {
  Drawer,
  Image,
  Link,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  Button,
  useDisclosure,
  Stack,
  DrawerFooter,
  Box,
  Text,
  Flex,
} from '@chakra-ui/react';

import useIsMobile from '~/hooks/useIsMobile';
import { usePlaylistDrawerActions, usePlaylistDrawerStore } from '~/hooks/usePlaylistDrawer';

const PlaylistDrawer = () => {
  const { onClose } = usePlaylistDrawerActions();
  const playlist = usePlaylistDrawerStore();
  const isOpen = playlist !== null ? true : false;
  const sendMenu = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);

  const isSmallScreen = useIsMobile();

  const CloseMenu = () => {
    const handleClick = () => {
      isOpen && !sendMenu.isOpen ? onClose() : sendMenu.onClose();
    };
    const text = isOpen && !sendMenu.isOpen ? 'close' : 'cancel';
    return (
      <Button
        variant="drawer"
        onClick={handleClick}
        justifyContent="center"
        h={['10px', '40px']}
        pt="10px"
        w="100vw"
      >
        {text}
      </Button>
    );
  };
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        finalFocusRef={btnRef}
        lockFocusAcrossFrames
        preserveScrollBarGap
        size="full"
        variant={isSmallScreen ? 'none' : 'desktop'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <Stack direction={['column', 'row']} align="center" justify="center">
              {playlist && (
                <Stack align={['center', 'flex-start']} direction={['column']} maxW={510}>
                  {isSmallScreen && <Box h="90px" w="10px" />}
                  {playlist.uri && (
                    <>
                      <Link href={playlist.uri} _focus={{ boxShadow: 'none' }}>
                        <Image
                          boxSize={['350px', '369px', 500]}
                          objectFit="cover"
                          src={playlist.images[0].url}
                          alignSelf="center"
                          mr={['0', '25px']}
                          mt={[0, '100px']}
                        />
                      </Link>
                      <Link
                        href={playlist.uri}
                        _hover={{ textDecor: 'none' }}
                        _focus={{ boxShadow: 'none' }}
                      >
                        <Text
                          fontSize={['xl', '5xl']}
                          fontWeight="bold"
                          textAlign="left"
                          w="fit-content"
                          wordBreak="break-word"
                          pos="relative"
                        >
                          {playlist.name}
                          <Flex
                            as="span"
                            alignItems="center"
                            pos="absolute"
                            left="-25px"
                            top="0"
                            bottom="0"
                            transition="opacity .25s ease-in-out"
                          ></Flex>
                        </Text>
                      </Link>
                      <Text color="#BBB8B7">{playlist.description}</Text>
                    </>
                  )}
                </Stack>
              )}
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <CloseMenu />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default PlaylistDrawer;