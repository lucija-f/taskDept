import React, { useState, useEffect } from "react";
import Color from "./Color";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../App.css";
import { Scrollbars } from "react-custom-scrollbars";

let colorListSet = new Set();
const reg = new RegExp("^#[a-fA-F0-9]{6}$");

export default function Content() {
  const url = `https://www.colr.org/json/color/random?query&timestamp=${new Date().getTime()}`;
  const [color, setColor] = useState();
  const [orderedColorSet, setOrderedColorSet] = useState(colorListSet);
  const [btnText, setBtnText] = useState("COLOR");
  const [visibility, setVisibility] = useState("hidden");

  const buttonStyle = {
    color: color,
    borderColor: color,
  };

  const validationStyle = {
    visibility: visibility,
  };

  useEffect(() => {
    getNewColor();
  }, []);

  function getNewColor() {
    axios
      .get(url)
      .then((rez) => {
        // if (rez.data.new_color) {
        colorListSet.add(`#${rez.data.new_color}`);
        setColor(`#${rez.data.new_color}`);
        setOrderedColorSet(colorListSet);
        // } else console.log(rez);
      })
      .catch((error) => console.log(error));
  }

  const colorsList = Array.from(orderedColorSet).map((item, index) => {
    let weight = item === color ? "900" : "200";

    return (
      <Draggable
        draggableId={`draggable-${item}`}
        key={`draggable-${item}`}
        index={index}
      >
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Color key={item} hexColor={item} fontWeight={weight} />
          </div>
        )}
      </Draggable>
    );
  });

  function onDragEnd(result) {
    const items = [...orderedColorSet];
    const [newOrderedColors] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, newOrderedColors);

    setOrderedColorSet(new Set(items));
    colorListSet = new Set(items);
  }

  function handleKeyPress(event) {
    if (event.charCode === 13) {
      validateInput(event.target.value);
      event.target.value = "";
    }
  }

  function validateInput(value) {
    if (!reg.test(value)) {
      setVisibility("visible");
    } else {
      setVisibility("hidden");
      colorListSet.add(value);
      setColor(value);
      setOrderedColorSet(colorListSet);
    }
  }

  return (
    <div className="content-div">
      <button className="btn-color" onClick={getNewColor} style={buttonStyle}>
        {btnText}
      </button>
      <input
        type="text"
        placeholder="write your button text ..."
        onChange={(event) => setBtnText(event.target.value)}
      />

      <Scrollbars style={{ width: "auto", height: 200 }}>
        <div className="drag-context">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="vertical" type="row">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {colorsList}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </Scrollbars>
      <div className="input-validatin-container">
        <input
          type="text"
          placeholder="write your color in HEX ..."
          onKeyPress={handleKeyPress}
          maxLength="7"
          required
        />
        <p className="errorMsg" style={validationStyle}>
          Please insert valid HEX color code
        </p>
      </div>
    </div>
  );
}
