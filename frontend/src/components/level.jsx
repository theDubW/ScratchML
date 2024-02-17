import { Card, Container, Table, Thead, Tbody, Tr, Td, Th, Text, Box, CardHeader, CardBody, CardFooter, Flex, Button, TableContainer, TableCaption } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot, collection, doc } from "firebase/firestore";
import { CSS } from '@dnd-kit/utilities';
import {evalModel,  generateData, trainModel } from '../helpers/callEndpoint';

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
        console.log(data);
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
  if(num_samples.length === 0){
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
  console.log(Object.keys(data));
  const keys = Object.keys(data);
  // if(keys.length === 0){
  //   keys = activeFeatures;
  // }
  return (
    <Card id="data" className="w-full ml-3" ref={setNodeRef} style={style}>
      <CardHeader className='text-center font-bold'>Data</CardHeader>
      <CardBody className='text-center flex flex-col justify-end items-center'>
        <TableContainer overflow="scroll" className='mt-0 mb-3'>
          <Text className='text-bold'>Gold v. Fool's Gold Properties</Text>
          <Table variant='simple' size="sm">

            <Tbody>
              {
                Object.keys(data).map((key) => {
                  // console.log("checking if " + key + " is in " + activeFeatures + " " + activeFeatures.includes(key.toLocaleLowerCase()));
                  if (key !== "label" && activeFeatures.includes(key)) {

                    const values = data[key];

                    return (
                      <Tr key={key}>
                        {/* TODO add emojis */}
                        <Td><Text fontWeight="bold">{key}</Text></Td>
                        {
                          values.map((value, index) => {
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
    <Card className="w-1/3 h-full flex-grow m-10" ref={setNodeRef} style={style}>
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
    <Card id="trainrun" className="w-1/3 h-full m-10 relative">
      <CardHeader className='text-center font-bold'>Train / Run</CardHeader>
      <CardBody className='text-center flex flex-col justify-center items-center'>
        
        {/* <Text className='font-bold'>Train</Text> */}
        <Button onClick={() => trainModel(uid, "FoolsGold", model_name, features)}>Train Model</Button>
      {/* </CardBody> */}
      {evalResult !== null ? <Text className='mb-3 font-bold'>Accuracy: {Math.round(evalResult.accuracy*100)}%</Text> : <></>}
      {/* <CardBody className='text-center flex justify-center items-center'> */}
        <Button onClick={() => evalModelPerf()}>Run Model</Button>
      </CardBody>
    </Card>
  );
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
    if(activeModelId !== null){
      setModel(activeModelId);
    }
  }, [activeModelId]);
  useEffect(() => {
    if(activeFeatureId !== null){
      console.log("UPDATING ACTIVE FEATURES");
      // console.log(activeFeatureId);
      // setActiveFeatureId(activeFeatureId);
      setActiveFeatures([...activeFeatures, activeFeatureId]);
    }
  }, [activeFeatureId]);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <h1 className='text-4xl text-center pb-10'>Fools Gold</h1>
      <div className='w-full  h-2/3 inline-flex'>
        <Box display="flex" alignItems="center" className='m-0 w-1/3'>
          <Data activeFeatures={activeFeatures}/>
        </Box>
        <Box display="flex" alignItems="center" className='m-0 w-1/2'>
          <Model model={isDroppedModel ? <ModelOption type={activeModelId}></ModelOption> : undefined} />
          <TrainRun model_name={model} features={activeFeatures}/>
        </Box>
      </div>
      <Box display="flex" alignItems="center" height="30vh" width="100vw" className='m-auto'>
        <Text>Drag a Model To Try it</Text>
        {modelOptions.map((model) => {
          return <ModelOption key={model} type={model} />
        })}
      </Box>
      <Box display="flex" alignItems="center" height="30vh" width="100vw" className='m-auto'>
        <Text>Select Features</Text>
        {features.map((feature) => {
          return <FeatureOption key={feature} type={feature} />
        })}
      </Box>

    </DndContext>
  );
}