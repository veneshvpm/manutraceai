import React from 'react';
import { IndustryType } from '../../types';

interface IndustryVisualIconProps {
  type?: IndustryType | 'factory' | 'dataset' | 'machinery';
  size?: number;
  className?: string;
}

export const IndustryVisualIcon: React.FC<IndustryVisualIconProps> = ({
  type = 'factory',
  size = 24,
  className = ''
}) => {
  switch (type) {
    case 'factory':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Industrial Factory Complex with Chimneys, Sawtooth Roof, Steam Plumes, and Gear */}
          <path
            d="M2 21H22M2 21V10L7 13.5V10L12 13.5V6H17V13.5L22 10V21H2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Windows / Bays */}
          <path d="M5 17H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M15 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Chimney Steam Plumes */}
          <path
            d="M13.5 3C13.5 3 14 2 15 2C16 2 16.5 3 16.5 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14 4.5C14 4.5 14.5 3.8 15.2 3.8C16 3.8 16.5 4.5 16.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'automotive':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Automotive Precision Chassis / Vehicle Silhouette */}
          <path
            d="M3 13L5.5 6.5C5.8 5.6 6.6 5 7.5 5H16.5C17.4 5 18.2 5.6 18.5 6.5L21 13M3 13V18C3 18.6 3.4 19 4 19H5M21 13V18C21 18.6 20.6 19 20 19H19M3 13H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="16.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
          <path d="M7 10H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'electronics':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Semiconductor Microchip & PCB Tracks */}
          <rect x="5" y="5" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
          <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 1V5M15 1V5M9 19V23M15 19V23M1 9H5M1 15H5M19 9H23M19 15H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'pharmaceutical':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Laboratory Flask & BioTech Molecule */}
          <path
            d="M9 3H15M10 3V8.5L4.5 18C3.8 19.2 4.7 21 6.1 21H17.9C19.3 21 20.2 19.2 19.5 18L14 8.5V3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M7 15H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );

    case 'food':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Food Processing & Packaging Canister */}
          <path
            d="M5 6C5 4.9 8.1 4 12 4C15.9 4 19 4.9 19 6V18C19 19.1 15.9 20 12 20C8.1 20 5 19.1 5 18V6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M19 12C19 13.1 15.9 14 12 14C8.1 14 5 13.1 5 12" stroke="currentColor" strokeWidth="1.8" />
          <path d="M19 6C19 7.1 15.9 8 12 8C8.1 8 5 7.1 5 6" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );

    case 'textile':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Technical Fiber Spool & Weave Loom */}
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M4 9H20M4 15H20M9 4V20M15 4V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'machinery':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Industrial Gear / Cogwheel with Telemetry Core */}
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'dataset':
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Industrial Data Ingestion Stream: Factory + Incoming Telemetry Data Layers */}
          <path
            d="M3 17V8L7 11V8L11 11V5H15V11L19 8V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 21L12 14M12 14L9 17M12 14L15 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 21H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
