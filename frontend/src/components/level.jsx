import { Card, Container, Text, Box, CardHeader, CardBody, CardFooter, Flex } from '@chakra-ui/react'

function Data(){
  return (
    <Card  style={{flex: 1}}>
        <CardBody>
          <Text>Data</Text>
        </CardBody>
    </Card>
  );
}

function Model(){
  return (
    <Card  style={{flex: 1}}>
        <CardBody>
          <Text>Model</Text>
        </CardBody>
    </Card>
  );
}
function Train(){
  return (
    <Card  style={{flex: 1}}>
        <CardBody>
          <Text>Train</Text>
        </CardBody>
    </Card>
  );
}
function Run(){
  return (
    <Card style={{flex: 1}}>
        <CardBody>
          <Text>Run</Text>
        </CardBody>
    </Card>
  );
}
export function Level(){
  return (
    // <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <Container display="flex" justifyContent="center" alignItems="center" height="100vh" width="100vh">
      <Flex direction="row"  justify="space-between">
        <Data />
        <Model />
        <Train />
        <Run />
      </Flex>
    </Container>
    // </Box>
  );
}