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
      gap: '0.5rem',
      iconSize: '1.6rem',
      titleSize: '1.15rem',
      titleWeight: 750,
    },
    item: {
      gap: '0.4rem',
      iconSize: '1em',
      titleSize: '0.88rem',
      radius: '0.65rem',
      paddingX: '0.55rem',
      paddingY: '0.45rem',
    },
    dropdown: {
      minWidth: '13.25rem',
      itemGap: '0.45rem',
      itemIconSize: '1em',
      itemTitleSize: '0.84rem',
      itemRadius: '0.7rem',
      itemPaddingX: '0.7rem',
      itemPaddingY: '0.55rem',
    },
  },
  desktop: {
    brand: {
      gap: '0.6rem',
      iconSize: '1.85rem',
      titleSize: '1.2rem',
      titleWeight: 800,
    },
    item: {
      gap: '0.45rem',
      iconSize: '1em',
      titleSize: '0.8rem',
      radius: '0.65rem',
      paddingX: '0.6rem',
      paddingY: '0.45rem',
    },
    dropdown: {
      minWidth: '13.5rem',
      itemGap: '0.45rem',
      itemIconSize: '1em',
      itemTitleSize: '0.84rem',
      itemRadius: '0.7rem',
      itemPaddingX: '0.75rem',
      itemPaddingY: '0.55rem',
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
        id: 'railyard-world-map',
        title: 'World Map',
        href: '/railyard/world-map',
        icon: Globe,
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
    rightItemIconScale: 1.25,
  },
  items: APP_NAVBAR_ITEMS,
};
