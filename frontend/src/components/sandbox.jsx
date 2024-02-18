import { Card, NumberInput, NumberInputField, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, Text, Box, CardHeader, CardBody, Grid, GridItem, CardFooter, Flex, Button, Heading, TableContainer, TableCaption, Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, FormControl, FormLabel, Select } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot, collection, doc } from "firebase/firestore";
import { CSS } from '@dnd-kit/utilities';
import { evalModel, evalSandboxModel, generateData, trainModel, trainSandboxModel } from '../helpers/callEndpoint';
import { FeedbackBar } from './level';
import { drop } from 'lodash';
import Sand from '../sand.png';


const inputLabel = {
  "Convolutional": "Kernels",
  "Linear": "Nodes",
  "Input": undefined,
  "Output": undefined
};

// A place to drop layers
function Droppable({index, layerType, params, setParams}){
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable-'+index,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  const [inputVal, setInputVal] = useState();
  useEffect(() => {
    if (layerType) {
      const newParams = [...params];
      newParams[index] = inputVal;
      setParams(newParams);
    }
  }, [inputVal]);
  console.log("Layer type: ", layerType);
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
        <FormControl className='text-center'>
          
          <FormLabel className='ml-3 font'>{inputLabel[layerType]}</FormLabel>
          {
            (layerType[0] === "Convolutional" || layerType[0] === "Linear") && (
              
              <NumberInput max={500} min={1} className='m-2' onChange={(e, n)=>{
                  setInputVal(n);
              }}>
                
              <NumberInputField />
              </NumberInput>
            )
          }
          {
            layerType[0] === "Input" && (
              <Select placeholder="Select Data" onChange={(e) => {setInputVal(e.target.value)}} >
                <option value="mnist">MNIST - Handwritten digits</option>
                <option value="cifar10">CIFAR-10 - Object Recognition in Images</option>
                <option value="fashionMNIST">Fashion MNIST - Zalando's Article Images</option>
                <option value="imagenet">ImageNet - Large Scale Visual Recognition</option>
            </Select>
            )
          }
            
        </FormControl>
        )
      }
      {/* <Text>...</Text> */}
      </CardBody>
    </Card>
  );
}


function DroppableRow({ numDroppables, curLayers, params, setParams }) {
  const template = `repeat(${numDroppables}, 1fr)`;
  
  return (
    <Grid templateColumns={template} gap={4} style={{ minHeight: '33vh' }}>
      {Array(numDroppables).fill().map((_, index) => {
        const layerType = curLayers[index] ? curLayers[index] : undefined;
        // const dimension = curLayers[index] ? curLayers[index][1] : undefined;
        return (
          <GridItem key={index} rowSpan={1} colSpan={1}>
            <Droppable key={index} index={index} layerType={layerType} params={params} setParams={setParams}/>
          </GridItem>
        );
      })}
    </Grid>
  );
}
// conv layer (conv) number output dim
// linear layer (linear) number output dim

function LayerBank({availableLayers, outputVal}) {
    return (
      <Tabs isFitted variant='unstyled' className="w-full border-2 border-slate-300 mt-2 ml-3 rounded-lg">
      < TabList >
        <Tab className="text-blue-800 hover:bg-gray-300">Layers</Tab>
        <Tab className="text-blue-800 hover:bg-gray-300">Results</Tab>
      </TabList >
      <TabIndicator
        className="border-b-2 border-blue-800 text-blue-800"
      />

      <TabPanels>
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

          <Flex direction="column">
            {/* ... */}
            {/* BEGIN: ed8c6549bwf9 */}
            <Text>{outputVal ? "Accuracy: "+ outputVal["accuracy"] : ""}</Text>
            <Text>{outputVal ? "Loss: "+ outputVal["loss"] : ""}</Text>
            {/* END: ed8c6549bwf9 */}
          </Flex>

        </TabPanel>
      </TabPanels>
    </Tabs >
        // <Grid templateColumns='repeat(4, 1fr)' gap={4}>
        //       {availableLayers.map((layer) => {
        //         return (
        //           <GridItem key={layer} rowSpan={1} colSpan={1}>
        //             <LayerOption key={layer} type={layer} />
        //           </GridItem>
        //         )
        //       })}
        // </Grid>
      );
}
  
function LayerOption({ type }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: type,
  });
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const [inputVal, setInputVal] = useState(6);
  
  return (
    <Card className='m-3 border-blue-800' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CardHeader>
        {type}
      </CardHeader>
        {/* {
          inputLabel[type] && (
            
          )
        } */}
        

      {/* <CardBody>
        <Text></Text>
      </CardBody> */}
    </Card>
  );

}
// convolution: kernels, linear: nodes
function trainSandbox(curLayers, params){
  // get rid of undefined layers
  const layers = curLayers.filter(layer => layer !== undefined);

  trainSandboxModel("user_10", layers, params);
}

function evalSandbox(curLayers, setOutputVal) {
  const layers = curLayers.filter(layer => layer !== undefined);
  evalSandboxModel("user_10", "sandbox", "mnist", "Cross Entropy").then((data) => {
    const res = data["result"];
    console.log("Result: ", res);
    console.log("Accuracy: ", res["accuracy"]);
    console.log("Loss: ", res["loss"]);
    setOutputVal(res);
  });
}


const layers = ["Input", "Convolutional", "Linear", "Output"];


export default function Sandbox() {
    // const [isDroppedLayer, setIsDroppedLayer] = useState(false);
    // const [activeLayerId, setActiveLayerId] = useState(null);
    // const [activeLayers, setActiveLayers] = useState([]);
    const [availableLayers, setAvailableLayers] = useState(layers);
    const numDroppables = 8;
    //array of tuples of [(layerType, dimension)]
    const [curLayers, setCurLayers] = useState(Array(numDroppables).fill(undefined));
    const [selectedLayer, setSelectedLayer] = useState(null);
    const [params, setParams] = useState(Array(numDroppables).fill(undefined));
    const [outputVal, setOutputVal] = useState(16);
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
        if (droppedIndex > 0 && curLayers[droppedIndex-1] && curLayers[droppedIndex-1] === "Convolutional") {
          if (layerType !== "Convolutional" && layerType !== "Linear") {
            return;
          }
        }
        // following linear layer, can be linear or output
        if (droppedIndex > 0 && curLayers[droppedIndex-1] && curLayers[droppedIndex-1] === "Linear") {
          if (layerType !== "Linear" && layerType !== "Output") {
            return;
          }
        }

        setCurLayers([...curLayers.slice(0, droppedIndex), [layerType], ...curLayers.slice(droppedIndex+1)]);
        
      }
    }

    useEffect(() => {
      console.log("Current layers: ", curLayers);
    }, [curLayers]);
    
    useEffect(() => {
      console.log("Params: ", params);
    }, [params]);
    return (
      <>
        <DndContext onDragEnd={handleDragEnd} className="h-screen items-stretch">
          <div className='flex justify-between items-center'>
            <div className='flex justify-center items-center w-full'>
              <h1 className='text-4xl text-center pb-10 font-lilitaOne'>Sandbox</h1>
            </div>
            <Button className='m-3' onClick={() => trainSandbox(curLayers, params)}>Train</Button>
            <Button className='m-3' onClick={() => evalSandbox(curLayers, setOutputVal)}>Evaluate</Button>
          </div>
          {/* <div className='w-full h-full flex flex-col'> */}
            {/* <Box display="flex" alignItems="center" className='m-0 w-1/3 h-full inline-block'>
              <FeedbackBar />
            </Box> */}
          <Box className='flex-col  w-full h-full inline-flex'>
            <div className='h-full mx-5'>
               <DroppableRow numDroppables={numDroppables} curLayers={curLayers} params={params} setParams={setParams}/>
            </div>
            <div className=''>
              <LayerBank availableLayers={availableLayers} outputVal={outputVal}/>
            </div>
          </Box>   
        {/* </div> */}
        
        </DndContext>
        <img className="fixed bottom-0 left-0 w-full h-auto transform translate-y-20" src={Sand} alt="sand"/>
        </>
        
    )
};

