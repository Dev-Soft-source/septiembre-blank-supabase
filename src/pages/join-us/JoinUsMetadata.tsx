
import { useEffect } from 'react';

export const JoinUsMetadata = () => {
  useEffect(() => {
    // Update meta tags for this specific page
    const updateMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    // Set Join Us specific Open Graph metadata
    updateMetaTag('og:title', 'Become a Founder – Hotel Living');
    updateMetaTag('og:description', 'The Revolution Has Come. We\'re creating a $131B market. Now offering 50 Founder Places for visionaries who want to change how we live. Apply now.');
    updateMetaTag('og:image', 'https://hotel-living.com/images/join-us.png');
    updateMetaTag('og:url', 'https://hotel-living.com/join-us');

    // Cleanup function to restore original meta tags when leaving the page
    return () => {
      updateMetaTag('og:title', 'Hotel-Living');
      updateMetaTag('og:description', 'Extended stay hotels with flexible booking options');
      updateMetaTag('og:image', 'https://hotel-living.com/og-preview.jpg');
      updateMetaTag('og:url', 'https://hotel-living.com/');
    };
  }, []);

  return null;
};
