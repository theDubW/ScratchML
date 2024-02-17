import './App.css';
import TaskList from './components/TaskList'
import { ChakraProvider, } from '@chakra-ui/react'
import {Card} from './components/dnd/DndElements'
import { Level } from './components/level';
// import Card from

function App() {
  return (
    <ChakraProvider>
      {/* <TaskList /> */}
      {/* <Card /> */}
      <Level />
    </ChakraProvider>
  );
}

export default App;
