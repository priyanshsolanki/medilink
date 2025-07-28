import React, { ImgHTMLAttributes } from 'react';
import Logo from './../../images/logo.png';
type LogoProps = ImgHTMLAttributes<HTMLImageElement>;

export default function TwilioLogo(props: LogoProps) {
  return (
    <img
      src={Logo} // ⬅️ Update this path
      alt="Custom Twilio Logo"
      width={30}
      height={30}
      {...props}
    />
  );
}
