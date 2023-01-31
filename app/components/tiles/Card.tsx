import { useParams } from '@remix-run/react';

import { Image, Stack, Text, Button } from '@chakra-ui/react';
import type { ChakraProps } from '@chakra-ui/react';

import { useTypedFetcher } from 'remix-typedjson';

import explicitImage from '~/assets/explicit-solid.svg';
import { useClickDrag } from '~/hooks/useDrawer';
import useIsMobile from '~/hooks/useIsMobile';
import type { Track } from '~/lib/types/types';
import type { action } from '~/routes/$id/removeRecommend';

import SpotifyLogo from '../icons/SpotifyLogo';

type CardProps = Track & {
  // will show header (profile above Card) if createdAt is defined
  // createdBy?: Profile | null;
  // createdAt?: Date;
  // playlist?: Boolean;
  recommend?: boolean;
  ref?: (node: HTMLDivElement | null) => void;
} & ChakraProps;

const Card = ({
  albumName,
  albumUri,
  artist,
  artistUri,
  explicit,
  image,
  link,
  name,
  preview_url,
  recommend,
  trackId,
  uri,
}: // createdAt,
// createdBy,
// playlist,
CardProps) => {
  const isSmallScreen = useIsMobile();
  const { onClick, onMouseDown, onMouseMove } = useClickDrag();
  const track: Track = {
    albumName,
    albumUri,
    artist,
    artistUri,
    explicit,
    image,
    link,
    name,
    preview_url,
    trackId,
    uri: uri,
  };
  const fetcher = useTypedFetcher<typeof action>();
  const { id } = useParams();
  const removeFromRecommended = () => {
    const action = `/${id}/removeRecommend`;
    fetcher.submit({ trackId }, { action, method: 'post', replace: true });
  };
  const SongTitle = (
    <Text fontSize="16px" noOfLines={1} whiteSpace="normal" wordBreak="break-word">
      {name}
    </Text>
  );
  const SongImage = (
    <Image
      boxSize={['85px', '100px']}
      objectFit="cover"
      src={image}
      draggable={false}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onClick={() => onClick(track)}
    />
  );
  const ArtistName = (
    <Stack direction="row">
      {explicit && <Image src={explicitImage} mr={-1} w="19px" />}
      <Text fontSize="14px" opacity={0.8} noOfLines={1}>
        {artist}
      </Text>
    </Stack>
  );
  const AlbumName = (
    <Text fontSize="14px" opacity={0.8} w={['100%', '60%']} textAlign={['unset', 'center']}>
      {albumName}
    </Text>
  );
  const TitleArtistAlbumName = (
    <Stack>
      {SongTitle}
      <Stack direction={['column', 'row']} w={['auto', '600px']} justify="space-between">
        {ArtistName}
        {AlbumName}
      </Stack>
    </Stack>
  );

  return (
    <>
      <Stack
        flex="0 0 200px"
        cursor="pointer"
        direction="row"
        w={['100vw', '450px', '750px', '1100px']}
        py="5px"
        pl="5px"
        justify="space-between"
      >
        <Stack direction="row">
          {SongImage}
          {TitleArtistAlbumName}
        </Stack>
        {recommend && <Button onClick={removeFromRecommended}>-</Button>}
        <SpotifyLogo icon={isSmallScreen} alignSelf={['end', 'unset']} />
      </Stack>
    </>
  );
};

export default Card;