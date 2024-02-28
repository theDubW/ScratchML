import { Card, HStack, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Container, Tooltip, Table, Thead, Tbody, Tr, Td, Th, Text, Box, CardHeader, CardBody, Grid, GridItem, CardFooter, Flex, Button, Heading, TableContainer, TableCaption, Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator } from '@chakra-ui/react'
import { DndContext, useDroppable, useDraggable, UniqueIdentifier, DragEndEvent } from '@dnd-kit/core';
import { useEffect, useState, FC, Key } from 'react';
import { getFirestore, onSnapshot, collection, doc, UnionToIntersection } from "firebase/firestore";
import { CSS } from '@dnd-kit/utilities';
import { evalModel, generateData, trainModel } from '../helpers/callEndpoint';
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import Sand from '../sand.png';

const uid = "user_10";

interface DataProps {
  activeFeatures: UniqueIdentifier[];
  setActiveFeatures: (value: UniqueIdentifier[] | ((prevVar: UniqueIdentifier[]) => UniqueIdentifier[])) => void;
  availableFeatures: UniqueIdentifier[];
  setAvailableFeatures: (value: UniqueIdentifier[] | ((prevVar: UniqueIdentifier[]) => UniqueIdentifier[])) => void;
};

const Data: FC<DataProps> = ({activeFeatures, setActiveFeatures, availableFeatures, setAvailableFeatures}) => {
  // listen to firestore for data
  const db = getFirestore();
  const [data, setData] = useState<docData>({});
  interface docData {
    [key: string | number]: any;
  }

  useEffect(() => {
    const ref = doc(collection(doc(collection(db, "Users"), uid), "FoolsGold"), "train");
    onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {

        const docData: docData = snapshot.data();
        const data: docData = {};
        
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
  let num_samples = 0;
  // let num_samples = Object.keys(data);
  if (Object.keys(data).length === 0) {
    num_samples = 0;
  } else {
    num_samples = data[Object.keys(data)[0]].length;
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
  const removeFeature = (feature: string) => {
    console.log("removing feature: " + feature);
    console.log(activeFeatures);
    const newActiveFeatures = activeFeatures.filter((f) => f !== feature);
    console.log(newActiveFeatures);
    setActiveFeatures(newActiveFeatures);
    const newAvailableFeatures = [...availableFeatures, feature];
    setAvailableFeatures(newAvailableFeatures);
  }
  const numSamples = Object.keys(data).length === 0 ? 0 : data[Object.keys(data)[0]].length;
  return (
    <div className="w-1/3 h-full ml-3 mr-1 border-2 border-slate-300 rounded-lg">
    <Card id="data" className="rounded-lg h-full" ref={setNodeRef} style={style}>
      <CardHeader className='text-center font-lilitaOne'>Data ({numSamples} samples)</CardHeader>
      <CardBody className='text-center flex flex-col justify-center items-center pb-0'>
        {/* <Text className='text-bold'>Gold v. Fool's Gold Properties ({numSamples} samples)</Text> */}
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
                        
                        <Td className="sticky left-0 bg-white font-signika">
                          <div className="flex flex-row items-center">
                          <Button size="xs" variant="outline" className='left-0 mr-1' onClick={()=>removeFeature(key)}>X</Button>
                          <Text fontWeight="bold">{key}</Text>
                          </div>
                        </Td>
                        {
                          values.map((value: string, index: number) => {
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
        {activeFeatures.length > 0 ? <>
        <Button colorScheme="white" onClick={() => generateData(uid, "FoolsGold", 50)} className="border-blue-800 border-2 rounded hover:bg-gray-300 font-signika"> 
        <Text className="text-blue-800">Generate Data</Text></Button>
        </> : <></>}
      </CardBody>
    </Card>
    </div>
  );
}

interface ModelProps {
  activeModelId: UniqueIdentifier | null;
  setActiveModelId: (value: UniqueIdentifier | null | ((prevVar: UniqueIdentifier | null) => UniqueIdentifier | null)) => void;
  availableModels: (UniqueIdentifier | null)[];
  setAvailableModels: (value: (UniqueIdentifier | null)[] | ((prevVar: (UniqueIdentifier | null)[]) => (UniqueIdentifier | null)[])) => void;
};

const Model: FC<ModelProps> = ({ activeModelId, setActiveModelId, availableModels, setAvailableModels }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'model-droppable',
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };

  const removeModel = () => {
    // console.log("removing model, adding back to available", activeModelId);
    setActiveModelId(null);
    setAvailableModels([...availableModels, activeModelId]);
  };

  return (
    <div className="w-1/3 h-full m-1 border-2 border-slate-300 rounded-lg">
    <Card className="h-full rounded-lg" ref={setNodeRef} style={style}>
      <CardHeader className='text-center font-lilitaOne flex items-center justify-center'>Model</CardHeader>
      <CardBody className='text-center place-content-center justify-center'>
        {activeModelId !== null ? (
            <ModelOption type={activeModelId} removeModel={removeModel}/>
        ) : <div className="bg-gray-300 rounded-lg border-dashed border-black border-2 w-full h-full font-signika">Drag a model here!</div>}
      </CardBody>
    </Card>
    </div>
  );
}

interface TrainRunProps {
  model_name: UniqueIdentifier | null;
  features: (UniqueIdentifier | null)[];
  setFeedback: (value: string | ((prevVar: string) => string)) => void;
};

const TrainRun: FC<TrainRunProps> = ({ model_name, features, setFeedback }) => {

  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);
  // const [confusion, setConfusion] = useState([]);
  const evalModelPerf = async () => {
    const res = await evalModel(uid, "FoolsGold", model_name, features) as EvalModelResponse;
    setEvalResult(res.result);
    setFeedback(res.feedback);
  }
  const evalAndFeedBack = () => {
    evalModelPerf();
    setFeedback("...");
  }
  const [training, setTraining] = useState<Boolean>(false);
  const [running, setRunning] = useState<Boolean>(false);
  
  return (
    <div className="w-1/3 h-full ml-1 border-2 border-slate-300 rounded-lg ">
    <Card id="trainrun" className="h-full rounded-lg pb-4">
      <CardHeader className='text-center font-lilitaOne'>Train / Run</CardHeader>
      <CardBody className='text-center flex items-center h-full flex-col'>
        <div className=" h-3/4 top-0">
          <div id="visualization"></div>

        </div>
        {evalResult !== null ? <>
        <Grid templateRows='repeat(3, 1fr)' templateColumns='repeat(4, 1fr)' gap={1} className="mb-4 font-signika">
        <GridItem rowSpan={1} colSpan={1}></GridItem>
        <GridItem rowSpan={1} colSpan={2} className="align-middle"><text className="align-text-bottom">Predicted</text></GridItem>
        <GridItem rowSpan={3} colSpan={1}></GridItem>
        <GridItem rowSpan={2} colSpan={1} className="py-10 -rotate-90">Actual</GridItem>
          <GridItem rowSpan={1} colSpan={1} className="bg-green-400 rounded-sm p-4">
            {evalResult.confusion_matrix[0]}
          </GridItem>
          <GridItem rowSpan={1} colSpan={1} className="bg-red-400 rounded-sm p-4">
          {evalResult.confusion_matrix[1]}
          </GridItem>
          <GridItem rowSpan={1} colSpan={1} className="bg-red-400 rounded-sm p-4">
          {evalResult.confusion_matrix[2]}
          </GridItem>
          <GridItem rowSpan={1} colSpan={1} className="bg-green-400 rounded-sm p-4">
          {evalResult.confusion_matrix[3]}
          </GridItem>
        </Grid>
        </> : <></>}
        {evalResult !== null ? <Text className='mb-3 font-bold text-center justify-center'>Accuracy: {Math.round(evalResult.accuracy * 100)}%</Text> : <></>}

        <div className="h-1/4 align-middle flex flex-row justify-center">
          {/* <Text className='font-bold'>Train</Text> */}
          
          <Button colorScheme="white" className="mr-3 hover:bg-gray-300 border-blue-800 border-2" onClick={async () => {
            setTraining(true);
            trainModel(uid, "FoolsGold", model_name, features);
            await new Promise( res => setTimeout(res, 1000));
            setTraining(false);
          }}>
              {training ? <Text className="text-blue-800 font-signika">Loading...</Text> : 
            <Text className="text-blue-800 font-signika">Train Model</Text>}</Button>
          <Button colorScheme="white" onClick={async () => {
            setRunning(true);
            evalAndFeedBack();
            setRunning(false);
          }} className="hover:bg-gray-300 border-blue-800 border-2">
{running ? <Text className="text-blue-800 font-signika">Loading...</Text> : 
            <Text className="text-blue-800 font-signika">Run Model</Text>}          
            </Button>
        </div>
      </CardBody>
    </Card >
    </div>
  );
}

interface FeedbackBarProps {
  feedback: string;
};

const FeedbackBar: FC<FeedbackBarProps> = ({feedback}) => {
  return (
    <div className="w-full h-full ml-3 mt-2 border-slate-300 border-2 rounded-lg">
    <Card className="h-full">
      <CardHeader>
        <Heading size='md text-center'>Feedback</Heading>
      </CardHeader>
      <CardBody>
        <div className="w-full h-1000">
          <Text className='overflow-auto'>{feedback}</Text>
        </div>
      </CardBody>
    </Card>
    </div>
  );
}

function ProblemDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div id="drawer">
      <div className="m-4" id="icon">
        <Tooltip hasArrow label='Read the problem' bg='blue.800'>
          <button onClick={onOpen}>
            <HiArrowRight size={32} />
          </button>
        </Tooltip>
      </div>
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen} size={'lg'}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader className='1px font-signika'>Lesson One: Sample Size</DrawerHeader>
          <DrawerBody>
            <p className="font-signika">Hey, young explorers! Ready to embark on a thrilling quest to distinguish real gold from Fool's Gold? Welcome to our adventure, "Fool's Gold," where you'll become a treasure hunter using the power of machine learning, without writing a single line of code!
            </p>
<p className="font-signika">
In this mission, you have a map with clues based on six magical elements: Hardness, Density, Conductivity, Shininess, Shape, and Texture. Each element has its own secret that can help you find the real gold. But beware, not all that glitters is gold, and not all clues are as helpful as they seem!
</p><p className="font-signika">
Your journey will take you through the lands of data, where you'll learn to choose your tools wisely. You'll gather your own data based on the six elements. Remember, some clues might lead you to Fool's Gold, so you need to decide which elements are truly golden!
</p><li className="font-signika">
  <text className="font-lilitaOne">Hardness and Density: </text>
These might tell you how tough and heavy the gold is.
</li><li className="font-signika">
<text className="font-lilitaOne">Conductivity: </text> Real gold is a great conductor. Can you use this to your advantage?
</li><li className="font-signika">
<text className="font-lilitaOne">Shininess: </text> Gold has a special shine, but can you tell it apart from the misleading glimmer of Fool's Gold?
</li><li className="font-signika">
<text className="font-lilitaOne">Shape: </text> Gold can come in many shapes - circles, triangles, rectangles, and squares. Which shapes are more common for real gold?
</li><li className="font-signika">
<text className="font-lilitaOne">Texture: </text>Is the gold smooth or rough? This could be a crucial clue!
</li>
<p className="font-signika">
As you experiment with training and evaluating your treasure-finding models, you'll learn which elements are the most reliable indicators of real gold. The goal? To achieve a 90% accuracy in identifying the true treasure. Along the way, you'll also get a sneak peek at different magic spells (models) you can cast on your data to improve your chances.
</p><p className="font-signika">
This adventure is not just about finding treasure; it's about using your brain, making smart choices, and learning the secrets of machine learning. Are you ready to use your knowledge from the previous lessons and unlock the mystery of real gold? Grab your explorer's hat, and let's dive into the world of "Fool's Gold"!</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

interface DnDBarProps {
  availableModels: any[];
  availableFeatures: any[];
};

const DnDBar: FC<DnDBarProps> = ({availableModels, availableFeatures}) => {
  return (
    <Tabs isFitted variant='unstyled' className="w-2/3 border-2 ml-3 border-slate-300 mt-2 rounded-lg">
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
            {availableModels.map((model) => {
              console.log("model:", model)
              return (
                <GridItem key={model} rowSpan={1} colSpan={1}>
                  <ModelOption key={model} type={model} removeModel={undefined}/>
                </GridItem>
              )
            })}
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs >);
}

interface ModelOptionProps {
  type: UniqueIdentifier | string;
  removeModel: any;
};

const ModelOption: FC<ModelOptionProps> = ({ type, removeModel }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: type,
  });
  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;


  return (
    <div className="align-middle flex flex-row justify-center">
      <div className="flex flex-row justify-center items-center">
    {removeModel !== undefined && <Button size="xs" className="mr-2 ml-0 align-middle" onClick={removeModel}>X</Button>}
    <Card className='m-3' ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <CardHeader>
      <Tooltip label={modelBlurbs[modelOptions.indexOf(type)]} aria-label='A tooltip' className="border-2 border-blue-800 rounded-lg">
        <Text className='font-bold text-blue-800'>{type}</Text>
      </Tooltip>
      </CardHeader>
      {/* <CardBody>
        <Text>Model</Text>
      </CardBody> */}
    </Card>
    </div>
    </div>
  );
}


interface FeatureOptionProps {
  type: UniqueIdentifier;
};

const FeatureOption: FC<FeatureOptionProps> = ({ type }) => {
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

const modelOptions: UniqueIdentifier[] = ["Decision Tree", "Logistic Regression", "K-Nearest Neighbors"];
const modelBlurbs: string[] = ["Decision trees are like playing a game of \"20 Questions\" to make a choice or prediction. Starting with a big question at the top, each answer leads you down different paths with more questions until you reach the final decision at the bottom.", "Logistic regression is a math tool that helps us predict the chance of something happening (like winning a game) based on certain factors (like team skill levels). It works by taking our information and crunching the numbers to give a \"yes or no\" answer, sort of like making an educated guess.",
"KNN, or K-Nearest Neighbors, is like making friends based on similarities. If you want to know if you'll like a new game, you see what the closest (most similar) games you already like suggest about it, using the opinions of the \"nearest\" few to make your decision."]
const features: UniqueIdentifier[] = ["Conductivity", "Density", "Hardness", "Shape", "Shininess", "Texture"];

export function Level() {
  // const [isDroppedModel, setIsDroppedModel] = useState(false);
  const [activeModelId, setActiveModelId] = useState<UniqueIdentifier | null>(null);
  const [model, setModel] = useState<UniqueIdentifier | null>(null);
  const [availableModels, setAvailableModels] = useState<(UniqueIdentifier | null)[]>([...modelOptions]);
  // const [isDroppedFeature, setIsDroppedFeature] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState<UniqueIdentifier | null>(null);
  const [activeFeatures, setActiveFeatures] = useState<UniqueIdentifier[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<UniqueIdentifier[]>([...features]);
  const [feedback, setFeedback] = useState<string>("");
  function handleDragEnd(event: DragEndEvent) {
    if (event.over && event.over.id === 'model-droppable' && modelOptions.includes(event.active.id)) {
      console.log("model dropped", event.active.id);
      if(activeModelId !== null && activeModelId !== event.active.id){
        setAvailableModels([...availableModels, activeModelId]);
      }
      console.log(event.active.id);
      setActiveModelId(event.active.id);
      console.log("available models", availableModels);
    }
    // change features available
    if (event.over && event.over.id === 'data-droppable' && features.includes(event.active.id) && !activeFeatures.includes(event.active.id)) {
      setActiveFeatureId(event.active.id);
    }
  }
  useEffect(() => {
    console.log("in active model use effect")
    if(activeModelId !== null){
      // const newAvailableModels = availableModels.filter((m) => m !== activeModelId);
      // setAvailableModels(newAvailableModels);
      // setActiveModelId(activeModelId);
      setModel(activeModelId);
      setAvailableModels(availableModels.filter((model) => model !== activeModelId));
    }
  }, [activeModelId]);
  useEffect(() => {
    console.log("UPDATING ACTIVE FEATURES");
    if (activeFeatureId !== null) {

      // console.log(activeFeatureId);
      // setActiveFeatureId(activeFeatureId);
      setActiveFeatures([...activeFeatures, activeFeatureId]);
      // console.log("available features", availableFeatures, ", ", activeFeatureId);
      setAvailableFeatures(availableFeatures.filter((feature) => feature !== activeFeatureId));
    }
  }, [activeFeatureId]);
  return (
    <>
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex w-full relative" id="TopBar">
        <ProblemDrawer />
        <h1 className='text-4xl text-center w-full font-lilitaOne'>Fool's Gold - The Quest for Real Gold</h1>
      </div>
      <div className='w-full h-2/3 inline-flex'>
        <Box display="flex" alignItems="center" className='m-0 w-full'>
          <Data activeFeatures={activeFeatures} setActiveFeatures={setActiveFeatures} availableFeatures={availableFeatures} setAvailableFeatures={setAvailableFeatures}/>
          <Model activeModelId={activeModelId} setActiveModelId={setActiveModelId} availableModels={availableModels} setAvailableModels={setAvailableModels}/>
          <TrainRun model_name={model} features={activeFeatures} setFeedback={setFeedback}/>
        </Box>
      </div>
      <div className='w-full h-[800] inline-flex'>
        <Box display="flex" alignItems="top" className='m-0 w-full h-full items-stretch'>
          <div className="w-1/3 items-stretch grid mr-2 mb-2"><FeedbackBar feedback={feedback}/></div>
          <DnDBar availableModels={availableModels} availableFeatures={availableFeatures}/>
          {/* <Text>Select Features</Text>
        {features.map((feature) => {
          return <FeatureOption key={feature} type={feature} />
        })} */}
        </Box>
      </div>


    </DndContext>
        <img src={Sand} alt="sand"/>
    </>
  );
}

export {FeedbackBar};