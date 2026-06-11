import React from "react";

export default function ProcessCard({ Icon, title, short, onClick, style, tabIndex=0 }) {
  return (
    <button
      className="pw-card"
      onClick={onClick}
      type="button"
      style={style}
      tabIndex={tabIndex}
      aria-label={title}
    >
      <div className="pw-node" aria-hidden />
      <div className="pw-inner">
        <div className="pw-icon"><Icon size={28} /></div>
        <h3 className="pw-title">{title}</h3>
        <div className="pw-sep" />
        <p className="pw-short">{short}</p>
      </div>
    </button>
  );
}
