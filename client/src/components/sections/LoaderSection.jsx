import logo from "../../assets/logo.png";

function LoaderSection() {
  return (
    <div id="loader">
      <div className="loader-inner">
        {/* Large centered brand title */}
        <div className="loader-title-wrap">
          <h1 className="loader-title">ZENTRAX</h1>
          <div className="loader-underline" />
        </div>

        <div className="loader-bar-wrap" aria-hidden>
          <div className="loader-bar"></div>
        </div>
        <p className="loader-text">Crafting Excellence</p>
      </div>
    </div>
  );
}

export default LoaderSection;
