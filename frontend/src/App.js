import './App.css';
import { ChakraProvider, } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './views/landing_page';
import lessonOne from './views/lesson_one';
import './firebase/init'

import {Card} from './components/dnd/DndElements'
import { Level } from './components/level';
// import Card from

function App() {
  return (
    <Router>
    <ChakraProvider>
      {/* <TaskList /> */}
      {/* <Card /> */}
      <Level />
    </ChakraProvider>
    </Router>
  );
}

export default App;
