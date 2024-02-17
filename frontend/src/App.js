import './App.css';
import { ChakraProvider, } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './views/landing_page';
import lessonOne from './views/lesson_one';
import { Button, Stack, ButtonGroup} from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'

function App() {
  return (
    <Router>
    <ChakraProvider>
    <Stack direction='row' spacing={4} className="p-4 justify-between border-b border-blue-800">
    <Heading><Link to="/" className="font-lilitaOne">ScratchML</Link></Heading>
    <ButtonGroup spacing={4}>
    <Button colorScheme='white'className="hover:bg-gray-300 border-blue-800 border-2 border-b-4 " variant='solid'>
        <text className="text-blue-800 font-lilitaOne">Sandbox</text>
      </Button>
      <Button colorScheme='white'className="hover:bg-gray-300 border-blue-800 border-2 border-b-4 " variant='solid'>
        <text className="text-blue-800 font-lilitaOne">Account</text>
      </Button>
      <Button colorScheme='white' className="hover:bg-gray-300 border-blue-800 border-2 border-b-4" variant='solid'>
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
