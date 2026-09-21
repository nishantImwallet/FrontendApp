import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'dock';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  activeOpacity?: number;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  rightIcon,
  style,
  textStyle,
  activeOpacity = 0.85,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.btnSecondary;
      case 'outline':
        return styles.btnOutline;
      case 'dock':
        return styles.btnDock;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'dock':
        return styles.textDock;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.baseBtn,
        getContainerStyle(),
        isDisabled && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? '#0070ea' : '#ffffff'}
        />
      ) : (
        <>
          {typeof icon === 'string' ? (
            <Text style={styles.iconText}>{icon}</Text>
          ) : (
            icon
          )}
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>
            {title}
          </Text>
          {typeof rightIcon === 'string' ? (
            <Text style={styles.iconText}>{rightIcon}</Text>
          ) : (
            rightIcon
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseBtn: {
    height: 52,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  btnPrimary: {
    backgroundColor: '#0059bb',
    elevation: 4,
    shadowColor: '#0059bb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
  },
  btnSecondary: {
    backgroundColor: '#eff4ff',
    borderWidth: 1,
    borderColor: 'rgba(0, 112, 234, 0.2)',
  },
  btnOutline: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#0070ea',
  },
  btnDock: {
    backgroundColor: '#0059bb',
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  baseText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
  },
  textPrimary: {
    color: '#ffffff',
  },
  textSecondary: {
    color: '#0070ea',
  },
  textOutline: {
    color: '#0070ea',
  },
  textDock: {
    color: '#ffffff',
  },
  iconText: {
    fontSize: 16,
    color: '#ffffff',
  },
});

export default AppButton;
