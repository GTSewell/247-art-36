import { ArtistProfileFormData } from "../types";

export const formatProfileData = (profileData: any): Partial<ArtistProfileFormData> => {
  return {
    name: profileData.name || '',
    bio: profileData.bio || '',
    highlight_bio: profileData.highlight_bio || '',
    specialty: profileData.specialty || '',
    city: profileData.city || '',
    country: profileData.country || '',
    techniques: Array.isArray(profileData.techniques) ? profileData.techniques.join(', ') : (profileData.techniques || ''),
    styles: Array.isArray(profileData.styles) ? profileData.styles.join(', ') : (profileData.styles || ''),
    profileImage: profileData.profile_image || '',
    social_platforms: Array.isArray(profileData.social_platforms) 
      ? profileData.social_platforms.map((platform: any) => {
          if (typeof platform === 'object' && platform.url) {
            return platform.url;
          }
          return typeof platform === 'string' ? platform : '';
        }).filter(Boolean)
      : []
  };
};

export const formatManualInstagramData = (profileData: any, manualData: any): Partial<ArtistProfileFormData> => {
  return {
    name: profileData.name || manualData.name || '',
    bio: profileData.bio || manualData.bio || '',
    highlight_bio: profileData.highlight_bio || '',
    specialty: profileData.specialty || '',
    city: profileData.city || '',
    country: profileData.country || '',
    techniques: Array.isArray(profileData.techniques) ? profileData.techniques.join(', ') : (profileData.techniques || ''),
    styles: Array.isArray(profileData.styles) ? profileData.styles.join(', ') : (profileData.styles || ''),
    profileImage: profileData.profile_image || manualData.profile_image || '',
    social_platforms: Array.isArray(profileData.social_platforms) 
      ? profileData.social_platforms.map((platform: any) => {
          if (typeof platform === 'object' && platform.url) {
            return platform.url;
          }
          return typeof platform === 'string' ? platform : '';
        }).filter(Boolean)
      : manualData.social_platforms || []
  };
};

export const getEnhancedErrorMessage = (error: any, validUrls: string[]): string => {
  let errorMessage = error.message;
  if (error.message.includes('non-2xx status code') || error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
    // Check if it's actually a social media platform
    const isSocialMedia = validUrls.some(url => 
      url.includes('instagram.com') || 
      url.includes('twitter.com') || 
      url.includes('x.com') ||
      url.includes('facebook.com')
    );
    
    const isLinkInBio = validUrls.some(url =>
      url.includes('linktr.ee') ||
      url.includes('solo.to') ||
      url.includes('bio.link') ||
      url.includes('beacons.ai')
    );
    
    if (isSocialMedia) {
      errorMessage = 'Social media profiles (Instagram, X/Twitter, Facebook) cannot be automatically analyzed due to privacy restrictions. Please try using:\n\n• Personal website URLs\n• Portfolio sites (Behance, Dribbble)\n• LinkedIn profiles\n• Art gallery websites';
    } else if (isLinkInBio) {
      errorMessage = 'Link-in-bio services (solo.to, Linktree, etc.) may block automated access. Please try:\n\n• Using your direct website URL instead\n• Portfolio sites (Behance, Dribbble)\n• LinkedIn profile\n• Individual social platform URLs if accessible';
    } else {
      errorMessage = `Unable to access one or more of the provided URLs. This could be due to:\n\n• Website blocking automated requests\n• Temporary server issues\n• Network connectivity problems\n\nPlease try:\n• Checking if the URLs are publicly accessible\n• Using different portfolio or website URLs\n• Trying again in a few minutes\n\nURLs attempted: ${validUrls.join(', ')}`;
    }
  }
  return errorMessage;
};