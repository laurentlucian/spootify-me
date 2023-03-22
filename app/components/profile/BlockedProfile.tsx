import { Lock } from 'react-feather';

import { Button, HStack, Stack, Text } from '@chakra-ui/react';

import { motion } from 'framer-motion';

const BlockedProfile = ({ amIBlocked, name }: { amIBlocked: boolean; name: string }) => {
  const green = '#1DB954';
  const block = (
    <motion.div animate={{ opacity: [0, 1, 0, 1] }} transition={{ duration: 5, loop: Infinity }}>
      <Lock size="30" color={green} />
    </motion.div>
  );
  return (
    <Stack spacing={5} px={5}>
      <HStack>
        {block}
        <Text opacity=".5">
          {amIBlocked ? `You have been blocked by ${name}` : `You have blocked ${name}`}
        </Text>
      </HStack>
      <Button
        w="300px"
        size="md"
        _hover={{ color: 'spotify.green' }}
        onClick={() => window.history.back()}
      >
        go back
      </Button>
    </Stack>
  );
};

export default BlockedProfile;
