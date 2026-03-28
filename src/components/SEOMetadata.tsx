
import { useEffect } from 'react';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEOMetadata = ({ 
  title = "Hotel-Living", 
  description = "Extended stay hotels with flexible booking options",
  image = "https://hotel-living.com/lovable-uploads/196fbc5f-2216-4260-8bf8-b2a995873de4.png",
  url = "https://hotel-living.com/"
}: SEOMetadataProps) => {
  useEffect(() => {
    // Update meta tags dynamically
    const updateMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`) || 
                   document.querySelector(`meta[name="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('fb:')) {
          metaTag.setAttribute('property', property);
        } else {
          metaTag.setAttribute('name', property);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    // Update Open Graph tags with proper image attributes
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:image:secure_url', image);
    updateMetaTag('og:image:url', image);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:site_name', 'Hotel-Living');
    updateMetaTag('og:image:width', '1200');
    updateMetaTag('og:image:height', '630');
    updateMetaTag('og:image:type', 'image/png');
    updateMetaTag('og:image:alt', description);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:image:alt', description);
    updateMetaTag('twitter:site', '@Hotel-Living');
    updateMetaTag('twitter:creator', '@Hotel-Living');

    // Update general meta tags
    updateMetaTag('description', description);
    updateMetaTag('image', image);

    // Update document title
    document.title = title;

    // Add structured data for better social sharing
    const structuredDataScript = document.getElementById('structured-data');
    if (structuredDataScript) {
      structuredDataScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Hotel-Living",
      "description": description,
      "url": url,
      "logo": image,
      "image": image,
      "sameAs": [
        url
      ]
    });
    document.head.appendChild(script);
  }, [title, description, image, url]);

  return null;
};
