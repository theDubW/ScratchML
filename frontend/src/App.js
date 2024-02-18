import './App.css';
import { ChakraProvider, } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import LandingPage from './views/landing_page';
import lessonOne from './views/lesson_one';
import { Button, Stack, ButtonGroup} from '@chakra-ui/react'
import { Heading } from '@chakra-ui/react'
import { extendTheme, Text } from '@chakra-ui/react'
import './firebase/init'
import '@fontsource/lilita-one';
import {Card} from './components/dnd/DndElements'
import { Level } from './components/level';
import sandbox from './components/sandbox';
// import Card from

function App() {
  const theme = extendTheme({
    fonts: {
      heading: `'Lilita One', sans-serif`,
      // body: `'Lilita One', sans-serif`,
    },
  });
  return (
    <div className=''>
    <Router>
      <ChakraProvider theme={theme}>
        <Stack direction='row' spacing={4} className="p-4 justify-between border-b border-blue-800">
          <Heading><Link to="/" className="font-lilitaOne">ScratchML</Link></Heading>
          <ButtonGroup spacing={4}>
            <Link to="/sandbox">
              <Button colorScheme='white' className="hover:bg-gray-300 border-blue-800 border-2 border-b-4 " variant='solid'>
              <Text to="/sandbox" className="text-blue-800 font-lilitaOne">Sandbox</Text>
            </Button>
            </Link>
            <Button colorScheme='white'className="hover:bg-gray-300 border-blue-800 border-2 border-b-4 " variant='solid'>
              <Text className="text-blue-800 font-lilitaOne">Account</Text>
            </Button>
            <Button colorScheme='white' className="hover:bg-gray-300 border-blue-800 border-2 border-b-4" variant='solid'>
              <Text className="text-blue-800 font-lilitaOne">Settings</Text>
            </Button>
          </ButtonGroup>
        </Stack>
          <Routes>
            <Route exact path="/" Component={LandingPage}/>
            <Route path="/lessonOne" Component={Level}/>
            <Route path="/sandbox" Component={sandbox}/>
          </Routes>
      </ChakraProvider>
    </Router>
    </div>
  );
}

export default App;
