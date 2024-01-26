import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Main from './components/Main';
import Schedule from './components/Schedule';
import Rules from './components/Rules';
import Time from './components/Time';
import SocialMediaOptions from './components/SocialMediaOptions';
import {BrowserRouter , Routes, Route} from 'react-router-dom';



function App() {


   
  
  return (
    <div className="App" id='app'>
     <Navbar/>
     <Main/>
     
    <div className='sch'>
       <Time />
    </div>
    <SocialMediaOptions/>
   

    
      
    
  </div>
  );
}

export default App;
