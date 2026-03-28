
import React, { useEffect } from 'react';

function GoogleAnalytics() {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=G-2XBVTERBKV`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-2XBVTERBKV', {
        user_id: 'Fernando-Founder'
      });
    `;
    document.head.appendChild(script2);
  }, []);

  return null;
}

export default GoogleAnalytics;
