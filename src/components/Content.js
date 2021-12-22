import React, { useState } from "react";
import axios from "axios";
import "../App.css";

let listOfColors = new Set();

export default function Content() {
  const url = `https://www.colr.org/json/color/random?query&timestamp=${new Date().getTime()}`;
  const [color, setColor] = useState("#FF0000");
  const [btnText, setBtnText] = useState("COLOR");

  const styles = {
    color: color,
  };

  function getNewColor() {
    axios
      .get(url)
      .then((rez) => {
        console.log(rez.data.new_color);
        listOfColors.add(color);
        setColor(`#${rez.data.new_color}`);
        console.log(listOfColors);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="content-div">
      <button className="btn-color" onClick={getNewColor} style={styles}>
        {btnText}
      </button>
      <input
        type="text"
        placeholder="write your text ..."
        onChange={(event) => setBtnText(event.target.value)}
      />
    </div>
  );
}
