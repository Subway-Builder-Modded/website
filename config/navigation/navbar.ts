import {
  BookText,
  Download,
  FolderGit2,
  Package,
  Globe,
  FileSearchCorner,
  Megaphone,
  Moon,
  Sun,
  SunMoon,
  TrainTrack,
  HeartHandshake,
  Users,
  Scale,
  Home,
  type LucideIcon,
} from 'lucide-react';
import { PROJECT_COLOR_SCHEMES } from '@/config/theme/colors';

export type NavbarPosition = 'left' | 'right';

export type NavbarItemColors = {
  light: {
    text: string;
    background: string;
  };
  dark: {
    text: string;
    background: string;
  };
};

export type NavbarModeColor = {
  light: string;
  dark: string;
};

export type NavbarMaskIcon = {
  type: 'mask';
  src: string;
};

export type NavbarImageIcon = {
  type: 'image';
  src: string;
};

export type NavbarIcon = LucideIcon | NavbarMaskIcon | NavbarImageIcon;

export type NavbarDropdownItem = {
  id: string;
  title?: string;
  href?: string;
  icon?: NavbarIcon;
  colors?: NavbarItemColors;
  color?: NavbarItemColors;
};

export type NavbarItem = {
  id: string;
  title?: string;
  href?: string;
  icon?: NavbarIcon;
  position: NavbarPosition;
  colors?: NavbarItemColors;
  color?: NavbarItemColors;
  dropdown?: NavbarDropdownItem[];
  specialStyle?: NavbarSpecialStyle;
  styleVars?: NavbarStyleVars;
};

export type NavbarSpecialStyle = {
  triggerClassName?: string;
  dropdownContentClassName?: string;
  dropdownItemClassName?: string;
  activeUnderlineClassName?: string;
};

export type NavbarStyleVars = {
  '--instance-accent-light': string;
  '--instance-accent-dark': string;
};

export type NavbarColorScheme = {
  hover?: NavbarItemColors;
  active?: NavbarItemColors;
  indicator?: NavbarModeColor;
};

export type NavbarThemeId = 'light' | 'dark' | 'system';

export type NavbarAction =
  | {
      type: 'theme';
      theme: NavbarThemeId;
    }
  | {
      type: 'none';
    };

export type AppNavbarDropdownItem = {
  id: string;
  title?: string;
  href?: string;
  activeMatchPaths?: string[];
  icon?: NavbarIcon;
  schemeId?: NavbarColorSchemeId;
  action?: NavbarAction;
};

export type AppNavbarItem = {
  id: string;
  title?: string;
  href?: string;
  icon?: NavbarIcon;
  position: NavbarPosition;
  schemeId?: NavbarColorSchemeId;
  presentation?: AppNavbarItemPresentation;
  dropdown?: AppNavbarDropdownItem[];
};

export type AppNavbarItemPresentation = {
  restingState?: 'neutral' | 'hover';
  hoverExpand?: boolean;
};

export type AppNavbarBrand = {
  title: string;
  href: string;
  icon: NavbarIcon;
};

export type AppNavbarSizing = {
  brand: {
    gap: string;
    iconSize: string;
    titleSize: string;
    titleWeight: number;
  };
  item: {
    gap: string;
    iconSize: string;
    titleSize: string;
    radius: string;
    paddingX: string;
    paddingY: string;
  };
  dropdown: {
    minWidth: string;
    itemGap: string;
    itemIconSize: string;
    itemTitleSize: string;
    itemRadius: string;
    itemPaddingX: string;
    itemPaddingY: string;
  };
};

export type AppNavbarSizes = {
  mobile: AppNavbarSizing;
  desktop: AppNavbarSizing;
};

function getProjectNavbarScheme(
  project: keyof typeof PROJECT_COLOR_SCHEMES,
): NavbarColorScheme {
  const scheme = PROJECT_COLOR_SCHEMES[project];
  const withAlpha = (hex: string, alphaHex: string) => {
    const normalized = hex.trim().replace(/^#/, '');
    if (normalized.length === 6) return `#${normalized}${alphaHex}`;
    if (normalized.length === 8) return `#${normalized.slice(0, 6)}${alphaHex}`;
    return hex;
  };

  const hoverBgLight = withAlpha(scheme.primaryColor.light, '26');
  const hoverBgDark = withAlpha(scheme.primaryColor.dark, '33');
  const activeBgLight = withAlpha(scheme.primaryColor.light, '33');
  const activeBgDark = withAlpha(scheme.primaryColor.dark, '40');

  return {
    hover: {
      light: { text: scheme.accentColor.light, background: hoverBgLight },
      dark: { text: scheme.accentColor.dark, background: hoverBgDark },
    },
    active: {
      light: { text: scheme.accentColor.light, background: activeBgLight },
      dark: { text: scheme.accentColor.dark, background: activeBgDark },
    },
    indicator: {
      light: scheme.accentColor.light,
      dark: scheme.accentColor.dark,
    },
  };
}

export const APP_NAVBAR_COLOR_SCHEMES = {
  railyard: getProjectNavbarScheme('railyard'),
  registry: getProjectNavbarScheme('registry'),
  'template-mod': getProjectNavbarScheme('template-mod'),
  website: getProjectNavbarScheme('website'),
  themeLight: {
    hover: {
      light: { text: '#B06710', background: '#FFD26055' },
      dark: { text: '#FFD260', background: '#B0671055' },
    },
    active: {
      light: { text: '#B06710', background: '#FFD26055' },
      dark: { text: '#FFD260', background: '#B0671055' },
    },
    indicator: { light: '#B06710', dark: '#FFD260' },
  },
  themeDark: {
    hover: {
      light: { text: '#4776CC', background: '#2DB7E055' },
      dark: { text: '#2DB7E0', background: '#4776CC55' },
    },
    active: {
      light: { text: '#4776CC', background: '#2DB7E055' },
      dark: { text: '#2DB7E0', background: '#4776CC55' },
    },
    indicator: { light: '#4776CC', dark: '#2DB7E0' },
  },
  themeSystem: {
    hover: {
      light: { text: '#B06710', background: '#FFD26055' },
      dark: { text: '#2DB7E0', background: '#4776CC55' },
    },
    active: {
      light: { text: '#B06710', background: '#FFD26055' },
      dark: { text: '#2DB7E0', background: '#4776CC55' },
    },
    indicator: { light: '#B06710', dark: '#2DB7E0' },
  },
} as const satisfies Record<string, NavbarColorScheme>;

export type NavbarColorSchemeId = keyof typeof APP_NAVBAR_COLOR_SCHEMES;

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
  icon: { type: 'image', src: '/logo.png' },
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
        id: 'railyard-download',
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
    icon: { type: 'mask', src: '/assets/discord.svg' },
    position: 'right',
    dropdown: [
      {
        id: 'subway-builder',
        title: 'Subway Builder',
        href: 'https://discord.gg/jrNQpbytUQ',
        icon: { type: 'image', src: '/assets/subway-builder.svg' },
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
    icon: { type: 'mask', src: '/assets/github.svg' },
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
        icon: FolderGit2,
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

export type AppNavbarConfig = {
  brand: AppNavbarBrand;
  sizes: AppNavbarSizes;
  layout: {
    mobileQuickItemIds: string[];
    rightItemIconScale: number;
  };
  items: AppNavbarItem[];
};

export const APP_NAVBAR_CONFIG: AppNavbarConfig = {
  brand: APP_NAVBAR_BRAND,
  sizes: APP_NAVBAR_SIZES,
  layout: {
    mobileQuickItemIds: ['discord', 'github', 'theme'],
    rightItemIconScale: 1.25,
  },
  items: APP_NAVBAR_ITEMS,
};
