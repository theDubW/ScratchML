import { Card, HStack, Container, Table, Thead, Tbody, Tr, Td, Th, Text, Box, CardHeader, CardBody, CardFooter, Flex, Button, Heading, TableContainer, TableCaption, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot, collection, doc } from "firebase/firestore";
import { CSS } from '@dnd-kit/utilities';
import { evalModel, generateData, trainModel } from '../helpers/callEndpoint';

const uid = "user_10";

function Data() {
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
  if (num_samples.length === 0) {
    num_samples = 0;
  } else {
    num_samples = data[num_samples[0]].length;
  }
  return (
    <Card id="data" className="w-full ml-3">
      <CardHeader className='text-center font-bold'>Data</CardHeader>
      <CardBody className='text-center flex flex-col justify-end items-center'>
        <Text className='text-bold'>Gold v. Fool's Gold Properties</Text>
        <TableContainer className='mt-0 mb-3'>
          <Table variant='simple' size="sm">

            <Tbody>
              {
                Object.keys(data).map((key) => {
                  if (key !== "label") {

                    const values = data[key];

                    return (
                      <>
                        <Tr key={key}>
                          {/* TODO add emojis */}
                          <Td className="sticky left-0 bg-white"><Text fontWeight="bold">{key}</Text></Td>
                          {
                            values.map((value, index) => {
                              // gen random key
                              // const randomKey = Math.random();
                              return <Td key={index}><Text>{value}</Text></Td>
                            })
                          }
                        </Tr>
                      </>
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

function TrainRun() {

  return (
    <Card id="trainrun" className="w-2/3 h-full m-10 relative">
      <CardHeader className='text-center font-bold'>Train / Run</CardHeader>
      <CardBody className='text-center flex items-center h-full'>
        <div class="absolute h-3/4 top-0">
          <div id="visualization"></div>
        </div>
        <div className="absolute h-1/4 bottom-0">
          {/* <Text className='font-bold'>Train</Text> */}
          <Button>Train Model</Button>
          <Button className='m-10'>Run Model</Button>
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

function DnDBar() {
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
          <div className="grid grid-cols-4 gap-4">
            {featureOptions.map((feature) => {
              return (
                <div className="w-full" >
                  <FeatureOption key={feature} type={feature} />
                </div>
              )
            })}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid grid-cols-3 gap-4">
            {modelOptions.map((model) => {
              return (
                <div className="w-full" >
                  <ModelOption key={model} type={model} />
                </div>
              )
            })}
          </div>
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
      <CardBody>
        <Text>Model</Text>
      </CardBody>
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

const modelOptions = ["Decision Tree", "Logistic Regression", "K-Nearest Neighbors"];
const featureOptions = ["Shape", "Texture", "Density", "Hardness", "Conductivity", "Shininess", "Hardness"];

export function Level() {
  const [isDropped, setIsDropped] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [model, setModel] = useState(null);
  function handleDragEnd(event) {
    if (event.over && event.over.id === 'model-droppable') {
      // console.log(event);
      setActiveId(event.active.id);
      setIsDropped(true);
    }
  }
  useEffect(() => {
    if (activeId !== null) {
      setModel(activeId);
    }
  }, [activeId]);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <h1 className='text-4xl text-center pb-10'>Fools Gold</h1>
      <div className='w-full h-2/3 inline-flex'>
        <Box display="flex" alignItems="center" className='m-0 w-1/3'>
          <Data />
        </Box>
        <Box display="flex" alignItems="center" className='m-0 w-2/3'>
          <Model model={isDropped ? <ModelOption type={activeId}></ModelOption> : undefined} />
          <TrainRun />
        </Box>
      </div>
      <div className='w-full h-800 inline-flex'>
        <Box display="flex" alignItems="center" className='m-0 w-1/3 h-full inline-block'>
          <FeedbackBar />
        </Box>
        <Box display="flex" alignItems="center" className='m-0 w-2/3 h-full p-10 inline-block'>
          <DnDBar />
        </Box>
      </div>


    </DndContext>
  );
}