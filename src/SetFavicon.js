import React, { useEffect } from 'react';
import logoSVG from './images/logo.svg';  // Adjust the path to where your logo.svg is located

const SetFavicon = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'icon';
    link.href = logoSVG;
    document.head.appendChild(link);
  }, []);

  return null;  // This component does not render anything
};

export default SetFavicon;
