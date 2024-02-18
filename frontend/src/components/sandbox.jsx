import { Card, HStack, Container, Table, Thead, Tbody, Tr, Td, Th, Text, Box, CardHeader, CardBody, Grid, GridItem, CardFooter, Flex, Button, Heading, TableContainer, TableCaption, Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { getFirestore, onSnapshot, collection, doc } from "firebase/firestore";
import { CSS } from '@dnd-kit/utilities';
import { evalModel, generateData, trainModel } from '../helpers/callEndpoint';
import { FeedbackBar } from './level';

function Layer({layer}) {
    const { isOver, setNodeRef } = useDroppable({
        id: 'laye-droppable',
      });
      const style = {
        color: isOver ? 'green' : undefined,
      };

    return(
        <>
            <div className="w-1/3 h-full border-2 ml-1 mr-1 border-slate-300 rounded-lg">
                <Card className="h-full rounded-lg" ref={setNodeRef} style={style}>
                    <CardHeader className='text-center font-lilitaOne'>Model</CardHeader>
                    <CardBody className='text-center '>
                    {layer !== undefined ? <div className="">{layer}</div> : <></>}
                </CardBody>
                </Card>
            </div>
        </>
    )
}; 

function LayerBank() {
    return (
        <Grid h='200px' templateColumns='repeat(4, 1fr)' gap={4}>
              {layers.map((layer) => {
                return (
                  <GridItem rowSpan={1} colSpan={1}>
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
    const [isDroppedLayer, setIsDroppedLayer] = useState(false);
    const [activeLayerId, setActiveLayerId] = useState(null);
    const [activeLayers, setActiveLayers] = useState([]);

    function handleDragEnd(event) {
        if(event.over && layers.includes(event.active.id)) {
            setActiveLayerId(event.active.id);
            setIsDroppedLayer(true);
        }
    }
    return (
        <>
        <DndContext onDragEnd={handleDragEnd}>
        <h1 className='text-4xl text-center pb-10 font-lilitaOne'>Sandbox</h1>
      <div className='w-full h-800 inline-flex'>
        <Box display="flex" alignItems="center" className='m-0 w-1/3 h-full inline-block'>
          <FeedbackBar />
        </Box>
        <Box display="flex" alignItems="center" className='m-0 w-2/3 h-full inline-block'>
          <LayerBank />
          {/* <Text>Select Features</Text>
        {features.map((feature) => {
          return <FeatureOption key={feature} type={feature} />
        })} */}
        </Box>
      </div>
        </DndContext>
        
        </>
    )
};

