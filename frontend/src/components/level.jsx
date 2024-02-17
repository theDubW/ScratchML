import { Card, HStack, Container, Table, Thead, Tbody, Tr, Td, Th, Text, Box, CardHeader, CardBody, Grid, GridItem, CardFooter, Flex, Button, Heading, TableContainer, TableCaption, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot, collection, doc } from "firebase/firestore";
import { CSS } from '@dnd-kit/utilities';
import { evalModel, generateData, trainModel } from '../helpers/callEndpoint';

const uid = "user_10";

function Data({activeFeatures, setActiveFeatures, availableFeatures, setAvailableFeatures}) {
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
  // }\
  const removeFeature = (feature) => {
    console.log("removing feature: " + feature);
    console.log(activeFeatures);
    const newActiveFeatures = activeFeatures.filter((f) => f !== feature);
    console.log(newActiveFeatures);
    setActiveFeatures(newActiveFeatures);
    const newAvailableFeatures = [...availableFeatures, feature];
    setAvailableFeatures(newAvailableFeatures);
  }

  return (
    <Card id="data" className="w-1/3 ml-3" ref={setNodeRef} style={style}>
      <CardHeader className='text-center font-bold'>Data</CardHeader>
      <CardBody className='text-center flex flex-col justify-end items-center'>
        <Text className='text-bold'>Gold v. Fool's Gold Properties</Text>
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
                        <Td className="sticky left-0 bg-white flex flex-row items-center"><Button size="xs" variant="outline" className='mr-1' onClick={()=>removeFeature(key)}>X</Button><Text fontWeight="bold">{key}</Text> </Td>
                        {
                          values.map((value, index) => {
                            // const { attributes, listeners, setNodeRef, transform } = useDraggable({
                            //   id: index,
                            // });
                            // const style = transform ? {
                            //   transform: CSS.Translate.toString(transform),
                            // } : undefined;
                            // gen random key
                            // const randomKey = Math.random();
                            return <Td key={index}><Text>{value}</Text></Td>
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
        <Button onClick={() => generateData(uid, "FoolsGold", 10, activeFeatures)}>Generate Data</Button>
      </CardBody>
    </Card>
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
    <Card className="w-1/3 h-full m-1" ref={setNodeRef} style={style}>
      <CardHeader className='text-center font-bold'>Model</CardHeader>
      <CardBody className='text-center '>
        {model !== undefined ? model : <></>}
      </CardBody>
    </Card>
  );
}

function TrainRun({model_name, features}) {
  const [evalResult, setEvalResult] = useState(null);
  const evalModelPerf = async () => {
    const res = await evalModel(uid, "FoolsGold", model_name, features);
    console.log(res);
    setEvalResult(res.result);
  }
  return (
    <Card id="trainrun" className="w-1/3 h-full relative">
      <CardHeader className='text-center font-bold'>Train / Run</CardHeader>
      <CardBody className='text-center flex items-center h-full'>
        <div className="absolute h-3/4 top-0">
          <div id="visualization"></div>
          
        </div>
        {evalResult !== null ? <Text className='mb-3 font-bold text-center justify-center'>Accuracy: {Math.round(evalResult.accuracy*100)}%</Text> : <></>}

        <div className="absolute h-1/4 bottom-0">
          {/* <Text className='font-bold'>Train</Text> */}
          
          <Button className="mr-3" onClick={() => trainModel(uid, "FoolsGold", model_name, features)}>Train Model</Button>
          <Button onClick={() => evalModelPerf()}>Run Model</Button>
        </div>
      </CardBody>
    </Card >
  );
}

function FeedbackBar() {
  return (
    <Card className="w-full m-3">
      <CardHeader>
        <Heading size='md text-center justify-center'>Feedback</Heading>
      </CardHeader>
      <CardBody>
        <div className="w-full h-1000">

        </div>
      </CardBody>
    </Card>
  );
}

function DnDBar({availableFeatures}) {
  return (
    <Tabs className="w-full">
      < TabList >
        <Tab>Features</Tab>
        <Tab>Model</Tab>
        <Tab>Training</Tab>
        <Tab>Run</Tab>
      </TabList >

      <TabPanels>
        <TabPanel>
          <Grid h='200px' templateColumns='repeat(4, 1fr)' gap={4}>
            {availableFeatures.map((feature) => {
              return (
                <GridItem key={feature} rowSpan={1} colSpan={1}>
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
                <GridItem key={model} rowSpan={1} colSpan={1}>
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
        <Text className='font-bold'>{type}</Text>
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
    <Card className='m-3' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CardHeader>
        <Text className='font-bold'>{type}</Text>
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

const modelOptions = ["Decision Tree", "Logistic Regression", "K-Nearest Neighbors"];
const features = ["Conductivity", "Density", "Hardness", "Shape", "Shininess", "Texture"];

export function Level() {
  const [isDroppedModel, setIsDroppedModel] = useState(false);
  const [activeModelId, setActiveModelId] = useState(null);
  const [model, setModel] = useState(null);
  const [isDroppedFeature, setIsDroppedFeature] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState(null);
  const [activeFeatures, setActiveFeatures] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([...features]);
  function handleDragEnd(event) {
    if (event.over && event.over.id === 'model-droppable' && modelOptions.includes(event.active.id)) {
      // console.log(event);
      setActiveModelId(event.active.id);
      setIsDroppedModel(true);
    }
    // change features available
    if (event.over && event.over.id === 'data-droppable' && features.includes(event.active.id) && !activeFeatures.includes(event.active.id)) {
      // console.log(event);
      setIsDroppedFeature(true);
      const idToLower = event.active.id.toLocaleLowerCase()
      setActiveFeatureId(idToLower);
      // console.log(availableFeatures[0], idToLower)
      const newAvailableFeatures = availableFeatures.filter((feature) => feature.toLowerCase() !== idToLower);
      setAvailableFeatures(newAvailableFeatures);
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
      setAvailableFeatures(availableFeatures.filter((feature) => feature !== activeFeatureId));
    }
  }, [activeFeatureId]);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <h1 className='text-4xl text-center pb-10'>Fools Gold</h1>
      <div className='w-full h-2/3 inline-flex'>
        <Box display="flex" alignItems="center" className='m-0 w-full'>
          <Data activeFeatures={activeFeatures} setActiveFeatures={setActiveFeatures} availableFeatures={availableFeatures} setAvailableFeatures={setAvailableFeatures}/>
          <Model model={isDroppedModel ? <ModelOption type={activeModelId}></ModelOption> : undefined} />
          <TrainRun model_name={model} features={activeFeatures}/>
        </Box>
      </div>
      <div className='w-full h-800 inline-flex'>
        <Box display="flex" alignItems="center" className='m-0 w-1/3 h-full inline-block'>
          <FeedbackBar />
        </Box>
        <Box display="flex" alignItems="center" className='m-0 w-2/3 h-full p-10 inline-block'>
          <DnDBar availableFeatures={availableFeatures}/>
          {/* <Text>Select Features</Text>
        {features.map((feature) => {
          return <FeatureOption key={feature} type={feature} />
        })} */}
        </Box>
      </div>


    </DndContext>
  );
}