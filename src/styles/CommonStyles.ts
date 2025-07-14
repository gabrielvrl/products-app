import { StyleSheet } from 'react-native';

import { Colors } from 'styles';

export const CommonStyles = StyleSheet.create({
  flex1: { flex: 1 },
  screenContainer: {
    margin: 24,
    gap: 32,
  },
  sectionContainer: {
    gap: 20,
  },
  subSectionContainer: {
    gap: 14,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnSpaceBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    gap: 24,
  },
  bottomContainerForBottomTab: {
    position: 'absolute',
    bottom: 48,
    left: 24,
    right: 24,
    gap: 24,
  },
  paddingBottomForScrollView: { paddingBottom: 80 },
  marginHorizontal24: { marginHorizontal: 24 },
  marginTop24: { marginTop: 24 },
});
