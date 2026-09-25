import { useState, useEffect } from 'react';
import api from '../utils/api';

// Fallback values — shown until the API responds, or if it fails.
export const DEFAULT_SETTINGS = {
  contactEmail: 'info@allstarelite.com',
  contactPhone: '+1 (555) 123-4567',
  address: 'Los Angeles, CA',
  social: {
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    facebook: 'https://facebook.com',
  },
};

let cache = null;
let pending = null;
const listeners = new Set();

const merge = (s) => ({ ...DEFAULT_SETTINGS, ...s, social: { ...DEFAULT_SETTINGS.social, ...(s?.social || {}) } });

// Push fresh settings to every mounted component (used after an admin save).
export const setSiteSettings = (s) => {
  cache = merge(s);
  listeners.forEach(fn => fn(cache));
};

export const telHref = (phone) => `tel:${(phone || '').replace(/[^\d+]/g, '')}`;

export default function useSiteSettings() {
  const [settings, setSettings] = useState(cache || DEFAULT_SETTINGS);

  useEffect(() => {
    listeners.add(setSettings);
    if (!cache) {
      pending = pending || api.get('/settings')
        .then(r => setSiteSettings(r.data.settings))
        .catch(() => { pending = null; });
    }
    return () => listeners.delete(setSettings);
  }, []);

  return settings;
}
