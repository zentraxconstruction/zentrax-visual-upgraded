import React from "react";
import boyImg from "../../assets/boy.png";
import girlImg from "../../assets/Girl.png";

function LoaderSection() {
  return (
    <div id="loader">
      <div className="loader-inner">
        <div className="loader-logo-sequence">
          <div className="loader-title-wrap">
            <h1 className="loader-title">ZENTRAX</h1>
            <div className="loader-underline" />
          </div>

          <p className="loader-text">Crafting Excellence</p>

          <div className="loader-bar-section">
            <div className="loader-avatar">
              <img src={boyImg} alt="Left person" className="loader-avatar-img" />
            </div>

            <div className="loader-bar-wrap" aria-hidden>
              <div className="loader-bar"></div>
            </div>

            <div className="loader-avatar">
              <img src={girlImg} alt="Right person" className="loader-avatar-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoaderSection;
