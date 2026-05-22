import type { LucideIcon } from 'lucide-react-native';
import {
  Route,
  Car,
  Wrench,
  Shield,
  ShieldCheck,
  Receipt,
  FireExtinguisher,
  Cross,
  Gauge,
  Droplets,
  SquareParking,
  Fuel,
  TriangleAlert,
  IdCard,
} from 'lucide-react-native';

export const ICON_MAP: Record<string, LucideIcon> = {
  road: Route,
  car: Car,
  wrench: Wrench,
  shield: Shield,
  'shield-check': ShieldCheck,
  receipt: Receipt,
  FireExtinguisher,
  cross: Cross,
  gauge: Gauge,
  droplets: Droplets,
  'square-parking': SquareParking,
  fuel: Fuel,
  'triangle-alert': TriangleAlert,
  'id-card': IdCard,
};
