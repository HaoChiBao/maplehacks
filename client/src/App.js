<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
import Landing from "./landing";
import Doctor from "./Doctor/doctor";
import Patient from "./Patient/Patient";
import WaitingRoom from "./Patient/WaitingRoom";
=======
import {Route, Routes} from 'react-router-dom';
import Landing from './landing';
import Patient from './Patient/patient';

import Doctor from './Doctor/doctor';
import DoctorDashboard from './Doctor/dashboard';
>>>>>>> origin

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route path="/patient" element={<Patient />} />
<<<<<<< HEAD
      <Route path="/waiting-room" element={<WaitingRoom />} />
=======
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
>>>>>>> origin
    </Routes>
  );
}

export default App;
