import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArtistProfileFormData } from "../types";
import { isValidUrl, getPlatformName } from "./utils";

export const useAutoProfileGeneration = (
  onProfileGenerated: (profileData: Partial<ArtistProfileFormData>) => void,
  artistId: string | null,
  onShowSaveModal?: () => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const generateProfile = async (urls: string[]) => {
    const validUrls = urls.filter(url => url.trim() && isValidUrl(url.trim()));
    
    if (validUrls.length === 0) {
      toast.error('Please enter at least one valid URL');
      return;
    }

    setIsGenerating(true);
    setTotalSteps(validUrls.length + 2); // URLs + AI generation + formatting
    setCurrentStep(0);
    setGenerationProgress('🚀 Starting enhanced profile generation...');

    try {
      // Simulate progress updates for each URL
      for (let i = 0; i < validUrls.length; i++) {
        setCurrentStep(i + 1);
        const url = validUrls[i];
        const platform = getPlatformName(url);
        
        setGenerationProgress(`🔍 Reading your ${platform} profile...`);
        await new Promise(resolve => setTimeout(resolve, 800)); // Visual delay for UX
      }

      setCurrentStep(totalSteps - 1);
      setGenerationProgress('🎨 Crafting your professional artist profile...');

      const { data, error } = await supabase.functions.invoke('auto-generate-profile', {
        body: {
          urls: validUrls,
          artistId
        }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate profile');
      }

      setCurrentStep(totalSteps);
      setGenerationProgress('✨ Finalizing your profile...');

      const { profileData } = data;
      
      // Convert the AI response to our form data format with enhanced mapping
      const formattedData: Partial<ArtistProfileFormData> = {
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

      onProfileGenerated(formattedData);
      
      // Enhanced success message with detailed results
      const filledFields = Object.values(formattedData).filter(value => {
        if (!value) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      }).length;
      
      toast.success(`🎉 Profile generated successfully! Filled ${filledFields} fields from ${data.processedUrls} of ${data.totalUrls} URLs.`);
      
      // Show save modal if callback is provided
      if (onShowSaveModal) {
        onShowSaveModal();
      }
    } catch (error: any) {
      console.error('Error generating profile:', error);
      
      // Enhanced error message for better user experience
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
      
      toast.error(`Failed to generate profile: ${errorMessage}`, {
        duration: 8000,
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
      setCurrentStep(0);
      setTotalSteps(0);
    }
  };

  const generateFromInstagram = async () => {
    setIsGenerating(true);
    setTotalSteps(3); // Connect + Fetch + Generate
    setCurrentStep(0);
    setGenerationProgress('🔗 Connecting to your Instagram account...');

    try {
      setCurrentStep(1);
      setGenerationProgress('📸 Analyzing your Instagram content...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      setCurrentStep(2);
      setGenerationProgress('🎨 Generating your professional profile...');

      const { data, error } = await supabase.functions.invoke('instagram-profile-generator', {
        body: { userId: user.id }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate profile from Instagram');
      }

      setCurrentStep(3);
      setGenerationProgress('✨ Finalizing your Instagram-powered profile...');

      const { profileData } = data;
      
      // Convert the AI response to our form data format
      const formattedData: Partial<ArtistProfileFormData> = {
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

      onProfileGenerated(formattedData);
      
      toast.success(`🎉 Profile generated from Instagram! Analyzed ${data.posts_analyzed} posts to create your professional profile.`);
      
      // Show save modal if callback is provided
      if (onShowSaveModal) {
        onShowSaveModal();
      }
    } catch (error: any) {
      console.error('Error generating profile from Instagram:', error);
      
      let errorMessage = error.message;
      if (error.message.includes('No Instagram connection found')) {
        errorMessage = 'Please connect your Instagram account first to use this feature.';
      }
      
      toast.error(`Failed to generate profile from Instagram: ${errorMessage}`, {
        duration: 8000,
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
      setCurrentStep(0);
      setTotalSteps(0);
    }
  };

  return {
    isGenerating,
    generationProgress,
    currentStep,
    totalSteps,
    generateProfile,
    generateFromInstagram,
    generateFromManualInstagram: async (manualData: any) => {
      setIsGenerating(true);
      setTotalSteps(2); // Manual data processing + AI generation
      setCurrentStep(0);
      setGenerationProgress('📝 Processing your manual Instagram data...');

      try {
        setCurrentStep(1);
        setGenerationProgress('🎨 Creating your AI-enhanced profile...');

        // Use the manual Instagram data directly with AI enhancement
        const { data, error } = await supabase.functions.invoke('auto-generate-profile', {
          body: {
            manualInstagramData: manualData,
            artistId
          }
        });

        if (error) {
          throw error;
        }

        if (!data.success) {
          throw new Error(data.error || 'Failed to generate profile from manual Instagram data');
        }

        setCurrentStep(2);
        setGenerationProgress('✨ Finalizing your Instagram-powered profile...');

        const { profileData } = data;
        
        // Convert the AI response to our form data format
        const formattedData: Partial<ArtistProfileFormData> = {
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

        onProfileGenerated(formattedData);
        
        toast.success('🎉 Profile generated from your Instagram data! AI enhanced your manual input to create a professional profile.');
        
        // Show save modal if callback is provided
        if (onShowSaveModal) {
          onShowSaveModal();
        }
      } catch (error: any) {
        console.error('Error generating profile from manual Instagram data:', error);
        
        let errorMessage = error.message;
        
        toast.error(`Failed to generate profile: ${errorMessage}`, {
          duration: 8000,
        });
      } finally {
        setIsGenerating(false);
        setGenerationProgress('');
        setCurrentStep(0);
        setTotalSteps(0);
      }
    }
  };
};