import './App.css';
import TaskList from './components/TaskList'
import { ChakraProvider, } from '@chakra-ui/react'
import Card from './components/dnd/DndElements'

function App() {
  return (
    <ChakraProvider>
      <TaskList />
      <Card />
    </ChakraProvider>
  );
}

export default App;
