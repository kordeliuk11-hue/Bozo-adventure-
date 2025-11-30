import React from 'react';

interface PixelatedTextProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Qualify JSX with the React namespace to resolve the "Cannot find namespace 'JSX'" error.
  as?: keyof React.JSX.IntrinsicElements;
}

const PixelatedText: React.FC<PixelatedTextProps> = ({ children, className = '', as = 'p' }) => {
  const Component = as;
  return (
    <Component
      className={`text-[#0f380f] ${className}`}
      style={{
        textShadow: '2px 2px 0px #9bbc0f, -2px -2px 0px #306230',
      }}
    >
      {children}
    </Component>
  );
};

export default PixelatedText;