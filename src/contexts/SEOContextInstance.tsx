import { createContext } from 'react';

interface SEOContextProps {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCanonicalUrl: (url: string) => void;
}

export const SEOContext = createContext<SEOContextProps>({
  setTitle: () => {},
  setDescription: () => {},
  setCanonicalUrl: () => {},
});