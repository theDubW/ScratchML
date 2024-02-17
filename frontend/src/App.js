import logo from './logo.svg';
import './App.css';
import TaskList from './components/TaskList'
import { ChakraProvider, } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <TaskList />
    </ChakraProvider>
  );
}

export default App;
