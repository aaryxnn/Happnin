import { Text, TextProps, TextStyle } from "react-native";

import { colors, type } from "../theme";

type Variant = keyof typeof type;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  center?: boolean;
  style?: TextStyle | TextStyle[];
};

export function Txt({ variant = "body", color = colors.text, center, style, ...props }: Props) {
  return (
    <Text
      {...props}
      style={[type[variant], { color }, center && { textAlign: "center" }, style as TextStyle]}
    />
  );
}
