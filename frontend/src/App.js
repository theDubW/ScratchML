import './App.css';
import { ChakraProvider, } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './views/landing_page';
import lessonOne from './views/lesson_one';


function App() {
  return (
    <Router>
    <ChakraProvider>
      <Routes>
        <Route exact path="" Component={LandingPage}/>
        </Routes>
        <Routes>
        <Route exact path="/lessonOne" Component={lessonOne}/>
      </Routes>
    </ChakraProvider>
    </Router>
  );
}

export default App;
