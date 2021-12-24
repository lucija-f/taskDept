import React, { useState, useEffect } from "react";
import Color from "./Color";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../App.css";

let colorListSet = new Set();

export default function Content() {
  const url = `https://www.colr.org/json/color/random?query&timestamp=${new Date().getTime()}`;
  const [color, setColor] = useState();
  const [orderedColorSet, setOrderedColorSet] = useState(colorListSet);
  const [btnText, setBtnText] = useState("COLOR");

  const styles = {
    color: color,
    borderColor: color,
  };

  useEffect(() => {
    getNewColor();
  }, []);

  function getNewColor() {
    axios
      .get(url)
      .then((rez) => {
        colorListSet.add(`#${rez.data.new_color}`);
        setColor(`#${rez.data.new_color}`);
        setOrderedColorSet(colorListSet);
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

  return (
    <div className="content-div">
      <button className="btn-color" onClick={getNewColor} style={styles}>
        {btnText}
      </button>
      <div className="dragContext">
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
      <input
        type="text"
        placeholder="write your text ..."
        onChange={(event) => setBtnText(event.target.value)}
      />
    </div>
  );
}
