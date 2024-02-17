import './App.css';
import { ChakraProvider, } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './views/landing_page';
import lessonOne from './views/lesson_one';
import { Button, Stack, ButtonGroup} from '@chakra-ui/react'
import { IoMdSettings, IoMdPerson } from "react-icons/io";
import { Heading } from '@chakra-ui/react'

function App() {
  return (
    <Router>
    <ChakraProvider>
    <Stack direction='row' spacing={4} className="p-4 justify-between bg-blue-200">
    <Heading><Link to="/">ScratchML</Link></Heading>
    <ButtonGroup spacing={4}>
      <Button leftIcon={ <IoMdPerson/> } colorScheme='blue' variant='solid'>
        Account
      </Button>
      <Button leftIcon={ <IoMdSettings /> } colorScheme='gray' variant='solid'>
        Settings
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
