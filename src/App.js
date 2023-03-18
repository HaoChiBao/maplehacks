import {Route, Routes} from 'react-router-dom';
import Landing from './pages/landing';
import Doctor from './pages/doctor';
import Patient from './pages/patient';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={< Landing/>} />
      <Route path="/doctor" element={< Doctor/>} />
      <Route path="/patient" element={< Patient/>} />
    </Routes>
  );
}

export default App;
