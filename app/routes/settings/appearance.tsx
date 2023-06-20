import type { ActionArgs } from '@remix-run/server-runtime';

import { Stack } from '@chakra-ui/react';

import { typedjson } from 'remix-typedjson';
import invariant from 'tiny-invariant';

import ProfileSettings from '~/components/settings/profile/ProfileSettings';
import useCurrentUser from '~/hooks/useCurrentUser';
import { authenticator } from '~/services/auth.server';
import { prisma } from '~/services/db.server';
import { upsertSettingsField, upsertThemeField } from '~/services/prisma/theme.server';

const Appearance = () => {
  const currentUser = useCurrentUser();

  if (!currentUser) return null;
  return (
    <Stack spacing={5} w="100%" h="100%" direction={['column', 'row']}>
      <ProfileSettings />
    </Stack>
  );
};

export const loader = async ({ request }: ActionArgs) => {
  const session = await authenticator.isAuthenticated(request);
  const userId = session?.user?.id;
  invariant(userId, 'Unauthenticated');

  const theme = await prisma.theme.findUnique({
    where: { userId },
  });

  return typedjson({
    theme,
  });
};
export const action = async ({ request }: ActionArgs) => {
  const session = await authenticator.isAuthenticated(request);
  const userId = session?.user?.id;
  invariant(userId, 'Unauthenticated');

  const data = await request.formData();

  const promises = [
    upsertSettingsField('playerButtonRight', data.get('playerButtonSide'), userId, true),
    upsertThemeField('gradient', data.get('gradient'), userId, true),
    upsertThemeField('opaque', data.get('opaque'), userId, true),
    upsertThemeField('blur', data.get('blur'), userId, true),
    upsertThemeField('backgroundDark', data.get('backgroundDark'), userId),
    upsertThemeField('backgroundLight', data.get('backgroundLight'), userId),
    upsertThemeField('bgGradientDark', data.get('bgGradientDark'), userId),
    upsertThemeField('bgGradientLight', data.get('bgGradientLight'), userId),
    upsertThemeField('playerColorDark', data.get('playerColorDark'), userId),
    upsertThemeField('playerColorLight', data.get('playerColorLight'), userId),
    upsertThemeField('mainTextDark', data.get('mainTextDark'), userId),
    upsertThemeField('mainTextLight', data.get('mainTextLight'), userId),
    upsertThemeField('subTextDark', data.get('subTextDark'), userId),
    upsertThemeField('subTextLight', data.get('subTextLight'), userId),
  ];

  await Promise.all(promises);

  return null;
};

export { ErrorBoundary } from '~/components/error/ErrorBoundary';
export default Appearance;
