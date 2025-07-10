
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArtistProfileFormData } from "../types";
import { fetchArtistProfile } from "../api/artistProfileAPI";
import { mapArtistToFormData } from "../utils/formDataMapper";
import { logger } from "@/utils/logger";

export const useFetchArtistProfile = (artistId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState<any>(null);
  const [formData, setFormData] = useState<ArtistProfileFormData>({
    name: "",
    specialty: "",
    bio: "",
    highlight_bio: "",
    profileImage: "",
    backgroundImage: "",
    city: "",
    country: "",
    techniques: "",
    styles: "",
    social_platforms: [""],
    image: null,
    published: false
  });
  
  useEffect(() => {
    // If artist ID is specifically set to "demo", fetch the Demo Artist (id: 25)
    if (artistId === "demo") {
      fetchDemoArtistProfileData();
    } else if (artistId) {
      fetchArtistProfileData();
    } else {
      // For new artist, just set loading to false
      setLoading(false);
    }
  }, [artistId]);
  
  const fetchDemoArtistProfileData = async () => {
    try {
      setLoading(true);
      
      // Always fetch artist with ID 25 (Demo Artist) for demo accounts
      logger.info("Fetching Demo Artist profile (ID: 25)");
      const { data, error } = await fetchArtistProfile("25");
      
      if (error) {
        throw error;
      }
      
      if (data) {
        logger.info("Demo Artist profile data retrieved:", data);
        setArtist(data);
        
        // Map API data to form data
        const mappedFormData = mapArtistToFormData(data);
        logger.info("Mapped form data for Demo Artist:", mappedFormData);
        setFormData(mappedFormData);
      }
    } catch (error: any) {
      logger.error("Error fetching Demo Artist profile:", error);
      toast.error(`Failed to load Demo Artist profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchArtistProfileData = async () => {
    try {
      setLoading(true);
      
      if (!artistId) {
        throw new Error("Artist ID not found");
      }
      
      logger.info("Fetching artist profile for artist ID:", artistId);
      const { data, error } = await fetchArtistProfile(artistId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        logger.info("Artist profile data retrieved:", data);
        // If artist profile exists, load it
        setArtist(data);
        
        // Map API data to form data
        const mappedFormData = mapArtistToFormData(data);
        logger.info("Mapped form data:", mappedFormData);
        setFormData(mappedFormData);
      }
    } catch (error: any) {
      logger.error("Error fetching artist profile:", error);
      toast.error(`Failed to load artist profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    artist,
    formData,
    setFormData
  };
};
