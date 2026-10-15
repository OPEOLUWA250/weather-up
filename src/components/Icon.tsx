import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StyleProp, TextStyle } from 'react-native';

// Every Font Awesome icon the app uses. Browse more at https://fontawesome.com/search?ic=free
// Listing them here means TypeScript catches typos like 'clowd' (the raw
// FontAwesome6 component is typed as `any`, so it can't check names itself).
export type IconName =
  | 'sun'
  | 'moon'
  | 'cloud-sun'
  | 'cloud-moon'
  | 'cloud'
  | 'smog'
  | 'cloud-rain'
  | 'cloud-sun-rain'
  | 'cloud-moon-rain'
  | 'cloud-showers-heavy'
  | 'snowflake'
  | 'cloud-bolt'
  | 'temperature-half'
  | 'triangle-exclamation'
  | 'magnifying-glass';

interface IconProps {
  name: IconName;
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

// A wrapper around Font Awesome 6 that always uses the "solid" style,
// because most free weather icons only exist in solid.
export function Icon({ name, size, color, style }: IconProps) {
  return <FontAwesome6 name={name} size={size} color={color} style={style} solid />;
}
