
import City from './Components/Page/City.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Forecast from './Components/Page/Forecast.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
    <Routes>
        <Route path='/' element={<City />} >
            <Route path=':forecast' element={<Forecast />} /> 
        </Route>
    </Routes>
</Router>
  );
}

export default App;
