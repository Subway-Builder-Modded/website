import {
  BookText,
  Download,
  FileSearchCorner,
  Globe,
  HeartHandshake,
  Home,
  Megaphone,
  Moon,
  Package,
  Scale,
  Sun,
  SunMoon,
  TrainTrack,
  Users,
  Database,
  ChartLine,
  TrendingUp,
} from 'lucide-react';
import type {
  AppNavbarBrand,
  AppNavbarConfig,
  AppNavbarItem,
  AppNavbarSizes,
} from '@/config/navigation/navbar.types';

export const APP_NAVBAR_SIZES: AppNavbarSizes = {
  mobile: {
    brand: {
      gap: '0.4rem',
      iconSize: '1.25rem',
      titleSize: '1.07rem',
      titleWeight: 750,
    },
    item: {
      gap: '0.3rem',
      iconSize: '0.9em',
      titleSize: '0.82rem',
      radius: '0.65rem',
      paddingX: '0.3rem',
      paddingY: '0.4rem',
    },
    dropdown: {
      minWidth: '13.25rem',
      itemGap: '0.4rem',
      itemIconSize: '0.95em',
      itemTitleSize: '0.8rem',
      itemRadius: '0.7rem',
      itemPaddingX: '0.65rem',
      itemPaddingY: '0.5rem',
    },
  },
  desktop: {
    brand: {
      gap: '0.52rem',
      iconSize: '1.72rem',
      titleSize: '1.1rem',
      titleWeight: 800,
    },
    item: {
      gap: '0.4rem',
      iconSize: '0.95em',
      titleSize: '0.75rem',
      radius: '0.65rem',
      paddingX: '0.55rem',
      paddingY: '0.4rem',
    },
    dropdown: {
      minWidth: '13.5rem',
      itemGap: '0.4rem',
      itemIconSize: '0.95em',
      itemTitleSize: '0.8rem',
      itemRadius: '0.7rem',
      itemPaddingX: '0.7rem',
      itemPaddingY: '0.5rem',
    },
  },
};

export const APP_NAVBAR_BRAND: AppNavbarBrand = {
  title: 'Subway Builder Modded',
  href: '/',
  icon: 'logo',
};

export const APP_NAVBAR_ITEMS: AppNavbarItem[] = [
  {
    id: 'railyard',
    title: 'Railyard',
    href: '/railyard',
    icon: TrainTrack,
    position: 'left',
    schemeId: 'railyard',
    dropdown: [
      {
        id: 'railyard-home',
        title: 'Download',
        href: '/railyard',
        icon: Download,
        schemeId: 'railyard',
      },
      {
        id: 'railyard-browse',
        title: 'Browse',
        href: '/railyard/browse',
        activeMatchPaths: ['/railyard/mods', '/railyard/maps'],
        icon: FileSearchCorner,
        schemeId: 'railyard',
      },
      {
        id: 'railyard-docs',
        title: 'Docs',
        href: '/railyard/docs',
        icon: BookText,
        schemeId: 'railyard',
      },
      {
        id: 'railyard-updates',
        title: 'Updates',
        href: '/railyard/updates',
        icon: Megaphone,
        schemeId: 'railyard',
      },
    ],
  },
  {
    id: 'registry',
    title: 'Registry',
    href: '/registry',
    icon: Database,
    position: 'left',
    schemeId: 'registry',
    dropdown: [
      {
        id: 'registry-home',
        title: 'Analytics',
        href: '/registry',
        icon: ChartLine,
        schemeId: 'registry',
      },
      {
        id: 'registry-trending',
        title: 'Trending',
        href: '/registry/trending',
        icon: TrendingUp,
        schemeId: 'registry',
      },
      {
        id: 'registry-world-map',
        title: 'World Map',
        href: '/registry/world-map',
        icon: Globe,
        schemeId: 'registry',
      },
    ],
  },
  {
    id: 'template-mod',
    title: 'Template Mod',
    href: '/template-mod',
    icon: Package,
    position: 'left',
    schemeId: 'template-mod',
    dropdown: [
      {
        id: 'template-mod-home',
        title: 'Home',
        href: '/template-mod',
        icon: Home,
        schemeId: 'template-mod',
      },
      {
        id: 'template-mod-docs',
        title: 'Docs',
        href: '/template-mod/docs',
        icon: BookText,
        schemeId: 'template-mod',
      },
      {
        id: 'template-mod-updates',
        title: 'Updates',
        href: '/template-mod/updates',
        icon: Megaphone,
        schemeId: 'template-mod',
      },
    ],
  },
  {
    id: 'website',
    title: 'Website',
    href: '/website',
    icon: Globe,
    position: 'left',
    schemeId: 'website',
    dropdown: [
      {
        id: 'website-home',
        title: 'Analytics',
        href: '/website',
        icon: ChartLine,
        schemeId: 'website',
      },
    ],
  },
  {
    id: 'community',
    href: 'https://discord.gg/syG9YHMyeG',
    icon: HeartHandshake,
    position: 'right',
    dropdown: [
      { id: 'credits', title: 'Credits', href: '/credits', icon: Users },
      { id: 'license', title: 'License', href: '/license', icon: Scale },
    ],
  },
  {
    id: 'discord',
    href: 'https://discord.gg/syG9YHMyeG',
    icon: 'discord',
    position: 'right',
    dropdown: [
      {
        id: 'subway-builder',
        title: 'Subway Builder',
        href: 'https://discord.gg/jrNQpbytUQ',
        icon: 'subway-builder',
      },
      {
        id: 'subway-builder-modded',
        title: 'Subway Builder Modded',
        href: 'https://discord.gg/syG9YHMyeG',
        icon: TrainTrack,
      },
    ],
  },
  {
    id: 'github',
    href: 'https://github.com/Subway-Builder-Modded',
    icon: 'github',
    position: 'right',
    dropdown: [
      {
        id: 'github-railyard',
        title: 'Railyard',
        href: 'https://github.com/Subway-Builder-Modded/railyard',
        icon: TrainTrack,
        schemeId: 'railyard',
      },
      {
        id: 'github-registry',
        title: 'Registry',
        href: 'https://github.com/Subway-Builder-Modded/The-Railyard',
        icon: Database,
        schemeId: 'registry',
      },
      {
        id: 'github-template-mod',
        title: 'Template Mod',
        href: 'https://github.com/Subway-Builder-Modded/template-mod',
        icon: Package,
        schemeId: 'template-mod',
      },
      {
        id: 'github-website',
        title: 'Website',
        href: 'https://github.com/Subway-Builder-Modded/website',
        icon: Globe,
        schemeId: 'website',
      },
    ],
  },
  {
    id: 'theme',
    icon: SunMoon,
    position: 'right',
    dropdown: [
      {
        id: 'theme-light',
        title: 'Light',
        icon: Sun,
        schemeId: 'themeLight',
        action: { type: 'theme', theme: 'light' },
      },
      {
        id: 'theme-dark',
        title: 'Dark',
        icon: Moon,
        schemeId: 'themeDark',
        action: { type: 'theme', theme: 'dark' },
      },
      {
        id: 'theme-system',
        title: 'System',
        icon: SunMoon,
        schemeId: 'themeSystem',
        action: { type: 'theme', theme: 'system' },
      },
    ],
  },
];

export const APP_NAVBAR_CONFIG: AppNavbarConfig = {
  brand: APP_NAVBAR_BRAND,
  sizes: APP_NAVBAR_SIZES,
  layout: {
    mobileQuickItemIds: ['discord', 'github', 'theme'],
    rightItemIconScale: 1.15,
  },
  items: APP_NAVBAR_ITEMS,
};
