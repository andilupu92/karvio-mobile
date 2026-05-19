import * as Icons from 'lucide-react-native';
import { cssInterop } from 'nativewind';


Object.keys(Icons).forEach((iconName) => {
  const Icon = (Icons as any)[iconName];

  if (Icon && (typeof Icon === 'object' || typeof Icon === 'function')) {
    cssInterop(Icon, {
      className: {
        target: 'style',
        nativeStyleToProp: {
          color: true,
          strokeWidth: true,
        },
      },
    } as any);
  }
});

export { Icons };