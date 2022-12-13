import { Heading, HStack, Stack, RadioGroup, Radio } from '@chakra-ui/react';
import { Form, useFetcher, useParams, useSearchParams, useSubmit } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import useIsVisible from '~/hooks/useIsVisible';
import Tile from '../Tile';
import Tiles from '../Tiles';

const TopTracks = ({ top: initialTop }: { top: SpotifyApi.TrackObjectFull[] }) => {
  const [top, setTop] = useState(initialTop);
  const { id } = useParams();
  const submit = useSubmit();
  const [params] = useSearchParams();
  const topFilter = params.get('top-filter') ?? 'medium_term';

  const fetcher = useFetcher();
  const offsetRef = useRef(0);
  const ref = useRef(null);
  const isVisible = useIsVisible(ref);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (isVisible && !hasFetched.current) {
      const newOffset = offsetRef.current + 50;
      offsetRef.current = newOffset;
      fetcher.load(`/${id}/top?offset=${newOffset}&top-filter=${topFilter}`);
      hasFetched.current = true;
    }
  }, [isVisible, topFilter, fetcher, id]);

  useEffect(() => {
    if (fetcher.data) {
      setTop((prev) => [...prev, ...fetcher.data]);
      hasFetched.current = false;
    }
  }, [fetcher.data]);

  useEffect(() => {
    setTop(initialTop);
  }, [initialTop]);

  if (!top) return null;

  return (
    <Stack spacing={3}>
      <HStack spacing={5}>
        <Heading fontSize={['xs', 'sm']}>Top</Heading>
        <Form method="get" onChange={(e) => submit(e.currentTarget)}>
          <RadioGroup defaultValue={topFilter} name="top-filter" size="sm">
            <HStack spacing={4}>
              <Radio value="short_term">30 days</Radio>
              <Radio value="medium_term">6 months</Radio>
              <Radio value="long_term">All</Radio>
            </HStack>
          </RadioGroup>
        </Form>
      </HStack>
      <Tiles>
        {top.map((track) => {
          return (
            <Tile
              key={track.id}
              uri={track.uri}
              image={track.album.images[1].url}
              albumUri={track.album.uri}
              albumName={track.album.name}
              name={track.name}
              artist={track.album.artists[0].name}
              artistUri={track.album.artists[0].uri}
              explicit={track.explicit}
              user={null}
            />
          );
        })}
        <div ref={ref} />
      </Tiles>
    </Stack>
  );
};

export default TopTracks;
