import { useContext } from 'react';
import { SEOContext } from './SEOContextInstance';

export const useSEO = () => useContext(SEOContext);