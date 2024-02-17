import './App.css';
import { ChakraProvider, } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './views/landing_page';
import lessonOne from './views/lesson_one';
import { Button, Stack, ButtonGroup} from '@chakra-ui/react'
import { IoMdSettings, IoMdPerson } from "react-icons/io";
import { Heading } from '@chakra-ui/react'
import './firebase/init'

import {Card} from './components/dnd/DndElements'
import { Level } from './components/level';
// import Card from

function App() {
  return (
    <Router>
    <ChakraProvider>
    <Stack direction='row' spacing={4} className="p-4 justify-between border-b">
    <Heading><Link to="/" className="font-lilitaOne">ScratchML</Link></Heading>
    <ButtonGroup spacing={4}>
      <Button leftIcon={ <IoMdPerson/> } colorScheme='white'className="hover:bg-gray-300" variant='solid'>
        <text className="text-blue-800 font-lilitaOne">Account</text>
      </Button>
      <Button leftIcon={<IoMdSettings />}colorScheme='white' className="hover:bg-gray-300 border-" variant='solid'>
        <text className="text-blue-800 font-lilitaOne">Settings</text>
      </Button>
      </ButtonGroup>
    </Stack>
      <Routes>
        <Route exact path="/" Component={LandingPage}/>
        <Route path="/lessonOne" Component={lessonOne}/>
      </Routes>
    </ChakraProvider>
    </Router>
  );
}

export default App;
