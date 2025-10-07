
import React from 'react';

const ShipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18.75v-3.75m16.5 3.75v-3.75m-16.5 0L12 3.75l8.25 11.25M3.75 15H20.25" />
  </svg>
);

export default ShipIcon;
