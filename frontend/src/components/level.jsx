import { Card, HStack, Container, Table, Thead, Tbody, Tr, Td, Th, Text, Box, CardHeader, CardBody, Grid, GridItem, CardFooter, Flex, Button, Heading, TableContainer, TableCaption, Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot, collection, doc } from "firebase/firestore";
import { CSS } from '@dnd-kit/utilities';
import { evalModel, generateData, trainModel } from '../helpers/callEndpoint';

const uid = "user_10";

function Data({activeFeatures}) {
  // listen to firestore for data
  const db = getFirestore();
  const [data, setData] = useState({});

  useEffect(() => {
    const ref = doc(collection(doc(collection(db, "Users"), uid), "FoolsGold"), "train");
    onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const docData = snapshot.data();
        const data = {};
        for (const key in docData) {
          data[key] = docData[key];
        }
        // console.log(data);
        // const data = snapshot.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data()
        // }));
        setData(data);
        // console.log(docData);
      }

    });
  }, [db]);
  let num_samples = Object.keys(data);
  if (num_samples.length === 0) {
    num_samples = 0;
  } else {
    num_samples = data[num_samples[0]].length;
  }
  const { isOver, setNodeRef } = useDroppable({
    id: 'data-droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  // console.log(activeFeatures);
  // console.log(Object.keys(data));
  const keys = Object.keys(data);
  // if(keys.length === 0){
  //   keys = activeFeatures;
  // }
  return (
    <div className="w-1/3 h-full ml-3 mr-1 border-2 border-slate-300 rounded-lg">
    <Card id="data" className="rounded-lg h-full" ref={setNodeRef} style={style}>
      <CardHeader className='text-center font-lilitaOne'>Data</CardHeader>
      <CardBody className='text-center flex flex-col justify-end items-center pb-0'>
        {/* <Text className='text-bold'>Gold v. Fool's Gold Properties</Text> */}
        {activeFeatures.length === 0 ? <div className="bg-gray-300 rounded-lg border-dashed border-black border-2 w-full h-full font-signika">Drag some features here!</div> : <></>}
        <TableContainer className='mt-0 mb-3'>
          <Table variant='simple' size="sm">
            <Tbody>
              {
                Object.keys(data).map((key) => {
                  // console.log("checking if " + key + " is in " + activeFeatures + " " + activeFeatures.includes(key.toLocaleLowerCase()));
                  if (key !== "label" && activeFeatures.includes(key)) {

                    const values = data[key];
                    // console.log(key);
                    return (
                        <Tr key={key}>
                          {/* TODO add emojis */}
                          <Td className="sticky left-0 bg-white font-signika"><Text fontWeight="bold">{key}</Text></Td>
                          {
                            values.map((value, index) => {
                              // gen random key
                              // const randomKey = Math.random();
                              return <Td key={index}><Text className="font-signika">{value}</Text></Td>
                            })
                          }
                        </Tr>
                    );
                  }
                })
              }
            </Tbody>
          </Table>

        </TableContainer>
        {activeFeatures.length > 0 ? <>
        <Button colorScheme="white" onClick={() => generateData(uid, "FoolsGold", 10, activeFeatures)} className="border-blue-800 border-2 rounded hover:bg-gray-300 font-signika"> 
        <Text className="text-blue-800">Generate Data</Text></Button>
        </> : <></>}
      </CardBody>
    </Card>
    </div>
  );
}

function Model({ model }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'model-droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div className="w-1/3 h-full border-2 ml-1 mr-1 border-slate-300 rounded-lg">
    <Card className="h-full rounded-lg" ref={setNodeRef} style={style}>
      <CardHeader className='text-center font-lilitaOne'>Model</CardHeader>
      <CardBody className='text-center '>
        {model !== undefined ? <div className="">{model}</div> : <div className="bg-gray-300 rounded-lg border-dashed border-black border-2 w-full h-full font-signika">Drag your model here!</div>}
      </CardBody>
    </Card>
    </div>
  );
}

function TrainRun({model_name, features}) {
  const [evalResult, setEvalResult] = useState(null);
  const evalModelPerf = async () => {
    const res = await evalModel(uid, "FoolsGold", model_name, features);
    console.log(res);
    setEvalResult(res.result);
  }
  const [training, setTraining] = useState(false);
  
  return (
    <div className="w-1/3 h-full ml-1 border-2 border-slate-300 rounded-lg ">
    <Card id="trainrun" className="h-full rounded-lg pb-4">
      <CardHeader className='text-center font-lilitaOne'>Train / Run</CardHeader>
      <CardBody className='text-center flex items-center h-full flex-col'>
        <div className=" h-3/4 top-0">
          <div id="visualization"></div>
          
        </div>
        {evalResult !== null ? <Text className='mb-3 font-bold text-center justify-center'>Accuracy: {Math.round(evalResult.accuracy*100)}%</Text> : <></>}

        <div className="h-1/4 align-middle flex flex-row justify-center">
          {/* <Text className='font-bold'>Train</Text> */}
          
          <Button colorScheme="white" className="mr-3 hover:bg-gray-300 border-blue-800 border-2" onClick={() => 
          async function train() {
            setTraining(true);
            trainModel(uid, "FoolsGold", model_name, features);
            await new Promise( res => setTimeout(res, 1000));
            setTraining(false);
          }
            }>
              {training ? <>Loading...</> : 
            <Text className="text-blue-800 font-signika">Train Model</Text>}</Button>
          <Button colorScheme="white" onClick={() => evalModelPerf()} className="hover:bg-gray-300 border-blue-800 border-2">
          <Text className="text-blue-800 font-signika">Run Model</Text>
          </Button>
        </div>
      </CardBody>
    </Card >
    </div>
  );
}

function FeedbackBar() {
  return (
    <div className="w-full ml-3 mr-0 mt-2 border-slate-300 border-2 rounded-lg">
    <Card className="">
      <CardHeader>
        <Heading size='md text-center justify-center'>Feedback</Heading>
      </CardHeader>
      <CardBody>
        <div className="w-full h-1000">

        </div>
      </CardBody>
    </Card>
    </div>
  );
}

function DnDBar() {
  return (
    <Tabs isFitted variant='unstyled' className="w-full border-2 border-slate-300 mt-2 ml-3 rounded-lg">
      < TabList >
        <Tab className="text-blue-800 hover:bg-gray-300">Features</Tab>
        <Tab className="text-blue-800 hover:bg-gray-300">Model</Tab>
        <Tab className="text-blue-800 hover:bg-gray-300" isDisabled>Training</Tab>
        <Tab className="text-blue-800 hover:bg-gray-300" isDisabled>Run</Tab>
      </TabList >
      <TabIndicator
        className="border-b-2 border-blue-800 text-blue-800"
      />

      <TabPanels>
        <TabPanel>
          <Grid h='200px' templateColumns='repeat(4, 1fr)' gap={4}>
            {features.map((feature) => {
              return (
                <GridItem rowSpan={1} colSpan={1}>
                  <FeatureOption key={feature} type={feature} />
                </GridItem>
              )
            })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid h='200px' templateColumns='repeat(3, 1fr)' gap={4}>
            {modelOptions.map((model) => {
              // console.log("model:", model)
              return (
                <GridItem rowSpan={1} colSpan={1}>
                  <ModelOption key={model} type={model} />
                </GridItem>
              )
            })}
          </Grid>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs >);
}

function ModelOption({ type }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: type,
  });
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;


  return (
    <Card className='m-3' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CardHeader>
        <Text className='font-bold text-blue-800'>{type}</Text>
      </CardHeader>
      {/* <CardBody>
        <Text>Model</Text>
      </CardBody> */}
    </Card>
  );
}

function FeatureOption({ type }) {
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
            // "label": labels,
            // "hardness": hardness,
            // "density": density,
            // "conductivity": conductivity,
            // "shininess": shininess,
            // "shape": shapes,
            // "texture": textures,

const modelOptions = ["Decision Tree", "Logistic Regression", "K-Nearest Neighbors"]
const features = ["Conductivity", "Density", "Hardness", "Shape", "Shininess", "Texture"]

export function Level() {
  const [isDroppedModel, setIsDroppedModel] = useState(false);
  const [activeModelId, setActiveModelId] = useState(null);
  const [model, setModel] = useState(null);
  const [isDroppedFeature, setIsDroppedFeature] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState(null);
  const [activeFeatures, setActiveFeatures] = useState([]);
  function handleDragEnd(event) {
    if (event.over && event.over.id === 'model-droppable' && modelOptions.includes(event.active.id)) {
      // console.log(event);
      setActiveModelId(event.active.id);
      setIsDroppedModel(true);
    }
    if (event.over && event.over.id === 'data-droppable' && features.includes(event.active.id) && !activeFeatures.includes(event.active.id)) {
      // console.log(event);
      setIsDroppedFeature(true);
      setActiveFeatureId(event.active.id.toLocaleLowerCase());
    }
  }
  useEffect(() => {
    console.log("in active model use effect")
    if(activeModelId !== null){
      setModel(activeModelId);
    }
  }, [activeModelId]);
  useEffect(() => {
    console.log("UPDATING ACTIVE FEATURES");
    if(activeFeatureId !== null){
      
      // console.log(activeFeatureId);
      // setActiveFeatureId(activeFeatureId);
      setActiveFeatures([...activeFeatures, activeFeatureId]);
    }
  }, [activeFeatureId]);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <h1 className='text-4xl text-center pb-10 font-lilitaOne'>Fools Gold</h1>
      <div className='w-full h-2/3 inline-flex'>
        <Box display="flex" alignItems="center" className='m-0 w-full'>
          <Data activeFeatures={activeFeatures}/>
          <Model model={isDroppedModel ? <ModelOption type={activeModelId}></ModelOption> : undefined} />
          <TrainRun model_name={model} features={activeFeatures}/>
        </Box>
      </div>
      <div className='w-full h-800 inline-flex'>
        <Box display="flex" alignItems="center" className='m-0 w-1/3 h-full inline-block'>
          <FeedbackBar />
        </Box>
        <Box display="flex" alignItems="center" className='m-0 w-2/3 h-full inline-block'>
          <DnDBar />
          {/* <Text>Select Features</Text>
        {features.map((feature) => {
          return <FeatureOption key={feature} type={feature} />
        })} */}
        </Box>
      </div>


    </DndContext>
  );
}

export {FeedbackBar};