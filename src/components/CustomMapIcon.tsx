import React from 'react';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { 
  MapPin, 
  Home, 
  Building, 
  TreePine, 
  Factory, 
  Car, 
  Users, 
  Zap, 
  Droplet,
  Flag,
  Mountain,
  Anchor,
  Truck,
  HardHat
} from 'lucide-react';

export const ICON_OPTIONS = {
  'map-pin': MapPin,
  'home': Home,
  'building': Building,
  'tree': TreePine,
  'factory': Factory,
  'car': Car,
  'users': Users,
  'zap': Zap,
  'droplet': Droplet,
  'flag': Flag,
  'mountain': Mountain,
  'anchor': Anchor,
  'truck': Truck,
  'hard-hat': HardHat,
};

export type IconName = keyof typeof ICON_OPTIONS;

interface CustomMapIconProps {
  iconName?: string;
  color?: string;
  bgColor?: string;
  size?: number;
  className?: string;
}

export function CustomMapIcon({ 
  iconName = 'map-pin', 
  color = '#ffffff', 
  bgColor = '#CE1126', 
  size = 32,
  className = '' 
}: CustomMapIconProps) {
  const IconComponent = (ICON_OPTIONS as Record<string, React.ElementType>)[iconName] || MapPin;
  
  // Renders a generic map pin shape with the chosen icon inside
  return (
    <div 
      className={`relative flex items-center justify-center drop-shadow-md ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={bgColor}
        stroke="white"
        strokeWidth="1.5"
        className="absolute inset-0 w-full h-full"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      </svg>
      <div className="absolute flex items-center justify-center" style={{ top: '15%', width: '50%', height: '50%' }}>
        <IconComponent color={color} size="100%" strokeWidth={2.5} />
      </div>
    </div>
  );
}

export function createCustomMapIcon(iconName = 'map-pin', color = '#ffffff', bgColor = '#CE1126', size = 32) {
  const html = renderToString(
    <CustomMapIcon iconName={iconName} color={color} bgColor={bgColor} size={size} />
  );
  
  return L.divIcon({
    className: 'custom-leaflet-icon bg-transparent border-none outline-none',
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}
