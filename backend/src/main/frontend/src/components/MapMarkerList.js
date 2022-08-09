import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

import "./MapMarkerList.css";
import { red } from "@mui/material/colors";

const columnsFromBackend = {};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function MapMarkerList() {
  const store = useSelector((state) => state);
  const pins = store.PinList.pinList;
  const [columns, setColumns] = useState(columnsFromBackend);
  let items = [
    { id: uuid(), content: "First task" },
    { id: uuid(), content: "Second task" },
    { id: uuid(), content: "Third task" },
  ];

  useEffect(() => {
    setColumns({
      [uuid()]: {
        name: "최종선택",
        items: [],
      },
      [uuid()]: {
        name: "후보",
        items: items,
      },
    });
  }, []);
  return (
    <div className="mapmarkerlist">
      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          <div className="hi" style={{backgroundColor: "#202225"}}>
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div
                  style={{
                    backgroundColor: "#202225", // 리스트 박스 글자색
                    color: "#e2e3e4", // 리스트 박스(최종선택, 후보) 글자색
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: 470,
                  }}
                  key={columnId}
                >
                  <h2>{column.name}</h2>
                  <div style={{ margin: 2 }}>
                    <Droppable droppableId={columnId} key={columnId}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            className="mapMarkerSelect"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "#2f3136" // 리스트 드래그 했을때 배경 색
                                : "#202225", // 리스트 배경색
                              // color: "red",
                              padding: 4,
                              width: 200,
                              minHeight: 360,
                              maxHeight: 360,
                              overflow: "auto",
                            }}
                          >
                            {column.items.map((item, index) => {
                              return (
                                <Draggable
                                  key={item.id}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          userSelect: "none",
                                          // padding: 16,
                                          margin: "0 0 8px 0",
                                          minHeight: "40px",
                                          backgroundColor: snapshot.isDragging
                                            ? "#5865f2" // 리스트 드래그 했을때 색 // 후보색 5865f2, 3ba55d, DDE0E5
                                            : "#42464d", // 리스트 색  // 후보색 42464d, DDE0E5, 3ba55d
                                          color: snapshot.isDragging
                                            ? "#e2e3e4" // 리스트 드래그 했을때 글자색 // e2e3e4
                                            : "#e2e3e4", // 리스트 글자 색
                                          borderRadius: 10,
                                          marginTop: 5,
                                          marginLeft: 5,
                                          paddingTop: 5,
                                          paddingLeft: 10,
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        {item.content}
                                      </div>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default MapMarkerList;
