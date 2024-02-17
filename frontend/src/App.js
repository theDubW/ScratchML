import './App.css';
import { ChakraProvider, } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './views/landing_page';
import lessonOne from './views/lesson_one';
import { Button, Stack} from '@chakra-ui/react'
import { MdCall, MdBuild } from "react-icons/md";

function App() {
  return (
    <Router>
    <ChakraProvider>
    <Stack direction='row' spacing={4} className="m-4">
  <Button leftIcon={<MdBuild />} colorScheme='pink' variant='solid'>
    Settings
  </Button>
  <Button rightIcon={<MdCall />} colorScheme='blue' variant='outline'>
    Call us
  </Button>
  <Button colorScheme='teal' variant='solid'>
    Email
  </Button>
  <Button colorScheme='blue' variant='solid'>
    Account
  </Button>
  <Button colorScheme='gray' variant='solid'>
    Settings
  </Button>
</Stack>
    {/* <Tabs variant='soft-rounded' colorScheme='green'>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
  </TabPanels>
</Tabs> */}
      <Routes>
        <Route exact path="/" Component={LandingPage}/>
        <Route path="/lessonOne" Component={lessonOne}/>
      </Routes>
    </ChakraProvider>
    </Router>
  );
}

export default App;
