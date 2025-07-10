import { Globe, Instagram, Twitter } from "lucide-react";

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getUrlIcon = (url: string) => {
  if (url.includes('instagram.com')) return Instagram;
  if (url.includes('twitter.com') || url.includes('x.com')) return Twitter;
  return Globe;
};

export const getPlatformName = (url: string): string => {
  if (url.includes('instagram.com')) return 'Instagram';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'X (Twitter)';
  if (url.includes('linkedin.com')) return 'LinkedIn';
  if (url.includes('behance.net')) return 'Behance';
  if (url.includes('dribbble.com')) return 'Dribbble';
  return new URL(url).hostname;
};