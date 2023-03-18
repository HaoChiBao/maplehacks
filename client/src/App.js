<<<<<<< HEAD
import {Route, Routes} from 'react-router-dom';
import Landing from './landing';
import Doctor from './Doctor/doctor';
import Patient from './Patient/patient';
=======
import { Route, Routes } from "react-router-dom";
import Landing from "./landing";
import Doctor from "./Doctor/doctor";
import Patient from "./Patient/patient";
>>>>>>> bc693e9e917854f8df1f556e1b70ba58ef540579

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/patient" element={<Patient />} />
    </Routes>
  );
}

export default App;
