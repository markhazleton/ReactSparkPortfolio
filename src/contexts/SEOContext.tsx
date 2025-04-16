import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import AppConfig from '../config/AppConfig';
import { SEOContext } from './SEOContextInstance';

interface SEOProviderProps {
  children: ReactNode;
  defaultTitle?: string;
  defaultDescription?: string;
  siteUrl?: string;
}

export const SEOProvider: React.FC<SEOProviderProps> = ({
  children,
  defaultTitle = AppConfig.siteTitle,
  defaultDescription = AppConfig.siteDescription,
  siteUrl = AppConfig.hostedUrl,
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const location = useLocation();

  // Update document title when title state changes
  useEffect(() => {
    document.title = title;
  }, [title]);

  // Update meta description when description state changes
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = description;
      document.head.appendChild(newMetaDescription);
    }
  }, [description]);

  // Update canonical URL when canonicalUrl state or location changes
  useEffect(() => {
    const url = canonicalUrl || `${siteUrl}${location.pathname}`;
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    
    if (linkCanonical) {
      linkCanonical.href = url;
    } else {
      linkCanonical = document.createElement('link') as HTMLLinkElement;
      linkCanonical.rel = 'canonical';
      linkCanonical.href = url;
      document.head.appendChild(linkCanonical);
    }

    // Add Open Graph meta tags
    updateOrCreateMetaTag('og:title', title);
    updateOrCreateMetaTag('og:description', description);
    updateOrCreateMetaTag('og:url', url);
    updateOrCreateMetaTag('og:type', 'website');
  }, [canonicalUrl, location.pathname, title, description, siteUrl]);

  const updateOrCreateMetaTag = (property: string, content: string) => {
    let metaTag = document.querySelector(`meta[property="${property}"]`);
    
    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', property);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    }
  };

  return (
    <SEOContext.Provider value={{ setTitle, setDescription, setCanonicalUrl }}>
      {children}
    </SEOContext.Provider>
  );
};