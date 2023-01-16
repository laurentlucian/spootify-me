import { Flex, HStack, Image, Stack, Text, Button } from '@chakra-ui/react';
import type { action } from '~/routes/$id/removeRecommend';
import explicitImage from '~/assets/explicit-solid.svg';
import { usePlaylistDrawerActions } from '~/hooks/usePlaylistDrawer';
import type { ChakraProps } from '@chakra-ui/react';
import { Link, useParams } from '@remix-run/react';
import { useTypedFetcher } from 'remix-typedjson';
import type { PlaylistTrack } from '~/lib/types/types';
import type { Profile } from '@prisma/client';
import { timeSince } from '~/lib/utils';
import { forwardRef } from 'react';
import Tooltip from './Tooltip';

type TileProps = {
  uri: string;
  trackId: string;
  image: string;
  name: string;
  description: string | null;
  explicit: boolean;

  // will show header (profile above tile) if createdAt is defined
  createdBy?: Profile | null;
  createdAt?: Date;
  playlist?: Boolean;
  recommend?: boolean;
} & ChakraProps;

const PlaylistTile = forwardRef<HTMLDivElement, TileProps>(
  (
    {
      uri,
      trackId,
      image,
      name,
      description,
      explicit,
      recommend,
      createdAt,
      createdBy,
      playlist,
      ...props
    },
    ref,
  ) => {
    const decodeHtmlEntity = (str?: string) => {
      return str?.replace(/&#x([0-9A-Fa-f]+);/g, (_, dec) => {
        return String.fromCharCode(parseInt(dec, 16));
      });
    };

    const { onOpen } = usePlaylistDrawerActions();
    const track: PlaylistTrack = {
      uri: uri,
      trackId,
      image,
      name,
      description,
      explicit,
    };
    const fetcher = useTypedFetcher<typeof action>();
    const { id } = useParams();
    const removeFromRecommended = () => {
      const action = `/${id}/removeRecommend`;
      fetcher.submit({ trackId }, { replace: true, method: 'post', action });
    };

    return (
      <>
        <Stack ref={ref} flex="0 0 200px" {...props} cursor="pointer">
          <Flex direction="column">
            {createdAt && (
              <HStack align="center" h="35px">
                {createdBy ? (
                  <Link to={`/${createdBy.userId}`}>
                    <HStack align="center">
                      <Image borderRadius={50} boxSize="25px" mb={1} src={createdBy.image} />
                      <Text fontWeight="semibold" fontSize="13px">
                        {createdBy.name.split(' ')[0]}
                      </Text>
                    </HStack>
                  </Link>
                ) : (
                  <Text fontWeight="semibold" fontSize="13px">
                    Anon
                  </Text>
                )}
                <Text as="span">·</Text>
                <Text fontSize="12px" opacity={0.6}>
                  {timeSince(createdAt ?? null)}
                </Text>
              </HStack>
            )}
            <Tooltip label={name} placement="top-start">
              <Image
                boxSize="200px"
                objectFit="cover"
                src={image}
                borderRadius={5}
                draggable={false}
                onClick={() => onOpen(track)}
              />
            </Tooltip>
          </Flex>
          <Flex justify="space-between">
            <Stack spacing={0} onClick={() => onOpen(track)}>
              <Text fontSize="13px" noOfLines={3} whiteSpace="normal" wordBreak="break-word">
                {name}
              </Text>
              {description && (
                <Flex align="center">
                  {explicit && <Image src={explicitImage} mr={1} w="19px" />}
                  <Text fontSize="11px" opacity={0.8} noOfLines={2}>
                    {decodeHtmlEntity(description)}
                  </Text>
                </Flex>
              )}
            </Stack>
            {recommend && <Button onClick={removeFromRecommended}>-</Button>}
          </Flex>
        </Stack>
      </>
    );
  },
);

PlaylistTile.displayName = 'Tile';

export default PlaylistTile;
