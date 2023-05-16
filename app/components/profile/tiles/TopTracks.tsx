import { Form, useSearchParams, useSubmit, useParams } from '@remix-run/react';
import { useCallback, useState } from 'react';

import { Box, HStack, SimpleGrid, Stack, useRadioGroup } from '@chakra-ui/react';

import { RadioCard } from '~/lib/theme/components/Radio';
import type { Track } from '~/lib/types/types';

import Card from './Card';
import ExpandedSongs from './ExpandedSongs';
import Tile from './tile/Tile';
import TileImage from './tile/TileImage';
import TileInfo from './tile/TileInfo';
import Tiles from './Tiles';

const options = [
  { name: 'All', value: 'long_term' },
  { name: '6 mo', value: 'medium_term' },
  { name: '1 mo', value: 'short_term' },
];

const TopTracks = ({ top }: { top: SpotifyApi.TrackObjectFull[] }) => {
  const [layout, setLayout] = useState(true);
  const [show, setShow] = useState(false);
  const submit = useSubmit();
  const [params] = useSearchParams();
  const { id } = useParams();
  const topFilter = params.get('top-filter') ?? 'medium_term';

  const { getRadioProps, getRootProps } = useRadioGroup({
    defaultValue: topFilter,
    name: 'top-filter',
  });

  const group = getRootProps();

  const Filter = (
    <Form
      method="get"
      onChange={(e) => {
        submit(e.currentTarget, { preventScrollReset: true, replace: true });
      }}
    >
      <HStack spacing={4} {...group} p={0} m={0}>
        {options.map(({ name, value }) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio} value={value}>
              {name}
            </RadioCard>
          );
        })}
      </HStack>
    </Form>
  );

  const scrollButtons = top.length > 5;
  const title = 'Top';

  const onClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  let tracks: Track[] = [];

  for (const track of top) {
    if (!track.name) continue;
    tracks.push({
      albumName: track.album.name,
      albumUri: track.album.uri,
      artist: track.artists[0].name,
      artistUri: track.artists[0].uri,
      duration: track.duration_ms,
      explicit: track.explicit,
      id: track.id,
      image: track.album.images[0].url,
      link: track.external_urls.spotify,
      name: track.name,
      preview_url: track.preview_url ?? '',
      uri: track.uri,
    });
  }

  if (!top.length) return null;

  return (
    <Stack spacing={3} pb={top.length === 0 ? '250px' : '0px'}>
      <Tiles title={title} scrollButtons={scrollButtons} Filter={Filter} setShow={setShow}>
        {tracks.map((track, index) => {
          return (
            <Tile
              key={track.id}
              track={track}
              tracks={tracks}
              index={index}
              layoutKey="Top"
              image={<TileImage />}
              info={<TileInfo />}
            />
          );
        })}
      </Tiles>
      <ExpandedSongs
        title={title}
        show={show}
        onClose={onClose}
        Filter={Filter}
        setLayout={setLayout}
        layout={layout}
      >
        {layout ? (
          <SimpleGrid
            minChildWidth={['115px', '100px']}
            spacing="10px"
            w={{ base: '100vw', md: '750px', sm: '450px', xl: '1100px' }}
          >
            {tracks.map((track, index) => {
              return (
                <Box key={track.id}>
                  <Tile
                    track={track}
                    tracks={tracks}
                    index={index}
                    layoutKey="TopExpanded"
                    image={<TileImage size={['115px', '100px']} />}
                    info={<TileInfo />}
                  />
                </Box>
              );
            })}
          </SimpleGrid>
        ) : (
          tracks.map((track, index) => {
            return (
              <Card
                key={track.id}
                layoutKey="TopCard"
                track={track}
                tracks={tracks}
                index={index}
                userId={id ?? ''}
              />
            );
          })
        )}
      </ExpandedSongs>
    </Stack>
  );
};

export default TopTracks;