import { useLocation, useParams, useSubmit } from '@remix-run/react';

import { Button, Image } from '@chakra-ui/react';

import type { Profile } from '@prisma/client';
import { AddSquare, CloseSquare, Send2, TickSquare } from 'iconsax-react';
import { useTypedFetcher } from 'remix-typedjson';

import useSessionUser from '~/hooks/useSessionUser';
import type { action } from '~/routes/$id/add';

import Waver from '../icons/Waver';

type AddQueueProps = {
  fromUseId?: string;
  trackId: string;
  // this is used by ActivityFeed to let prisma know from who the track is from (who sent, or liked)
  user: Profile | null;
  userId?: string | null;
};

const AddQueue = ({ fromUseId, trackId, user, userId }: AddQueueProps) => {
  const { id: paramId } = useParams();
  const currentUser = useSessionUser();
  const submit = useSubmit();
  const fetcher = useTypedFetcher<typeof action>();
  const { pathname, search } = useLocation();
  const isSending = !!user;

  const addToQueue = () => {
    if (!currentUser) {
      // @todo figure out a better way to require authentication on click;
      // after authentication redirect, add to queue isn't successful. user needs to click again
      return submit(null, {
        action: '/auth/spotify?returnTo=' + pathname + search,
        method: 'post',
        replace: true,
      });
    }

    const id = fromUseId || user?.userId || paramId;
    const action = isSending ? `/${id}/add` : `/${currentUser.userId}/add`;

    const fromUserId = isSending ? currentUser?.userId : id;
    const sendToUserId = isSending ? id : currentUser?.userId;

    const data = {
      action: isSending ? 'send' : 'add',

      fromId: fromUserId ?? '',
      toId: sendToUserId ?? '',
      trackId: trackId ?? '',
    };

    fetcher.submit(data, { action, method: 'post', replace: true });
  };
  const isAdding = fetcher.submission?.formData.get('trackId') === trackId;

  const isDone = fetcher.type === 'done';
  const isError =
    typeof fetcher.data === 'string'
      ? fetcher.data.includes('Error')
        ? fetcher.data
        : null
      : null;
  const icon = isDone ? (
    <TickSquare size="25px" />
  ) : isError ? (
    <CloseSquare size="25px" />
  ) : user ? (
    <Send2 />
  ) : (
    <AddSquare />
  );

  const qText = isSending ? user?.name.split(/[ .]/)[0] : 'Add to Your Queue';

  const text = isDone ? (typeof fetcher.data === 'string' ? fetcher.data : 'Authenticated') : qText;

  return (
    <>
      {user ? (
        <Button // button to add to your friend's queue
          onClick={addToQueue}
          isDisabled={!!isDone || !!isError || !!isAdding}
          variant="ghost"
          justifyContent="left"
          fontSize="18px"
          py="30px"
          w={['100vw', '550px']}
          mt="10px"
        >
          <Image
            src={user?.image}
            borderRadius="full"
            boxSize="50px"
            minW="50px"
            mb={1}
            mr="10px"
          />
          {isAdding ? <Waver /> : text}
        </Button>
      ) : (
        <Button // button to add to your own queue
          onClick={addToQueue}
          leftIcon={icon}
          isDisabled={!!isDone || !!isError || !!isAdding}
          variant="ghost"
          justifyContent="left"
          fontSize="14px"
          w={['100vw', '550px']}
          _hover={{ color: 'white' }}
        >
          {isAdding ? <Waver /> : text}
        </Button>
      )}
    </>
  );
};

export default AddQueue;
