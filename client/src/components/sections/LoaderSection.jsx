import logo from "../../assets/logo.png";

function LoaderSection() {
  return (
    <div id="loader">
      <div className="loader-inner">
        <div className="loader-logo-bg">
          <img src={logo} alt="Zentrax" className="loader-logo" />
        </div>
        <div className="loader-bar-wrap">
          <div className="loader-bar"></div>
        </div>
        <p className="loader-text">Crafting Excellence</p>
      </div>
    </div>
  );
}

export default LoaderSection;
