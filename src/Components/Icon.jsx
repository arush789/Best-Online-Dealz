import React from "react";

const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  external: <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" /></>,
  link: <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
  check: <path d="m5 12 5 5 9-10" />,
};

export default function Icon({ name, size = 20, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

/** The BODZ mark: a hang tag with a ₹ notch. */
export function BrandTag({ className = "brand-tag" }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M4 8a4 4 0 0 1 4-4h14.3a4 4 0 0 1 2.8 1.2l10.7 10.7a4 4 0 0 1 0 5.6L21.5 35.8a4 4 0 0 1-5.6 0L5.2 25.1A4 4 0 0 1 4 22.3Z"
        fill="var(--hot)"
        stroke="var(--line-strong)"
        strokeWidth="2.4"
      />
      <circle cx="12" cy="12" r="3" fill="var(--paper)" stroke="var(--line-strong)" strokeWidth="2" />
      <path d="M17 18.5h9M17 22h9M20.5 18.5c3 0 3 5-1 5l5 5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
