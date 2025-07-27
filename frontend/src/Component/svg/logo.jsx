const XSvg = (props) => (
 <svg width="300" height="250" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg" {...props}>
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#93ede1" />
      <stop offset="50%" stopColor="#a855f7" />
      <stop offset="100%" stopColor="#2dd4bf" />
    </linearGradient>
  </defs>

  {/* <!-- Hexa Maze Outline --> */}
  <g fill="none" stroke="url(#logoGradient)" strokeWidth="6">
    {/* <!-- Outer hexagon --> */}
    <polygon points="150,30 230,80 230,170 150,220 70,170 70,80,50" />

    {/* <!-- Maze lines --> */}
    <line x1="150" y1="30" x2="150" y2="220" />
    <line x1="70" y1="80" x2="230" y2="170" />
    <line x1="70" y1="170" x2="230" y2="80" />
    <line x1="50" y1="220" x2="50" y2="30" />
  </g>

  {/* <!-- Text --> */}
  {/* <text x="150" y="240" fontFamily="Poppins, sans-serif" fontSize="32" fill="#ffffff" textAnchor="middle" letterSpacing="2">
    Tweex
  </text> */}
</svg>

);
export default XSvg;