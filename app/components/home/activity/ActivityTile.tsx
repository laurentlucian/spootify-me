import { Link } from '@remix-run/react';

import { HStack, Image, Stack, Text, useColorModeValue, Icon, Flex, Box } from '@chakra-ui/react';

import { motion } from 'framer-motion';
import { Play, Send2 } from 'iconsax-react';

import Tooltip from '~/components/Tooltip';
import { useClickDrag, useExpandedTile } from '~/hooks/useExpandedTileState';
import LikeIcon from '~/lib/icons/Like';
import SpotifyLogo from '~/lib/icons/SpotifyLogo';
import type { Activity, Track } from '~/lib/types/types';
import { timeSince } from '~/lib/utils';

import LikedBy from './LikedBy';
import PlayedBy from './PlayedBy';

type ActivityActionProps = {
  activity: Activity;
};
interface ActivityProps extends ActivityActionProps {
  index: number;
  layoutKey: string;
  tracks: Track[];
}

type UserIconProps = {
  id: string | undefined;
  image: string | undefined;
  name: string | undefined;
};

const UserIcon = ({ id, image, name }: UserIconProps) => {
  return (
    <Tooltip label={name}>
      <Link to={`/${id}`}>
        <Image minW="25px" maxW="25px" minH="25px" maxH="25px" borderRadius="100%" src={image} />
      </Link>
    </Tooltip>
  );
};

export const ActivityAction = ({ activity }: ActivityActionProps) => {
  return (
    <HStack>
      {(() => {
        switch (activity.action) {
          case 'liked':
            return (
              <>
                <UserIcon
                  id={activity.user?.userId}
                  name={activity.user?.name}
                  image={activity.user?.image}
                />
                <LikeIcon aria-checked boxSize="18px" />
              </>
            );
          case 'send':
            return (
              <>
                <UserIcon
                  id={activity.user?.userId}
                  name={activity.user?.name}
                  image={activity.user?.image}
                />
                <Tooltip label="sent">
                  <Icon as={Send2} boxSize="20px" fill="spotify.green" color="spotify.black" />
                </Tooltip>
                <UserIcon
                  id={activity.owner?.user?.userId}
                  name={activity.owner?.user?.name}
                  image={activity.owner?.user?.image}
                />
              </>
            );
          default:
            return null;
        }
      })()}
      <Text fontSize={['9px', '10px']} opacity={0.6} w="100%">
        {timeSince(activity.createdAt)}
      </Text>
    </HStack>
  );
};

const ActivityTile = ({ activity, index, layoutKey, tracks }: ActivityProps) => {
  const bg = useColorModeValue('musy.200', 'musy.900');

  const { onClick, onMouseDown, onMouseMove } = useClickDrag();
  useExpandedTile();

  return (
    <Stack>
      <ActivityAction activity={activity} />
      <Flex
        justify="space-between"
        bgColor={bg}
        w="250px"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        cursor="pointer"
      >
        <Flex direction="column" w="100%" px={2} py={1}>
          <Tooltip
            label={tracks[index].name.length > 17 ? tracks[index].name : undefined}
            placement="top-start"
          >
            <Text
              fontSize={['12px', '13px']}
              noOfLines={1}
              whiteSpace="normal"
              wordBreak="break-word"
            >
              {tracks[index].name}
            </Text>
          </Tooltip>
          <Tooltip
            label={tracks[index].artist.length > 17 ? tracks[index].artist : undefined}
            placement="top-start"
          >
            <Text fontSize={['9px', '10px']} opacity={0.6}>
              {tracks[index].artist}
            </Text>
          </Tooltip>

          <Flex justify="space-between" mt="auto">
            <SpotifyLogo alignSelf="end" icon w="21px" h="21px" />

            <Stack spacing="2px">
              {activity.track.liked?.length && <LikedBy liked={activity.track.liked} />}
              {activity.track.recent?.length && <PlayedBy played={activity.track.recent} />}
            </Stack>
          </Flex>
        </Flex>
        <Box
          as={motion.div}
          layoutId={tracks[index].id + layoutKey}
          minW="100px"
          onClick={() => onClick(tracks[index], activity.user.userId, layoutKey, tracks, index)}
        >
          <Tooltip label={tracks[index].albumName} placement="top-start">
            <Image boxSize="100px" objectFit="cover" src={tracks[index].image} />
          </Tooltip>
        </Box>
      </Flex>
    </Stack>
  );
};

export default ActivityTile;
