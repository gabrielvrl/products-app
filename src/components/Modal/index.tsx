import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Modal as RNModal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { Button, IconButton, TextWithTag } from 'components';
import { Colors, Common, Fonts } from 'styles';

export interface IModal {
  title?: string;
  imageSource?: ImageSourcePropType;
  imageStyle?: ImageStyle;
  message?: string;
  isVisible?: boolean;
  buttonOneText?: string;
  buttonTwoText?: string;
  children?: React.ReactNode;
  animationTiming?: number;
  shouldRenderCloseButton?: boolean;
  testID?: string;
  customStyle?: ViewStyle;
  variant?: 'regular' | 'bottom' | 'top';
  onButtonOnePress?: () => void;
  onButtonTwoPress?: () => void;
  onBackdropPress?: () => void;
}

const Modal: React.FC<IModal> = ({
  title,
  imageSource,
  imageStyle,
  message,
  isVisible = false,
  buttonOneText,
  buttonTwoText,
  children,
  animationTiming = 300,
  shouldRenderCloseButton = false,
  testID,
  variant = 'regular',
  customStyle,
  onButtonOnePress = () => {},
  onButtonTwoPress = () => {},
  onBackdropPress = () => {},
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(
    new Animated.Value(variant === 'top' ? -300 : 300),
  ).current;

  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animationTiming,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animationTiming,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: animationTiming,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: variant === 'top' ? -300 : 300,
          duration: animationTiming,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    }
  }, [isVisible, scaleAnim, slideAnim, animationTiming, variant]);

  const renderCloseButton = useCallback(() => {
    const { iconStyle, closeButtonContainer } = styles;

    return (
      <View style={closeButtonContainer} testID="modalCloseButton">
        {shouldRenderCloseButton && (
          <IconButton
            testID="ModalCloseButton"
            source={require('../../assets/icons/close.png')}
            onPress={onBackdropPress}
            customIconStyle={iconStyle}
            variant="base"
            backgroundColor={Colors.lightGray}
          />
        )}
      </View>
    );
  }, [onBackdropPress, shouldRenderCloseButton]);

  const renderButtons = useCallback(() => {
    const { buttonsContainer } = styles;

    return (
      <View style={buttonsContainer}>
        {buttonOneText && (
          <Button
            title={buttonOneText}
            variant="primary"
            onPress={onButtonOnePress}
          />
        )}
        {buttonTwoText && (
          <Button
            title={buttonTwoText}
            variant="minimal"
            onPress={onButtonTwoPress}
          />
        )}
      </View>
    );
  }, [buttonOneText, buttonTwoText, onButtonOnePress, onButtonTwoPress]);

  const containerStyle = useMemo(() => {
    const { modalContentBottom, modalContentRegular, modalContentTop } = styles;

    switch (variant) {
      case 'regular':
        return { ...modalContentRegular, ...customStyle };
      case 'bottom':
        return { ...modalContentBottom, ...customStyle };
      case 'top':
        return { ...modalContentTop, ...customStyle };
    }
  }, [customStyle, variant]);

  const transform = useMemo(() => {
    return variant === 'regular'
      ? [{ scale: scaleAnim }]
      : [{ translateY: slideAnim }];
  }, [scaleAnim, slideAnim, variant]);

  const { backdrop, titleText, messageText, image, imageContainer } = styles;

  return (
    <RNModal
      testID={testID}
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onBackdropPress}
    >
      <TouchableWithoutFeedback
        testID="modalBackDrop"
        onPress={onBackdropPress}
      >
        <View style={backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[containerStyle, { transform }]}>
        {renderCloseButton()}
        {imageSource && (
          <View style={imageContainer}>
            <Image style={[image, imageStyle]} source={imageSource} />
          </View>
        )}
        {title && <TextWithTag text={title} style={titleText} />}
        {message && <TextWithTag text={message} style={messageText} />}
        {children && <View>{children}</View>}
        {renderButtons()}
      </Animated.View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentRegular: {
    backgroundColor: Colors.white,
    borderRadius: Common.radiusLarge,
    padding: 24,
    left: 24,
    right: 24,
    position: 'absolute',
    top: Common.screenHeight * 0.25,
  },
  modalContentTop: {
    backgroundColor: Colors.white,
    borderRadius: Common.radiusLarge,
    padding: 24,
    left: 24,
    right: 24,
    position: 'absolute',
    top: 50,
  },
  modalContentBottom: {
    backgroundColor: Colors.white,
    width: '100%',
    borderTopLeftRadius: Common.radiusLarge,
    borderTopRightRadius: Common.radiusLarge,
    padding: 24,
    position: 'absolute',
    bottom: 0,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  titleText: {
    ...Fonts.titleSection,
    color: Colors.blackAbsolute,
    marginBottom: 8,
  },
  messageText: {
    ...Fonts.contentBase,
    color: Colors.grayBase,
    marginBottom: 12,
  },
  buttonsContainer: {
    marginTop: 12,
  },
  iconStyle: {
    width: 12,
    height: 12,
    tintColor: Colors.primaryDarkColor,
  },
  image: {
    width: 120,
    height: 120,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default Modal;
