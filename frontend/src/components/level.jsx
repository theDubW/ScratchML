import { Card, Container, Text, Box, CardHeader, CardBody, CardFooter, Flex, Button } from '@chakra-ui/react'

function Data(){
  return (
    <Card className="w-full flex-grow h-2/3 m-10">
      <CardHeader className='text-center font-bold'>Data</CardHeader>
        <CardBody className='text-center flex flex-col justify-end items-center'>
          
          <Button>Generate Data</Button>
        </CardBody>
    </Card>
  );
}

function Model(){
  return (
    <Card  className="w-full flex-grow h-2/3 m-10">
        <CardBody className='text-center '>
          <Text className='text-center font-bold'>Model</Text>
        </CardBody>
    </Card>
  );
}
function Train(){
  return (
    <Card  className="w-2/3 flex-grow h-2/3 m-10">
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
    <Card className="w-2/3 flex-grow h-2/3 m-10">
      <CardHeader className='text-center font-bold'>Run</CardHeader>
        <CardBody className='text-center flex justify-center items-center'>
          <Button className=''>Run Model</Button>
        </CardBody>
    </Card>
  );
}

function ModelOption({type}){
  return (
    <Card className='m-3'>
      <CardHeader>
        <Text className='font-bold'>{type}</Text>
      </CardHeader>
      <CardBody>
        <Text>Model</Text>
      </CardBody>
    </Card>
  );
}

const modelOptions = ["Regression", "Clustering", "K-Means"]

export function Level(){
  return (
    <>
    <h1 className='text-4xl text-center'>Fools Gold</h1>
    <Box display="flex" alignItems="center" height="70vh" width="100vw" className='m-0'>
        <Data />
        <Model />
        <Train />
        <Run />
    </Box>
    <Box display="flex" alignItems="center" height="30vh" width="100vw" className='m-auto'>
      <Text>Drag a Model To Try it</Text>
      {modelOptions.map((model) => {
        return <ModelOption type={model} />
      })}
    </Box>

    </>
  );
}