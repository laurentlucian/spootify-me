import { Heading, Stack } from '@chakra-ui/react';
import Tile from '../Tile';
import Tiles from '../Tiles';

const RecentTracks = ({
  recent: initialRecent,
}: {
  recent: SpotifyApi.UsersRecentlyPlayedTracksResponse;
}) => {
  const recent = initialRecent.items;

  if (!recent) return null;

  return (
    <Stack spacing={3}>
      <Heading fontSize={['xs', 'sm']}>Recently played</Heading>
      <Tiles>
        {recent.map(({ track, played_at }) => {
          return (
            <Tile
              key={played_at}
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
      </Tiles>
    </Stack>
  );
};

export default RecentTracks;