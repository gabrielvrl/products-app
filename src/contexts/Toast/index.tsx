import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { IconButton } from 'components';
import { Colors, Common, Fonts } from 'styles';

interface ToastContextType {
  show: (showParameters: ShowParameter) => void;
}

interface ShowParameter {
  title: string;
  message?: string;
  position?: 'bottom' | 'top';
  isDismissible?: boolean;
  autoDismiss?: boolean;
  link?: string;
  linkText?: string;
  type?: 'information' | 'success' | 'warning' | 'without_network' | 'error';
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ShowParameter | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const toastPosition = useRef<'top' | 'bottom'>(undefined);

  const hideToast = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: toastPosition?.current === 'top' ? -150 : 150,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
      toastPosition.current = undefined;
    });
  }, [animatedValue]);

  const show = useCallback(
    (showParameters: ShowParameter) => {
      const finalToast: ShowParameter = {
        ...showParameters,
        position: showParameters.position ?? 'bottom',
        autoDismiss: showParameters.autoDismiss ?? true,
        isDismissible: showParameters.isDismissible ?? false,
        type: showParameters.type ?? 'information',
      };
      setToast(finalToast);

      toastPosition.current = finalToast.position;
      animatedValue.setValue(finalToast.position === 'top' ? -150 : 150);

      Animated.timing(animatedValue, {
        toValue: finalToast.position === 'top' ? 25 : -25,
        duration: 400,
        useNativeDriver: true,
      }).start();

      if (finalToast.autoDismiss) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => hideToast(), 5000);
      }
    },
    [animatedValue, hideToast],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const wrapper = useMemo(() => {
    const { toastContainer } = styles;
    let container: ViewStyle = toastContainer;

    if (toast?.position === 'top') {
      container = { ...container, top: 50 };
    } else {
      container = { ...container, bottom: 50 };
    }

    return container;
  }, [toast?.position]);

  const iconSource = useMemo(() => {
    let icon = require('assets/icons/toast_info.png');
    switch (toast?.type) {
      case 'error':
        icon = require('assets/icons/toast_error.png');
        break;
      case 'success':
        icon = require('assets/icons/toast_okay.png');
        break;
      case 'without_network':
        icon = require('assets/icons/toast_network.png');
        break;
    }

    return icon;
  }, [toast?.type]);

  const animation = useMemo(() => {
    return [
      wrapper,
      {
        transform: [{ translateY: animatedValue }],
      },
    ];
  }, [animatedValue, wrapper]);

  const renderContent = useCallback(() => {
    const { title, message, textContainer, alignTitleToCenter } = styles;

    return (
      <View style={[textContainer, !toast?.message && alignTitleToCenter]}>
        <Text style={title}>{toast?.title}</Text>
        {toast?.message && (
          <Text numberOfLines={2} adjustsFontSizeToFit style={message}>
            {toast?.message}
          </Text>
        )}
      </View>
    );
  }, [toast?.message, toast?.title]);

  const renderCloseButton = useCallback(() => {
    const { closeIcon, closeIconContainer } = styles;

    return (
      toast?.isDismissible && (
        <IconButton
          testID="toastCloseButtonTestID"
          onPress={hideToast}
          customStyle={closeIconContainer}
          customIconStyle={closeIcon}
          source={require('assets/icons/close.png')}
        />
      )
    );
  }, [hideToast, toast?.isDismissible]);

  const renderIcon = useCallback(() => {
    const { iconStyle } = styles;

    return <Image source={iconSource} style={iconStyle} />;
  }, [iconSource]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View testID={'containerToast'} style={animation}>
          {renderIcon()}
          {renderContent()}
          {renderCloseButton()}
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    padding: 16,
    backgroundColor: 'rgba(34, 35, 47, 0.98)',
    borderRadius: Common.radiusBase,
    shadowColor: 'rgba(0, 0, 0, 0.30)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    gap: 16,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  title: { ...Fonts.titleBody, color: Colors.white },
  message: { ...Fonts.contentBase, color: Colors.white },
  closeIcon: {
    height: 12,
    width: 12,
    tintColor: Colors.white,
  },
  closeIconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  iconStyle: { width: 40, height: 40, resizeMode: 'contain' },
  textContainer: { flex: 1, gap: 8 },
  alignTitleToCenter: { justifyContent: 'center' },
});
