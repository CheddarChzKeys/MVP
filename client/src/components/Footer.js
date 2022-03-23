import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footerGrid">
        <div className="modernWarfareWrap footerHover">
          <img className="footerLogo" src="./icons/wzWhiteLogo.png" />
        </div>
        <div className="modernWarfareWrap footerHover">
          <img
            className="footerLogo"
            src="./icons/playstation-logotypeWhite.png"
          />
        </div>
        <div className="modernWarfareWrap footerHover">
          <img className="footerLogo" src="./icons/xboxScaledWhite.png" />
        </div>
        <div className="modernWarfareWrap footerHover">
          <img className="footerLogo" src="./icons/windowsScaledWhite.png" />
        </div>
        <div className="footerName">
          <p>&copy; JERRICK RAVELO</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
