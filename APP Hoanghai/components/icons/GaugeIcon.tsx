
import React from 'react';

const GaugeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-9a2.25 2.25 0 0 1 2.25-2.25Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V15m0 0H9.75M12 15h2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25c.338 0 .664.025.986.072v-1.588a2.25 2.25 0 0 0-2.25-2.25h-6a2.25 2.25 0 0 0-2.25 2.25v1.588c.322-.047.648-.072.986-.072h7.5Z" />
  </svg>
);

export default GaugeIcon;
