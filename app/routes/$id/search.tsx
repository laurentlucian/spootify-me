import type { LoaderArgs } from '@remix-run/node';
import { spotifyApi } from '~/services/spotify.server';
import Tile from '~/components/Tile';
import Tiles from '~/components/tiles/Tiles';
import invariant from 'tiny-invariant';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

const Search = () => {
  const { results } = useTypedLoaderData<typeof loader>();
  const tracks = results?.tracks?.items ?? [];

  if (tracks.length === 0) return <></>;

  return (
    <Tiles title="">
      {tracks?.map((track) => (
        <Tile
          key={track.id}
          trackId={track.id}
          uri={track.uri}
          image={track.album.images[1].url}
          albumUri={track.album.uri}
          albumName={track.album.name}
          name={track.name}
          artist={track.album.artists[0].name}
          artistUri={track.artists[0].uri}
          explicit={track.explicit}
        />
      ))}
    </Tiles>
  );
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const { id } = params;
  invariant(id, 'Missing param Id');

  const { spotify } = await spotifyApi(id);
  invariant(spotify, 'No access to spotify API');
  const url = new URL(request.url);
  const searchURL = url.searchParams.get('spotify');
  if (!searchURL) return typedjson({ results: null });

  const { body: results } = await spotify.searchTracks(searchURL);
  return typedjson({ results });
};

export default Search;
