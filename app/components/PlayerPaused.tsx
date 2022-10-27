import { Flex, HStack, Image, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import explicitImage from '~/assets/explicit-solid.svg';
import Tooltip from './Tooltip';
// import AddQueue from './AddQueue';

type PlayerPausedProps = {
  item: SpotifyApi.TrackObjectFull;
};

const PlayerPaused = ({ item }: PlayerPausedProps) => {
  const bg = useColorModeValue('music.50', 'music.900');

  const link = item.uri;
  const artistLink = item.album?.artists[0].uri;
  const albumLink = item.album?.uri;
  const name = item.name;
  const artist = item.artists[0].name;
  const image = item.album?.images[1].url;
  const explicit = item.explicit;

  return (
    <Stack w={[363, '100%']} bg={bg} spacing={0} borderRadius={5}>
      <HStack h="112px" spacing={2} px="2px" py="2px" justify="space-between">
        <Stack pl="7px" spacing={2} h="100%" flexGrow={1}>
          <Flex direction="column">
            <Link href={link ?? ''} target="_blank">
              <Text noOfLines={[1]}>{name}</Text>
            </Link>
            <Flex>
              {explicit && <Image mr={1} src={explicitImage} w="19px" />}
              <Link href={artistLink ?? ''} target="_blank">
                <Text opacity={0.8} fontSize="13px">
                  {artist}
                </Text>
              </Link>
            </Flex>
          </Flex>
        </Stack>
        <Link href={albumLink} target="_blank">
          <Tooltip label={item.album.name} placement="top-end">
            <Image src={image} m={0} boxSize={108} borderRadius={2} />
          </Tooltip>
        </Link>
      </HStack>
    </Stack>
  );
};
export default PlayerPaused;