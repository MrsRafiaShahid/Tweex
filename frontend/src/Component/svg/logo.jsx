const XSvg = (props) => (
  <svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93ede1" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#2dd4bf" />
      </linearGradient>
    </defs>
    
    <g fill="none" stroke="url(#logoGradient)" strokeWidth="6">
      <polygon points="150,30 230,80 230,170 150,220 70,170 70,80" />
      <line x1="150" y1="30" x2="150" y2="220" />
      <line x1="70" y1="80" x2="230" y2="170" />
      <line x1="70" y1="170" x2="230" y2="80" />
    </g>
  </svg>
);
export default XSvg