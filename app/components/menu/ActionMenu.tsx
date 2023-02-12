import { useNavigate, useParams } from '@remix-run/react';
import { useState } from 'react';

import { type ChakraProps, type MenuProps } from '@chakra-ui/react';
import { Portal } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { ArrowLeft2, ArrowRight2, DocumentText, More, Send2 } from 'iconsax-react';

import useParamUser from '~/hooks/useParamUser';
import useSessionUser from '~/hooks/useSessionUser';
import useUsers from '~/hooks/useUsers';

import AddQueue from './AddQueue';
import SaveToLiked from './SaveToLiked';

type ActionMenuConfig = {
  track: {
    trackId: string;

    // this is used by ActivityFeed to let prisma know from who the track is from (who sent, or liked)
    userId?: string;
  };
} & Omit<MenuProps, 'children'> &
  ChakraProps;

const ActionMenu = ({ track: { trackId, userId }, ...menuProps }: ActionMenuConfig) => {
  const allUsers = useUsers();
  const [isSending, setIsSending] = useState(false);
  const { id } = useParams();
  const user = useParamUser();
  const currentUser = useSessionUser();
  const navigate = useNavigate();
  const isOwnProfile = currentUser?.userId === id;
  const users = allUsers.filter((user) => user.userId !== currentUser?.userId);

  const SendTo = () => (
    <MenuItem
      icon={<Send2 />}
      onClick={() => setIsSending(true)}
      closeOnSelect={false}
      pos="relative"
    >
      Send to:
      <Icon as={ArrowRight2} boxSize="25px" ml="auto !important" pos="absolute" right="10px" />
    </MenuItem>
  );

  const SendToList = () => (
    <>
      <MenuItem icon={<ArrowLeft2 />} onClick={() => setIsSending(false)} closeOnSelect={false}>
        Send to:
      </MenuItem>
      <AddQueue trackId={trackId} userId={userId} user={null} />
      {!isOwnProfile && id && <AddQueue trackId={trackId} user={user} />}
      {users.map((user) => (
        <AddQueue key={user.userId} trackId={trackId} user={user} />
      ))}
    </>
  );

  return (
    <Menu direction="ltr" isLazy {...menuProps}>
      <MenuButton
        as={IconButton}
        variant="ghost"
        aria-label="options"
        icon={<More />}
        boxShadow="none"
        _active={{ boxShadow: 'none', opacity: 1 }}
        _hover={{ boxShadow: 'none', color: 'spotify.green', opacity: 1 }}
        opacity={0.5}
      />
      <Portal>
        <MenuList overflowY="auto" overflowX="hidden" maxH="400px">
          {isSending ? <SendToList /> : <SendTo />}
          {!isSending && (
            <>
              <MenuItem icon={<DocumentText />} onClick={() => navigate(`/analysis/${trackId}`)}>
                Analyze
              </MenuItem>
              <SaveToLiked trackId={trackId} />
            </>
          )}
        </MenuList>
      </Portal>
    </Menu>
  );
};
export default ActionMenu;
