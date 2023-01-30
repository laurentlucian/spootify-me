import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { mode, transparentize } from '@chakra-ui/theme-tools';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';

type AccessibleColor = {
  activeBg?: string;
  bg?: string;
  color?: string;
  hoverBg?: string;
};

/** Accessible color overrides for less accessible colors. */
const accessibleColorMap: { [key: string]: AccessibleColor } = {
  cyan: {
    activeBg: 'cyan.600',
    bg: 'cyan.400',
    color: 'black',
    hoverBg: 'cyan.500',
  },
  yellow: {
    activeBg: 'yellow.600',
    bg: 'yellow.400',
    color: 'black',
    hoverBg: 'yellow.500',
  },
};

const baseStyle = defineStyle((props) => ({
  borderRadius: 'sm',
  color: mode('music.200', 'music.800')(props),
}));

const variantMusic: SystemStyleFunction = (props) => {
  const { colorScheme: c } = props;

  const {
    bg = `${c}.500`,
    color = 'white',
    hoverBg = `${c}.600`,
    activeBg = `${c}.700`,
  } = accessibleColorMap[c] ?? {};

  const background = mode(bg, `${c}.100`)(props);

  return {
    _active: { bg: mode(activeBg, `${c}.400`)(props) },
    _hover: {
      _disabled: {
        bg: background,
      },
      bg: mode(hoverBg, `${c}.300`)(props),
    },
    bg: background,
    color: mode(color, `gray.800`)(props),
  };
};

const variantGhost = defineStyle((props) => {
  const { colorScheme: c, theme } = props;

  if (c === 'gray') {
    return {
      _active: { bg: mode(`whiteAlpha.300`, `gray.200`)(props) },
      _hover: {
        bg: mode(`whiteAlpha.200`, `gray.100`)(props),
      },
      color: mode('music.200', 'music.800')(props),
    };
  }

  const darkHoverBg = transparentize(`${c}.200`, 0.12)(theme);
  const darkActiveBg = transparentize(`${c}.200`, 0.24)(theme);

  return {
    _active: {
      bg: mode(darkActiveBg, `#302f2f`)(props),
    },
    _hover: {
      bg: mode(darkHoverBg, `${c}.50`)(props),
    },
    bg: 'transparent',
    color: mode(`music.200`, `music.800`)(props),
  };
});

const login = defineStyle((props) => ({
  WebkitTapHighlightColor: '#0000 !important',
  _active: {
    backfaceVisibility: 'none !important',
    boxShadow: 'none !important',
  },
  _focus: {
    backfaceVisibility: 'none !important',
    boxShadow: 'none !important',
  },
  _hover: { backfaceVisibility: 'none !important', boxShadow: 'none !important' },
  backfaceVisibility: 'none !important',
  bg: mode('music.200', 'music.700')(props),
  borderRadius: '7px',
  boxShadow: 'none !important',
  color: mode('music.700', 'white')(props),
  h: '39px',
  userSelect: 'none !important',
  w: '200px',
}));

const drawer = defineStyle({
  _active: { boxShadow: 'none !important', opacity: '0.69', outline: 'none !important' },
  _focus: { boxShadow: 'none !important', opacity: '0.69', outline: 'none !important' },
  _hover: { boxShadow: 'none !important', opacity: '0.69', outline: 'none !important' },
  bg: '#00',
  boxShadow: 'none !important',
  outline: 'none !important',
  w: '100vw',
});
const searchCircle = defineStyle((props) => ({
  WebkitTapHighlightColor: '#0000 !important',
  _active: {
    backfaceVisibility: 'none !important',
    boxShadow: 'none !important',
    boxSize: '43px',
  },
  _focus: {
    backfaceVisibility: 'none !important',
    boxShadow: 'none !important',
  },
  _hover: { backfaceVisibility: 'none !important', boxShadow: 'none !important' },
  backfaceVisibility: 'none !important',
  bg: mode('music.200', 'music.700')(props),
  borderRadius: 'full',

  boxShadow: 'none !important',
  boxSize: '50px',
  color: mode('music.700', 'music.200')(props),
  fontSize: '40px',
  fontWeight: 'hairline',
  perspective: 1000,
  pos: 'fixed',
  transition: 'width 0.25s ease-out, height 0.25s ease-out, bottom 0.25s ease-in-out !important',
  userSelect: 'none !important',
  zIndex: 10000,
}));
const close = defineStyle((props) => ({
  WebkitTapHighlightColor: '#0000 !important',
  _active: {
    backfaceVisibility: 'none !important',
    boxShadow: 'none !important',
    fontSize: '18px',
  },
  _focus: {
    backfaceVisibility: 'none !important',
    boxShadow: 'none !important',
  },
  _hover: { backfaceVisibility: 'none !important', boxShadow: 'none !important' },
  backfaceVisibility: 'none !important',
  boxShadow: 'none !important',
  color: mode('music.700', 'white')(props),
  fontSize: '20px',
  fontWeight: 'light',
  perspective: 1000,
  pos: 'fixed',
  right: 1,
  top: -1,
  transition: 'font-size 0.25s ease-out',
  userSelect: 'none !important',
  zIndex: 10000,
}));

export const Button = defineStyleConfig({
  baseStyle,
  defaultProps: {
    colorScheme: 'music',
    size: 'sm',
    variant: 'music',
  },
  variants: {
    close,
    drawer,
    ghost: variantGhost,
    login,
    music: variantMusic,
    searchCircle,
  },
});
