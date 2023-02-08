import { Box, useColorModeValue, useRadio } from '@chakra-ui/react';

export const RadioButtons = (props: any) => {
  const color = useColorModeValue('#161616', '#EEE6E2');
  const bg = useColorModeValue('music.200', 'music.700');

  const { getCheckboxProps, getInputProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label" p={0} m={0} w="100%">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        w="100%"
        borderRadius={[0, 'md']}
        fontSize="16px"
        color={color}
        bg={bg}
        _hover={{
          bg,
          color,
          opacity: 1,
          textDecor: 'none',
          fontSize: '20px',
        }}
        px="4px"
        py={0}
        opacity={1}
        _checked={{
          bg,
          color,
          opacity: 1,
          textDecor: 'none',
          fontSize: '20px',
          px: '6px',
          border: 'solid',
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};