import { Image, MenuItem, Button } from '@chakra-ui/react';
import { useLocation, useParams } from '@remix-run/react';
import Waver from '../Waver';
import { useState } from 'react';
import { useTypedFetcher } from 'remix-typedjson';

type SaveToLikedProps = {
  trackId: string;
  isSmallScreen?: boolean;
};

const SaveToLiked = ({ trackId, isSmallScreen }: SaveToLikedProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { id } = useParams();
  const fetcher = useTypedFetcher<string>();
  const { pathname, search } = useLocation();

  const saveSong = () => {
    setIsSaved(!isSaved);
    const action = id ? `/${id}/save` : '/auth/spotify?returnTo=' + pathname + search;

    const form = new FormData();

    form.append('trackId', trackId);
    // form.append('isRemovable', isSaved ? 'hi' : '');

    fetcher.submit(form, { replace: true, method: 'post', action });
  };

  // useEffect(() => {
  //   fetcher.load(`/${id}/save?trackId=${trackId}`);
  // }, []);
  // useEffect(() => {
  //   if (fetcher.data) {
  //     setIsSaved(fetcher.data);
  //   }
  // }, []);

  // const text =
  //   id === undefined
  //     ? 'Log in to save a song'
  //     : isSaved
  //     ? 'Saved to Liked Songs'
  //     : 'Save to Liked Songs';
  const isAdding = fetcher.submission?.formData.get('trackId') === trackId;
  const isDone = fetcher.type === 'done';
  const isError =
    typeof fetcher.data === 'string'
      ? fetcher.data.includes('Error')
        ? fetcher.data
        : null
      : null;

  const icon = isSaved ? (
    <Image boxSize="24px" src="heart.svg" />
  ) : (
    <Image boxSize="24px" src="like.svg" />
  );

  return (
    <>
      {!isSmallScreen ? (
        <MenuItem
          onClick={saveSong}
          icon={icon}
          isDisabled={!!isDone || !!isError || !!isAdding}
          closeOnSelect={false}
          mr={isSaved ? '0px' : '9.54px'}
        >
          {isAdding ? <Waver /> : fetcher.data ? fetcher.data : 'Save'}
        </MenuItem>
      ) : (
        <Button
          onClick={saveSong}
          leftIcon={icon}
          isDisabled={!!isDone || !!isError || !!isAdding}
          mr={isSaved ? '0px' : '9.54px'}
          variant="drawer"
        >
          {isAdding ? <Waver /> : fetcher.data ? fetcher.data : 'Save'}
        </Button>
      )}
    </>
  );
};

export default SaveToLiked;