import {Route, Routes} from 'react-router-dom';
import Landing from './pages/Landing';
import Doctor from './pages/Doctor';
import Patient from './pages/Patient';

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
