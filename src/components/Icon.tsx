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
  | 'magnifying-glass'
  | 'location-crosshairs'
  | 'clock'
  | 'calendar-days'
  | 'droplet'
  | 'star'
  | 'comment-dots'
  | 'volume-high'
  | 'stop';

interface IconProps {
  name: IconName;
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
  // Most free icons only exist in "solid", so that's the default.
  // A few (like 'star') also have an outlined "regular" version.
  variant?: 'solid' | 'regular';
}

// A wrapper around Font Awesome 6 with type-checked icon names.
export function Icon({ name, size, color, style, variant = 'solid' }: IconProps) {
  return (
    <FontAwesome6
      name={name}
      size={size}
      color={color}
      style={style}
      solid={variant === 'solid'}
      regular={variant === 'regular'}
    />
  );
}
