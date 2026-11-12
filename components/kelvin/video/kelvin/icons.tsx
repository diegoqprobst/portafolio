/** @jsxImportSource react */

// Generated from kelvin/src — edit there, then `npm run sync:kelvin`.
import type { SVGProps } from 'react';

/**
 * Kelvin's own icon set: 24-unit grid, 2-unit stroke, square caps — drawn like instrument markings.
 * Play, pause and volume are filled (outline versions read too weak at small sizes).
 */
type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconPlay = (p: IconProps) => (
  <Svg {...p}>
    {/* Optically centred: the triangle's mass sits ~1 unit right of the box centre. */}
    <path d="M8.5 5.2v13.6a.8.8 0 0 0 1.22.68l10.6-6.8a.8.8 0 0 0 0-1.36L9.72 4.52a.8.8 0 0 0-1.22.68z" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconPause = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6" y="5" width="4.25" height="14" rx="0.75" fill="currentColor" stroke="none" />
    <rect x="13.75" y="5" width="4.25" height="14" rx="0.75" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconRestart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 12a6.5 6.5 0 1 0 2-4.7" />
    <path d="M5 4.5v4h4" />
  </Svg>
);

export const IconVolume = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 9.25h3.75L12 5.25v13.5l-4.75-4H3.5z" fill="currentColor" stroke="none" />
    <path d="M15.5 9.25a4 4 0 0 1 0 5.5" />
    <path d="M18.25 6.75a7.5 7.5 0 0 1 0 10.5" />
  </Svg>
);

export const IconMute = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 9.25h3.75L12 5.25v13.5l-4.75-4H3.5z" fill="currentColor" stroke="none" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </Svg>
);

export const IconCaptionsOff = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="M10.5 10.25a2 2 0 1 0 0 3.5M17 10.25a2 2 0 1 0 0 3.5" />
  </Svg>
);

export const IconCaptionsOn = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" fill="currentColor" stroke="none" />
    <path
      d="M10.5 10.25a2 2 0 1 0 0 3.5M17 10.25a2 2 0 1 0 0 3.5"
      stroke="var(--kv-icon-knockout, #0A1027)"
    />
  </Svg>
);

/** Settings drawn as a calibrated dial rather than a generic gear. */
export const IconDial = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="13" r="6" />
    <path d="M12 13l3-3" />
    <path d="M12 3.5v1.5M4.4 7.2l1.1 1M19.6 7.2l-1.1 1M2.75 14h1.5M19.75 14h1.5" strokeWidth={1.75} />
  </Svg>
);

/** Registration marks, as on a printer's proof. */
export const IconFullscreen = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
  </Svg>
);

export const IconFullscreenExit = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" />
  </Svg>
);

export const IconLoupe = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="7" />
    <path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5" />
  </Svg>
);

export const IconNote = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 4.5h14v11l-4 4H5z" />
    <path d="M15 19.5v-4h4M8.5 9h7M8.5 12.5h4" strokeWidth={1.75} />
  </Svg>
);

export const IconClose = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const IconDownload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v10M7.5 10l4.5 4.5 4.5-4.5M5 19.5h14" />
  </Svg>
);
