import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { colors, type } from '@/theme';

type Variant = keyof typeof type;

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
}

export function Text({ variant = 'body', color = colors.textPrimary, center, style, ...rest }: TextProps) {
  return (
    <RNText
      {...rest}
      style={[type[variant], { color }, center && { textAlign: 'center' }, style]}
    />
  );
}
