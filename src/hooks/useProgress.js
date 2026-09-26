import { useContext } from 'react';
import { ProgressContext } from '../context/progressContext.js';

export default function useProgress() {
  const context = useContext(ProgressContext);

  if (context === null) {
    throw new Error('useProgress must be used inside a ProgressProvider');
  }
  return context;
}