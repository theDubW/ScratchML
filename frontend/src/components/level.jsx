import { Card, Container, Table, Thead, Tbody, Tr,Td, Th, Text, Box, CardHeader, CardBody, CardFooter, Flex, Button, TableContainer, TableCaption } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import {getFirestore, onSnapshot,collection, doc} from "firebase/firestore";
import {CSS} from '@dnd-kit/utilities';
import {generateData} from '../helpers/callEndpoint';

const uid = "user_10";
function Data(){
  // listen to firestore for data
  const db = getFirestore();
  const [data, setData] = useState({});
  
  useEffect(() => {
    const ref = doc(collection(doc(collection(db, "Users"), uid), "FoolsGold"), "train");
    onSnapshot(ref, (snapshot) => {
      if(snapshot.exists()){
        const docData = snapshot.data();
        const data = {};
        for (const key in docData){
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
  }, []);
  return (
    <Card className="w-full h-2/3 ml-3">
      <CardHeader className='text-center font-bold'>Data</CardHeader>
        <CardBody className='text-center flex flex-col justify-end items-center'>
          <TableContainer overflow="scroll" className='mt-0 mb-3'>
            <Text className='text-bold'>Gold v. Fool's Gold Properties</Text>
            <Table variant='simple' size="sm">
              
              <Tbody>
              {
                Object.keys(data).map((key) => {
                  if(key !== "label"){
                    
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
          <Button onClick={generateData(uid, "FoolsGold", 10)}>Generate Data</Button>
        </CardBody>
    </Card>
  );
}

function Model({model}){
  const {isOver, setNodeRef} = useDroppable({
    id: 'model-droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <Card  className="w-2/3 flex-grow h-2/3 m-10" ref={setNodeRef} style={style}>
      <CardHeader className='text-center font-bold'>Model</CardHeader>
        <CardBody className='text-center '>
          {model !== undefined ? model : <></>}
        </CardBody>
    </Card>
  );
}
function Train(){
  return (
    <Card  className="w-1/2 flex-grow h-2/3 m-10">
      <CardHeader className='text-center font-bold'>Train</CardHeader>
        <CardBody className='text-center flex justify-center items-center'>
          {/* <Text className='font-bold'>Train</Text> */}
          <Button>Train Model</Button>
        </CardBody>
    </Card>
  );
}
function Run(){
  return (
    <Card className="w-1/2 flex-grow h-2/3 m-10">
      <CardHeader className='text-center font-bold'>Run</CardHeader>
        <CardBody className='text-center flex justify-center items-center'>
          <Button className=''>Run Model</Button>
        </CardBody>
    </Card>
  );
}


function ModelOption({type}){
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
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
      <CardBody>
        <Text>Model</Text>
      </CardBody>
    </Card>
  );
}

function FeatureOption({type}){
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
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

const modelOptions = ["Regression", "Clustering", "K-Means"]

export function Level(){
  const [isDropped, setIsDropped] = useState(false);
  const [activeId, setActiveId] = useState(null);
  function handleDragEnd(event) {
    if (event.over && event.over.id === 'model-droppable') {
      // console.log(event);
      setActiveId(event.active.id);
      setIsDropped(true);
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
    <h1 className='text-4xl text-center'>Fools Gold</h1>
    <Box display="flex" alignItems="center" height="70vh" width="100vw" className='m-0'>
        <Data />
        <Model model={isDropped ? <ModelOption type={activeId}></ModelOption> : undefined}/>
        <Train />
        <Run />
    </Box>
    <Box display="flex" alignItems="center" height="30vh" width="100vw" className='m-auto'>
      <Text>Drag a Model To Try it</Text>
      {modelOptions.map((model) => {
        return <ModelOption key={model} type={model} />
      })}
    </Box>

    </DndContext>
  );
}