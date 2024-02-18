import { Card, NumberInput, NumberInputField, FormHelperText, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, Text, Box, CardHeader, CardBody, Grid, GridItem, CardFooter, Flex, Button, Heading, TableContainer, TableCaption, Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, FormControl, FormLabel, Select } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { evalModel, generateData, trainModel, trainSandboxModel } from '../helpers/callEndpoint';
import { FeedbackBar } from './level';
import { drop } from 'lodash';

// A place to drop layers
function Droppable({index, layerType, dimension}){
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable-'+index,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  return (
    <div className="w-1/3 h-full">
    <Heading size='md'> {
        layerType && (
          <Text className='text-center font-lilitaOne flex items-center justify-center'>{layerType}</Text>
        )
      }</Heading>
    <Card className="rounded-lg border border-gray-100 w-full h-full" ref={setNodeRef} style={style}>
      
      <CardBody>
      {/* <Text className='text-center font-lilitaOne'>Card</Text> */}
     
      {
        layerType && (
        // <CardBody className='text-center '>
        <Text>{dimension}</Text>)
          // </CardBody>))
      }
      {/* <Text>...</Text> */}
      </CardBody>
    </Card>
    </div>
  );
}


function DroppableRow({ numDroppables, curLayers, setCurLayers }) {
  const template = `repeat(${numDroppables}, 1fr)`;
  const removeLayer = (layer) => {
    // console.log("removing feature: " + feature);
    // console.log(activeFeatures);
    const newCurLayers = curLayers.filter((f) => f !== layer);
    // console.log(newActiveFeatures);
    setCurLayers(newCurLayers);
    // const newAvailableFeatures = [...availableFeatures, feature];
    // setAvailableFeatures(newAvailableFeatures);
  }

  return (
    <Grid templateColumns={template} gap={4} style={{ minHeight: '33vh' }}>
      {Array(numDroppables).fill().map((key, index) => {
        const layerType = curLayers[index] ? curLayers[index][0] : undefined;
        const dimension = curLayers[index] ? curLayers[index][1] : undefined;

        return (
          <GridItem key={index} rowSpan={1} colSpan={1}>
            <Droppable key={index} index={index} layerType={layerType} dimension={dimension}/>
            {/* <Button size="xs" variant="outline" className='left-0 mr-1' onClick={()=>removeLayer(key)}>X</Button> */}
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
      <Tabs isFitted variant='unstyled' className="w-2/3 border-2 ml-3 border-slate-300 mt-2 rounded-lg">
      < TabList >
        <Tab className="text-blue-800 hover:bg-gray-300">Data</Tab>
        <Tab className="text-blue-800 hover:bg-gray-300">Layers</Tab>
        <Tab className="text-blue-800 hover:bg-gray-300">Training</Tab>
        <Tab className="text-blue-800 hover:bg-gray-300">Run</Tab>
      </TabList >
      <TabIndicator
        className="border-b-2 border-blue-800 text-blue-800"
      />
      <TabPanels>
      <TabPanel>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {/* Dataset Selection */}
          <GridItem>
            <FormControl mt="4">
              <FormLabel htmlFor="datasetSelect">Select Dataset:</FormLabel>
              <Select id="datasetSelect" placeholder="Select dataset">
                <option value="mnist">MNIST - Handwritten digits</option>
                <option value="cifar10">CIFAR-10 - Object Recognition in Images</option>
                <option value="fashionMNIST">Fashion MNIST - Zalando's Article Images</option>
                <option value="imagenet">ImageNet - Large Scale Visual Recognition</option>
                {/* Add more datasets as needed */}
              </Select>
            </FormControl>
          </GridItem>
          
          {/* Intentionally left blank for future use or aesthetic spacing */}
          <GridItem>
            {/* Placeholder or empty for layout purposes */}
          </GridItem>

          {/* Train-Test Split Configuration */}
          <GridItem>
            <FormControl mt="4">
              <FormLabel htmlFor="trainTestSplit">Train-Test Split:</FormLabel>
              <NumberInput id="trainTestSplit" defaultValue={80} min={1} max={99} clampValueOnBlur={false}>
                <NumberInputField />
              </NumberInput>
              <FormHelperText>Percentage of data used for training. Remaining for testing.</FormHelperText>
            </FormControl>
          </GridItem>

          {/* Batch Size Configuration */}
          <GridItem>
            <FormControl mt="4">
              <FormLabel htmlFor="batchSizeInput">Batch Size:</FormLabel>
              <NumberInput id="batchSizeInput" defaultValue={16} min={1} max={1024} clampValueOnBlur={false}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </GridItem>
        </Grid>
      </TabPanel>
      <TabPanel>
        <Grid h='200px' templateColumns='repeat(4, 1fr)' gap={4}>
            {availableLayers.map((layer) => {
              return (
                <GridItem key={layer} rowSpan={1} colSpan={1}>
                   <LayerOption key={layer} type={layer} />
                </GridItem>
              )
            })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Loss Function Selection */}
            <GridItem>
              <FormControl>
                <FormLabel htmlFor="lossFunctionSelect">Select Loss Function:</FormLabel>
                <Select id="lossFunctionSelect" placeholder="Select loss function">
                  <option value="binaryCrossEntropy">Binary Cross-Entropy (Log Loss)</option>
                  <option value="crossEntropy">Cross-Entropy Loss</option>
                  <option value="meanSquaredError">Mean Squared Error (MSE)</option>
                  <option value="meanAbsoluteError">Mean Absolute Error (MAE)</option>
                </Select>
              </FormControl>
            </GridItem>
            {/* Optimizer Selection */}
            <GridItem>
              <FormControl>
                <FormLabel htmlFor="optimizerSelect">Select Optimizer:</FormLabel>
                <Select id="optimizerSelect" placeholder="Select optimizer">
                  <option value="sgd">SGD (Stochastic Gradient Descent)</option>
                  <option value="adam">Adam</option>
                  <option value="rmsprop">RMSprop</option>
                  <option value="adagrad">Adagrad</option>
                </Select>
              </FormControl>
            </GridItem>

            {/* Epoch Number Configuration */}
            <GridItem>
              <FormControl>
                <FormLabel htmlFor="epochInput">Number of Epochs:</FormLabel>
                <NumberInput id="epochInput" defaultValue={1} min={1} max={1000} clampValueOnBlur={false}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </GridItem>

            {/* Learning Rate Configuration */}
            <GridItem>
              <FormControl>
                <FormLabel htmlFor="learningRateInput">Learning Rate:</FormLabel>
                <NumberInput id="learningRateInput" defaultValue={0.001} min={0} max={1} precision={4} step={0.0001} clampValueOnBlur={false}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </GridItem>
          </Grid>
        </TabPanel>
        <TabPanel>

        </TabPanel>
      </TabPanels>
          </Tabs>
          </>
      );
}
  
function LayerOption({ type }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: type,
  });
  const [dimensions, setDimensions] = new useState(6);
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
    <>
    <Card className='m-3 border-blue-800' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CardHeader>
        {type}
      </CardHeader>

      {/* <CardBody>
        <Text></Text>
      </CardBody> */}
    </Card>
    {
        inputLabel[type] && (
          <FormControl className='text-center'>
        <FormLabel className='ml-3 font'>Dimensions</FormLabel>
          <NumberInput max={500} min={1} onChange={(valueString) => 
          {
              console.log("ON CHANGE\n");
          setDimensions(valueString);
          }
      }
    value={dimensions} className='m-2'>
        <NumberInputField />
      </NumberInput>
      </FormControl>
        )
      }
      </>
  );

}
// convolution: kernels, linear: nodes
function trainSandbox(curLayers){
  // get rid of undefined layers
  const layers = curLayers.filter(layer => layer !== undefined);
  trainSandboxModel(layers);
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
   
    // setCurLayers([...curLayers.slice(0, droppedIndex), [layerType, 6], ...curLayers.slice(droppedIndex+1)]);

    // curLayers[0][0] = 'Input';
    // curLayers[0][1] = 6;
    // curLayers[curLayers.length - 1][0] = 'Output';
    // curLayers[curLayers.length - 1][1] = 6;

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
        // setCurLayers(['input', 6], ...curLayers.slice(1));
        // setCurLayers([...curLayers.slice(0, curLayers.length - 2)], ['Output', 6]);
      console.log("Current layers: ", curLayers);
    }, [curLayers]);
    

    return (
        <>
        <DndContext onDragEnd={handleDragEnd} className="h-screen items-stretch">
          <div className='flex justify-between items-center'>
            <div className='flex justify-center items-center w-full'>
              <h1 className='text-4xl text-center pb-10 font-lilitaOne'>Sandbox</h1>
            </div>
            <Button className='m-3' onClick={() => trainSandbox(curLayers)}>Train</Button>
          </div>
          {/* <div className='w-full h-full flex flex-col'> */}
            {/* <Box display="flex" alignItems="center" className='m-0 w-1/3 h-full inline-block'>
              <FeedbackBar />
            </Box> */}
          <Box className='flex-col  w-full h-full inline-flex'>
            <div className='h-full'>
               <DroppableRow numDroppables={numDroppables} curLayers={curLayers} setCurLayers={setCurLayers}/>
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

