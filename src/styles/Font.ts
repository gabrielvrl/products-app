import { StyleSheet } from 'react-native';

import { Colors } from 'styles';

export const black = {
  fontFamily: 'Satoshi-Black',
  includeFontPadding: false,
};
export const bold = {
  fontFamily: 'Satoshi-Bold',
  includeFontPadding: false,
};
export const light = {
  fontFamily: 'Satoshi-Light',
  includeFontPadding: false,
};
export const medium = {
  fontFamily: 'Satoshi-Medium',
  includeFontPadding: false,
};
export const regular = {
  fontFamily: 'Satoshi-Regular',
  includeFontPadding: false,
};

export const Fonts = StyleSheet.create({
  //Used for the header screen title, should be only once per screen
  headerTitle: {
    ...black,
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 36,
    letterSpacing: 0,
    color: Colors.blackAbsolute,
  },
  //Used for the main screen title, should be only once per screen
  titleScreen: {
    ...bold,
    fontSize: 30,
    fontWeight: 600,
    lineHeight: 34,
    letterSpacing: -0.75,
    color: Colors.blackPrimary,
  },
  // Handy for dividing your screen into sections
  titleSection: {
    ...bold,
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.39,
    color: Colors.blackPrimary,
  },
  // Designer for sections within sections
  titleSubSection: {
    ...bold,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.33,
    color: Colors.blackPrimary,
  },
  // For large amount of content. Pairs with large body and default body
  titleBody: {
    ...bold,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.18,
    color: Colors.blackPrimary,
  },
  titleBodyRegular: {
    ...regular,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: -0.18,
    color: Colors.blackPrimary,
  },

  // Used to group actions or infos
  titleGroup: {
    ...medium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.21,
    color: Colors.blackPrimary,
  },
  // Used for paragraphs. Pairs with screen title and section title
  contentBase: {
    ...regular,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: -0.08,
    color: Colors.blackPrimary,
  },
  // Highlights important words or small titles
  contentBaseBold: {
    ...medium,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.16,
    color: Colors.blackPrimary,
  },
  // When you need something a little smaller then base
  contentSmall: {
    ...regular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: Colors.blackPrimary,
  },
  // Same as content small but bold
  contentSmallBold: {
    ...bold,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
    letterSpacing: 0.175,
    color: Colors.blackPrimary,
  },
  caption: {
    ...regular,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: Colors.blackPrimary,
  },
  captionBold: {
    ...bold,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.12,
    color: Colors.blackPrimary,
  },
  numberDisplay: {
    ...bold,
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
    letterSpacing: -1.28,
    color: Colors.blackPrimary,
  },
  numberShowcase: {
    ...bold,
    fontSize: 26,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -1.04,
    color: Colors.blackPrimary,
  },
});
