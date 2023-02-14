import { Link } from '@remix-run/react';

import {
  HStack,
  Image,
  Stack,
  Text,
  useColorModeValue,
  Icon,
  AvatarGroup,
  Avatar,
  Flex,
  Divider,
} from '@chakra-ui/react';

import { Heart, Play, Send2 } from 'iconsax-react';

import { useDrawerActions } from '~/hooks/useDrawer';
import LikeIcon from '~/lib/icon/Like';
import type { Activity } from '~/lib/types/types';
import { timeSince } from '~/lib/utils';

import SpotifyLogo from '../icons/SpotifyLogo';
import Tooltip from '../Tooltip';
import PlayedBy from './PlayedBy';

interface ActivityProps {
  activity: Activity;
}

const ActivityAction = ({ activity }: ActivityProps) => {
  return (
    <HStack>
      <>
        {(() => {
          switch (activity.action) {
            case 'liked':
              return (
                <>
                  <Tooltip label={activity.user?.name} placement="top-start">
                    <Link to={`/${activity.user?.userId}`}>
                      <HStack>
                        <Image
                          minW="25px"
                          maxW="25px"
                          minH="25px"
                          maxH="25px"
                          borderRadius="100%"
                          src={activity.user?.image}
                        />
                        <Text fontSize="14px">{activity.user?.name}</Text>
                      </HStack>
                    </Link>
                  </Tooltip>
                  <LikeIcon aria-checked boxSize="18px" />
                </>
              );
            case 'send':
              return (
                <>
                  <Tooltip label={activity.user?.name} placement="top-start">
                    <Link to={`/${activity.user?.userId}`}>
                      <Image
                        minW="25px"
                        maxW="25px"
                        minH="25px"
                        maxH="25px"
                        borderRadius="100%"
                        src={activity.user?.image}
                      />
                    </Link>
                  </Tooltip>
                  <Icon as={Send2} boxSize="20px" fill="spotify.green" color="spotify.black" />
                  <Tooltip label={activity.owner?.user?.name} placement="top-start">
                    <Link to={`/${activity.owner?.user?.userId}`}>
                      <Image
                        minW="25px"
                        maxW="25px"
                        minH="25px"
                        maxH="25px"
                        borderRadius="100%"
                        src={activity.owner?.user?.image}
                      />
                    </Link>
                  </Tooltip>
                </>
              );
            case 'add':
              return (
                <>
                  <Tooltip label={activity.owner?.user?.name} placement="top-start">
                    <Link to={`/${activity.owner?.user?.userId}`}>
                      <Image
                        minW="25px"
                        maxW="25px"
                        minH="25px"
                        maxH="25px"
                        borderRadius="100%"
                        src={activity.owner?.user?.image}
                      />
                    </Link>
                  </Tooltip>
                  <Icon as={Play} boxSize="20px" fill="spotify.green" color="spotify.black" />
                  {activity.user && (
                    <Tooltip label={activity.user.name} placement="top-start">
                      <Link to={`/${activity.user.userId}`}>
                        <Image
                          minW="25px"
                          maxW="25px"
                          minH="25px"
                          maxH="25px"
                          borderRadius="100%"
                          src={activity.user.image}
                        />
                      </Link>
                    </Tooltip>
                  )}
                </>
              );
            default:
              return null;
          }
        })()}
        <Text fontSize={['9px', '10px']} opacity={0.6} w="100%">
          {timeSince(activity.createdAt)}
        </Text>
      </>
    </HStack>
  );
};

const MobileActivityTile = ({ activity }: ActivityProps) => {
  const bg = useColorModeValue('music.200', 'music.900');
  const color = useColorModeValue('music.900', 'music.200');

  const { onOpen } = useDrawerActions();

  const item = {
    albumName: activity.track.albumName,
    albumUri: activity.track.albumUri,
    artist: activity.track.artist,
    artistUri: activity.track.artistUri,
    duration: 0,
    explicit: activity.track.explicit,
    id: activity.trackId,
    image: activity.track.image,
    link: activity.track.link,
    name: activity.track.name,
    preview_url: activity.track.preview_url,
    uri: activity.track.uri,
    userId: activity.user?.userId,
  };

  const liked = (activity.track.liked ?? []).filter(({ user }) => {
    if (activity.track.liked?.length === 1) return false;
    return true;
    // return user?.userId !== activity.user?.userId || user?.userId !== activity.owner?.user?.userId;
  });

  const played = activity.track.recent ?? [];
  //   ?.filter(({ user }) => {
  //   return (
  //     user?.userId !== activity.user?.userId || user?.userId !== activity.owner?.user?.userId
  //   );
  // });

  return (
    <Stack py="6px" overflowX="hidden" bg={bg}>
      <HStack>
        <ActivityAction activity={activity} />
      </HStack>
      <Flex
        justify="space-between"
        bgColor={bg}
        w="100%"
        // pt="10px"
        onClick={() => onOpen(item)}
        cursor="pointer"
      >
        <Flex direction="column" w="100%" px={2} py={1}>
          <Tooltip label={item.name} placement="top-start">
            <Text
              fontSize={['12px', '13px']}
              noOfLines={1}
              whiteSpace="normal"
              wordBreak="break-word"
            >
              {item.name}
            </Text>
          </Tooltip>
          <Tooltip label={item.artist} placement="top-start">
            <Text fontSize={['9px', '10px']} opacity={0.6}>
              {item.artist}
            </Text>
          </Tooltip>

          <Flex justify="space-between" mt="auto">
            <SpotifyLogo alignSelf="end" icon w="21px" h="21px" />
            <Stack spacing="2px">
              {liked.length ? (
                <HStack>
                  <Icon as={Heart} />
                  <AvatarGroup size="xs" max={5} spacing="-9px">
                    {liked.map(({ user }) => (
                      <Avatar
                        minW="20px"
                        maxW="20px"
                        minH="20px"
                        maxH="20px"
                        key={user?.userId}
                        name={user?.name}
                        src={user?.image}
                      />
                    ))}
                  </AvatarGroup>
                </HStack>
              ) : null}
              {played.length ? <PlayedBy played={played} /> : null}
            </Stack>
          </Flex>
        </Flex>
        <Tooltip label={item.name} placement="top-start">
          <Image boxSize="100px" objectFit="cover" src={item.image} />
        </Tooltip>
      </Flex>
      <Divider opacity={0.5} w="100vw" pt="12px" color={color} />
    </Stack>
  );
};

export default MobileActivityTile;
