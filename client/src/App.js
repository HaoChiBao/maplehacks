import {Route, Routes} from 'react-router-dom';
import Landing from './landing';
import Patient from './Patient/patient';

import Doctor from './Doctor/doctor';
import DoctorDashboard from './Doctor/dashboard';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route path="/patient" element={<Patient />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
    </Routes>
  );
}

export default App;
