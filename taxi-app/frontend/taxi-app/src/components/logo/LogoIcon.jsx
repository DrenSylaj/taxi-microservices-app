// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 * import { ThemeMode } from 'config';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();
  const logoIconDark = '/fake-taxi-seeklogo.png';
  const logoIcon = '/fake-taxi-seeklogo.png';

  return (
  
     
     <img src={logoIconDark} alt="Mantis" width="100" />
     
//      */
// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
//   <circle cx="150" cy="150" r="140" fill="#244AA5"/>
  
//   <rect x="10" y="210" width="280" height="40" fill="#FFCC00"/>
  
//   <g fill="#FFFFFF">
//     <circle cx="70" cy="70" r="8"/>
//     <circle cx="100" cy="50" r="8"/>
//     <circle cx="135" cy="40" r="8"/>
//     <circle cx="170" cy="40" r="8"/>
//     <circle cx="205" cy="50" r="8"/>
//     <circle cx="235" cy="70" r="8"/>
//   </g>
  
//   <path d="M70,160 L70,180 L90,180 L100,200 L200,200 L210,180 L230,180 L230,160 
//            C230,140 210,130 190,130 L110,130 C90,130 70,140 70,160 Z" fill="#FFFFFF"/>
  
//   <path d="M110,130 L90,160 L110,160 L120,140 Z" fill="#244AA5"/>
//   <path d="M190,130 L210,160 L190,160 L180,140 Z" fill="#244AA5"/>
  
//   <circle cx="100" cy="180" r="15" fill="#333333"/>
//   <circle cx="100" cy="180" r="8" fill="#666666"/>
//   <circle cx="200" cy="180" r="15" fill="#333333"/>
//   <circle cx="200" cy="180" r="8" fill="#666666"/>
  
//   <text x="150" y="155" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#244AA5">TAXI</text>
  
//   <path d="M150,95 L158,110 L142,110 Z" fill="#FFCC00"/>
//   <circle cx="150" cy="85" r="12" fill="#FFCC00"/>
// </svg>
  );
}
