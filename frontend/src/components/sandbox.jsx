import { Card, NumberInput, NumberInputField, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, Text, Box, CardHeader, CardBody, Grid, GridItem, CardFooter, Flex, Button, Heading, TableContainer, TableCaption, Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, FormControl, FormLabel, Select } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import Sand from '../sand.png';

// A place to drop layers
function Droppable({index, layerType, dimension}){
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable-'+index,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  return (
    <Card className="rounded-lg border border-gray-100 w-full h-full" ref={setNodeRef} style={style}>
      <Heading size='md'> {
        layerType && (
          <Text className='text-center font-lilitaOne flex items-center justify-center'>{layerType}</Text>
        )
      }</Heading>
      <CardBody>
      {/* <Text className='text-center font-lilitaOne'>Card</Text> */}
     
      {
        layerType && (
        // <CardBody className='text-center '>
        <Text>Dimension: {dimension}</Text>)
          // </CardBody>))
      }
      {/* <Text>...</Text> */}
      </CardBody>
    </Card>
  );
}


function DroppableRow({ numDroppables, curLayers }) {
  const template = `repeat(${numDroppables}, 1fr)`;

  return (
    <Grid templateColumns={template} gap={4} style={{ minHeight: '33vh' }}>
      {Array(numDroppables).fill().map((_, index) => {
        const layerType = curLayers[index] ? curLayers[index][0] : undefined;
        const dimension = curLayers[index] ? curLayers[index][1] : undefined;

        return (
          <GridItem key={index} rowSpan={1} colSpan={1}>
            <Droppable key={index} index={index} layerType={layerType} dimension={dimension} />
          </GridItem>
        );
      })}
    </Grid>
  );
}
// conv layer (conv) number output dim
// linear layer (linear) number output dim

function LayerBank({availableLayers}) {
    return (
      <>
      <Heading className="font-lilitaOne text-center">
        Layers
      </Heading>
          <Grid h='200px' templateColumns='repeat(4, 1fr)' gap={4}>
            {availableLayers.map((layer) => {
              return (
                <GridItem key={layer} rowSpan={1} colSpan={1}>
                   <LayerOption key={layer} type={layer} />
                </GridItem>
              )
            })}
          </Grid>
          </>
      );
}
  
function LayerOption({ type }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: type,
  });
  const [dimensions, setDimensions] = new useState(6);
  const format = (val) => `$` + val;
  const parse = (val) => val.replace(/^\$/, '');
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;
  const inputLabel = {
    "Convolutional": "Kernels",
    "Linear": "Nodes",
    "Input": undefined,
    "Output": undefined
  }
  return (
    <Card className='m-3 border-blue-800' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CardHeader>
        {type}
      </CardHeader>
      
        {
          inputLabel[type] && (
            <FormControl className='text-center'>
          <FormLabel className='ml-3 font'>Dimensions</FormLabel>
            <NumberInput max={500} min={1} onChange={(valueString) => 
            {
                console.log("ON CHANGE\n");
            setDimensions(parse(valueString));
            }
        }
      value={format(dimensions)} className='m-2'>
          <NumberInputField />
        </NumberInput>
        </FormControl>
          )
        }
        

      {/* <CardBody>
        <Text></Text>
      </CardBody> */}
    </Card>
  );

}
// convolution: kernels, linear: nodes

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
        // check business logic
        // nothing can preceed input layer:
        if(layerType === "Input" && droppedIndex > 0) {
          return;
        }
        if (droppedIndex === 0 && layerType !== "Input") {
          return;
        }
        // following convolutional layer, can be convolutional or linear
        if (droppedIndex > 0 && curLayers[droppedIndex-1] && curLayers[droppedIndex-1][0] === "Convolutional") {
          if (layerType !== "Convolutional" && layerType !== "Linear") {
            return;
          }
        }
        // following linear layer, can be linear or output
        if (droppedIndex > 0 && curLayers[droppedIndex-1] && curLayers[droppedIndex-1][0] === "Linear") {
          if (layerType !== "Linear" && layerType !== "Output") {
            return;
          }
        }

        setCurLayers([...curLayers.slice(0, droppedIndex), [layerType, 6], ...curLayers.slice(droppedIndex+1)]);
        
      }
    }

    useEffect(() => {
      console.log("Current layers: ", curLayers);
    }, [curLayers]);
    return (
        <>
        <DndContext onDragEnd={handleDragEnd} className="h-screen items-stretch">
          <h1 className='text-4xl text-center font-lilitaOne'>Sandbox</h1>
          {/* <div className='w-full h-full flex flex-col'> */}
            {/* <Box display="flex" alignItems="center" className='m-0 w-1/3 h-full inline-block'>
              <FeedbackBar />
            </Box> */}
          <Box className='flex-col  w-full h-full inline-flex'>
            <div className='h-full'>
               <DroppableRow numDroppables={numDroppables} curLayers={curLayers}/>
            </div>
            <div className=''>
              <LayerBank availableLayers={availableLayers}/>
            </div>
          </Box>   
        {/* </div> */}
        </DndContext>
        <img src={Sand} alt="sand"/>
        </>
    )
};

