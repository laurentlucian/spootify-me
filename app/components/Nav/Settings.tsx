import { useNavigate } from '@remix-run/react';
import type { Dispatch, SetStateAction } from 'react';

import { IconButton, useColorModeValue } from '@chakra-ui/react';

import { motion } from 'framer-motion';
import { Setting2 } from 'iconsax-react';

import useSessionUser from '~/hooks/useSessionUser';

type SettingsConfig = {
  setShow: Dispatch<SetStateAction<boolean>>;
  show: boolean;
};

const Settings = ({ setShow, show }: SettingsConfig) => {
  const navigate = useNavigate();
  const currentUser = useSessionUser();
  const color = useColorModeValue('black', 'white');

  const onClick = () => {
    if (show) {
      navigate(`/settings`);
      setShow(false);
    } else {
      navigate(`/${currentUser?.userId}`);
      setShow(true);
    }
  };

  return (
    <IconButton
      as={motion.div}
      aria-label="settings"
      icon={<Setting2 />}
      variant="ghost"
      onClick={onClick}
      _active={{ boxShadow: 'none' }}
      _hover={{ boxShadow: 'none', opacity: 1, transform: 'rotate(180deg)' }}
      opacity="0.5"
      transition="opacity 2s ease in out"
      cursor="pointer"
      color={color}
    />
  );
};
export default Settings;