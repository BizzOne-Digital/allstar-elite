// Custom SVG icon set — no emoji
const props = (extra) => ({ xmlns: "http://www.w3.org/2000/svg", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...extra });

export const IconMusic = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);
export const IconPlay = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/></svg>
);
export const IconPause = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/></svg>
);
export const IconStar = ({ size = 20, filled, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={filled ? "currentColor" : "none"}/></svg>
);
export const IconShop = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
);
export const IconCart = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61H19a2 2 0 001.99-1.81l1.5-10.79H6"/></svg>
);
export const IconUser = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
export const IconMenu = ({ size = 24, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
export const IconX = ({ size = 24, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
export const IconCheck = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><polyline points="20 6 9 17 4 12"/></svg>
);
export const IconArrowRight = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);
export const IconArrowLeft = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
);
export const IconGlobe = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
);
export const IconTrendingUp = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
export const IconShield = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
export const IconBell = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
);
export const IconMail = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);
export const IconPhone = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
);
export const IconMapPin = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
export const IconUpload = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
);
export const IconVideo = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
);
export const IconSettings = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
);
export const IconLogout = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
export const IconDollar = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
);
export const IconHeadphones = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>
);
export const IconHeart = ({ size = 20, filled, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill={filled ? "currentColor" : "none"}/></svg>
);
export const IconSearch = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
export const IconGrid = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
);
export const IconList = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);
export const IconChevronDown = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><polyline points="6 9 12 15 18 9"/></svg>
);
export const IconLock = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
);
export const IconCrown = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...r}><path d="M2 19h20v2H2zM2 5l5 7 5-5 5 5 5-7v12H2z"/></svg>
);
export const IconUsers = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
);
export const IconBarChart = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
);
export const IconPackage = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
);
export const IconMinus = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
export const IconPlus = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
export const IconTrash = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
);
export const IconEdit = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
export const IconEye = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
export const IconTwitter = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" {...r}><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
);
export const IconInstagram = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
export const IconYoutube = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
);
export const IconFacebook = ({ size = 20, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" fill="currentColor" stroke="none"/></svg>
);
export const IconSoundwave = ({ size = 24, ...r }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...props(r)}><line x1="12" y1="1" x2="12" y2="23"/><line x1="8" y1="5" x2="8" y2="19"/><line x1="4" y1="9" x2="4" y2="15"/><line x1="16" y1="5" x2="16" y2="19"/><line x1="20" y1="9" x2="20" y2="15"/></svg>
);
