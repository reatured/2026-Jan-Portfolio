import type { SiteConfig } from '../types';
import dataJson from './data.json';

export const siteConfig: SiteConfig = dataJson.site as unknown as SiteConfig;
