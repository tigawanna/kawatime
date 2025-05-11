import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  
  // Ensure backgroundColor is a string type
  const bgColor = typeof backgroundColor === 'string' ? backgroundColor : backgroundColor.level0;

  return <View style={[{ backgroundColor: bgColor }, style]} {...otherProps} />;
}
