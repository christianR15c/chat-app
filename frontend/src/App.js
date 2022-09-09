// import { Button } from '@chakra-ui/react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path='/' element={<Homepage />} />
        <Route path='/chats' />
      </Router>
    </div>
  );
}

export default App;
