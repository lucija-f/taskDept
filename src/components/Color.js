import React from "react";
import "../App.css";

export default function Color(props) {
  return (
    <div className="color-container">
      <p style={{ color: props.hexColor, fontWeight: props.fontWeight }}>
        {props.hexColor}
      </p>
    </div>
  );
}
