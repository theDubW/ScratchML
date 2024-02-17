import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import "./DndElements.scss";

/**
 * Your Component
 */


const droppables = [
    { id: "data" },
    { id: "model" },
    { id: "training" },
    { id: "run" },
]


// {(provided) => (
//     <ul class="dropList" ref={provided.innerRef} {...provided.droppableProps}>
//         {droppables.map(({ id }, index) => {
//             console.log(id);
//             return (
//                 <Draggable key={id} draggableId={id} index={index}>
//                     {(provided) => (
//                         <li key={id} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
//                             <div>
//                                 {id}
//                             </div>
//                         </li>)}
//                 </Draggable>
//             );
//         })}
//         {provided.placeholder}
//     </ul>
// )}
const Card = () => {

    return (
        <DragDropContext>
            <Droppable key="droppable" droppableId="droppable">
                {(provided, snapshot) =>
                    <Draggable key="id" draggableId="id">
                        <p>Drag Me</p>
                    </Draggable>
                }
            </Droppable>
        </DragDropContext>
    )
};

export default Card;