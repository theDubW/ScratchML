import { Card, HStack, Container, Table, Thead, Tbody, Tr, Td, Th, Text, Box, CardHeader, CardBody, Grid, GridItem, CardFooter, Flex, Button, Heading, TableContainer, TableCaption, Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot, collection, doc } from "firebase/firestore";
import { CSS } from '@dnd-kit/utilities';
import { evalModel, generateData, trainModel } from '../helpers/callEndpoint';
import { FeedbackBar } from './level';

// A place to drop layers
function Droppable({index, layerType, dimension}){
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable-'+index,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  return (
    <Box className="rounded-lg min-h-28 min-w-28 border border-gray-100" ref={setNodeRef} style={style}>
      {/* <Text className='text-center font-lilitaOne'>Card</Text> */}
      {
        layerType && (
          <Text className='text-center font-lilitaOne flex items-center justify-center'>{layerType}</Text>
        )
      }
      {
        layerType && (
        // <CardBody className='text-center '>
        <Text>Dimension: {dimension}</Text>)
          // </CardBody>))
      }
    </Box>
  );
}


function DroppableRow({numDroppables, curLayers}) {
  return (
    <Grid templateColumns='repeat(8, 1fr)' gap={4}>
      {Array(numDroppables).fill().map((_, index) => {
        const layerType = curLayers[index] ? curLayers[index][0] : undefined;
        return (
          <GridItem key={index} rowSpan={1} colSpan={1}>
            <Droppable key={index} index={index} layerType={layerType}/>
          </GridItem>
        )
      })}
    </Grid>
  );

}

// conv layer (conv) number output dim
// linear layer (linear) number output dim

function LayerBank({availableLayers}) {
    return (
        <Grid templateColumns='repeat(4, 1fr)' gap={4}>
              {availableLayers.map((layer) => {
                return (
                  <GridItem key={layer} rowSpan={1} colSpan={1}>
                    <LayerOption key={layer} type={layer} />
                  </GridItem>
                )
              })}
        </Grid>
      );
}
  
function LayerOption({ type }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: type,
  });
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <Card className='m-3 border-blue-800' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CardHeader>
        <Text className='font-bold text-blue-800'>{type}</Text>
      </CardHeader>
      {/* <CardBody>
        <Text></Text>
      </CardBody> */}
    </Card>
  );

}

const layers = ["Input", "Convolutional", "Linear", "Output"]

export default function Sandbox() {
    // const [isDroppedLayer, setIsDroppedLayer] = useState(false);
    // const [activeLayerId, setActiveLayerId] = useState(null);
    // const [activeLayers, setActiveLayers] = useState([]);
    const [availableLayers, setAvailableLayers] = useState(layers);
    const numDroppables = 8;
    //array of tuples of [(layerType, dimension)]
    const [curLayers, setCurLayers] = useState(Array(numDroppables).fill(undefined));
    

    function handleDragEnd(event) {
      const droppedId = event.active.id;
      const layerType = droppedId.split("-")[0];
      console.log("Layer type: ", layerType);
      if (event.over && layers.includes(layerType)) {
        console.log("Dropped over: ", event.over.id);
        // setActiveLayerId(event.active.id);
        // setIsDroppedLayer(true);
        // determine index of dropped layer
        const droppedIndex = parseInt(event.over.id.split("-")[1]);
        console.log("Dropped index: ", droppedIndex);
        // add layer to current layers
        setCurLayers([...curLayers.slice(0, droppedIndex), [layerType, 6], ...curLayers.slice(droppedIndex)]);
      }
    }

    useEffect(() => {
      console.log("Current layers: ", curLayers);
    }, [curLayers]);
    return (
        <DndContext onDragEnd={handleDragEnd} className="h-screen">
          <h1 className='text-4xl text-center pb-10 font-lilitaOne'>Sandbox</h1>
          <div className='w-full h-full flex flex-col'>
            {/* <Box display="flex" alignItems="center" className='m-0 w-1/3 h-full inline-block'>
              <FeedbackBar />
            </Box> */}
            <Box className='flex flex-col justify-center items-center h-full w-full'>
              <DroppableRow numDroppables={numDroppables} curLayers={curLayers}/>
              <LayerBank availableLayers={availableLayers}/>
              {/* <Text>Select Features</Text>
            {features.map((feature) => {
              return <FeatureOption key={feature} type={feature} />
            })} */}
            </Box>
          </div>
        </DndContext>
    )
};

