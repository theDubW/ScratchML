import './App.css';
import TaskList from './components/TaskList'
import Map from './components/map'
import { ChakraProvider, } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <div className='flex flex-row p-5'>
        <TaskList className="h-screen"/>
        <Map className="h-screen border-black"/>
      </div>
    </ChakraProvider>
  );
}

export default App;
