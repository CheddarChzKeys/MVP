import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footerGrid">
        <div className="modernWarfareWrap">
          <a
            className="logoAnchor"
            href="https://www.callofduty.com/warzone"
            target="_blank"
          >
            <img className="footerLogo" src="./icons/wzWhiteLogo.png" />
          </a>
        </div>
        <div className="modernWarfareWrap">
          <a
            className="logoAnchor"
            href="https://store.playstation.com/en-us/product/UP0002-PPSA01649_00-CODWZ2BUNDLE0001"
            target="_blank"
          >
            <img
              className="footerLogo"
              src="./icons/playstation-logotypeWhite.png"
            />
          </a>
        </div>
        <div className="modernWarfareWrap">
          <a
            className="logoAnchor"
            href="https://www.xbox.com/en-US/games/call-of-duty-warzone"
            target="_blank"
          >
            <img className="footerLogo" src="./icons/xboxScaledWhite.png" />
          </a>
        </div>
        <div className="modernWarfareWrap">
          <a
            className="logoAnchor"
            href="https://us.shop.battle.net/en-us/product/call-of-duty-warzone"
            target="_blank"
          >
            <img className="footerLogo" src="./icons/windowsScaledWhite.png" />
          </a>
        </div>
        <div className="footerName">
          <a
            href="https://us.shop.battle.net/en-us/product/call-of-duty-warzone"
            target="_blank"
          >
            <p>cheddarchzkeys</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
