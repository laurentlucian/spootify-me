import type { MetaFunction, LinksFunction, LoaderArgs } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
} from '@remix-run/react';
import { useContext, useEffect } from 'react';

import {
  Heading,
  ChakraProvider,
  Text,
  cookieStorageManagerSSR,
  ColorModeProvider,
} from '@chakra-ui/react';

import { withEmotionCache } from '@emotion/react';
import { AnimatePresence, motion } from 'framer-motion';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

import Layout from '~/components/Layout';
import { theme } from '~/lib/theme';
import { authenticator } from '~/services/auth.server';

import ExpandedTile from './components/tileActions/ExpandedTile';
import { ClientStyleContext, ServerStyleContext } from './lib/emotion/context';
import loading from './lib/styles/loading.css';
import { iosSplashScreens } from './lib/utils';
import { prisma } from './services/db.server';

const App = () => {
  const { cookie } = useTypedLoaderData<typeof loader>();
  const colorModeManager = cookieStorageManagerSSR(cookie);

  return (
    <Document>
      <ChakraProvider theme={theme}>
        <ColorModeProvider
          colorModeManager={colorModeManager}
          options={{
            disableTransitionOnChange: true,
            initialColorMode: theme.config.initialColorMode,
            useSystemColorMode: theme.config.useSystemColorMode,
          }}
        >
          <Layout>
            <ExpandedTile />
            <Outlet />
          </Layout>
        </ColorModeProvider>
      </ChakraProvider>
    </Document>
  );
};

export const loader = async ({ request }: LoaderArgs) => {
  const session = await authenticator.isAuthenticated(request);
  const cookie = request.headers.get('cookie') ?? '';
  const isMobile = request.headers.get('user-agent')?.includes('Mobile') ?? false;

  if (session && session.user) {
    const currentUser = await prisma.profile.findUnique({
      include: {
        liked: { select: { trackId: true } },
        settings: { include: { profileSong: true } },
        theme: true,
      },
      where: { userId: session.user.id },
    });

    return typedjson({ cookie, currentUser, isMobile });
  } else {
    return typedjson({ cookie, currentUser: null, isMobile });
  }
};

export const meta: MetaFunction = () => {
  const description = 'Music shared easy';

  return {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black',
    charset: 'utf-8',
    description,
    keywords: 'music, discover, spotify, playlist, share, friends',
    'og:description': description,
    'og:image': '/meta-image.png',
    'og:image:alt': 'musy',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'og:image:width': '1200',
    'og:title': 'musy',

    'twitter:card': 'summary_large_image',
    'twitter:description': description,
    'twitter:image': '/meta-image.png',
    'twitter:title': 'musy',
    viewport: 'width=device-width,initial-scale=1,user-scalable=no',
  };
};

export let links: LinksFunction = () => {
  return [
    { as: 'style', href: loading, rel: 'stylesheet' },
    { as: 'preconnect', href: 'https://fonts.googleapis.com', rel: 'preconnect' },
    { as: 'preconnect', href: 'https://fonts.gstaticom', rel: 'preconnect' },
    {
      as: 'font',
      href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap',
      media: 'all',
      rel: 'stylesheet',
    },
    {
      as: 'font',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap',
      media: 'all',
      rel: 'stylesheet',
    },
    {
      as: 'font',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;500;600;700;800;900&display=swap"',
      media: 'all',
      rel: 'stylesheet',
    },
    {
      as: 'manifest',
      href: '/manifest.json',
      rel: 'manifest',
    },
    {
      href: '/apple-touch-icon.png',
      rel: 'apple-touch-icon',
    },
    ...iosSplashScreens,
  ];
};

type DocumentProps = {
  children: React.ReactNode;
  title?: string;
};

const Document = withEmotionCache(({ children, title = 'musy' }: DocumentProps, emotionCache) => {
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);
  const location = useLocation();

  // Only executed on client
  useEffect(
    () => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      /* "clientStyleData", "emotionCache.sheet", */
    ],
  );

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {serverStyleData?.map(({ css, ids, key }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
        <title>{title}</title>
      </head>
      <body>
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, x: '-10%' }}
            animate={{ opacity: 1, x: '0' }}
            exit={{ opacity: 0, x: '-10%' }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  );
});

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);
  return (
    <Document title="musy - Error">
      <ChakraProvider theme={theme}>
        <Layout>
          <Heading fontSize={['sm', 'md']}>Oops, unhandled error</Heading>
          <Text fontSize="sm">Trace(for debug): {error.message}</Text>
        </Layout>
      </ChakraProvider>
    </Document>
  );
};

export const CatchBoundary = () => {
  let caught = useCatch();
  let message;
  switch (caught.status) {
    case 401:
      message = <Text>Oops, you shouldn&apos;t be here (No access)</Text>;
      break;
    case 404:
      message = <Text>Oops, you shouldn&apos;t be here (Page doesn&apos;t exist)</Text>;
      break;

    default:
      // throw new Error(caught.data || caught.statusText);
      message = <Text>Oops, this definitely shouldn&apos;t have happened</Text>;
  }

  return (
    <Document title="musy - Error">
      <ChakraProvider theme={theme}>
        <Layout>
          <Heading fontSize={['sm', 'md']}>
            {caught.status}: {caught.statusText}
          </Heading>
          <Text fontSize="sm">{message}</Text>
        </Layout>
      </ChakraProvider>
    </Document>
  );
};

export default App;
