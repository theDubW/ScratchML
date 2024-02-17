import logo from './logo.svg';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <p>Hello World</p>
      </div>
    </ChakraProvider>
  );
}

export default App;
