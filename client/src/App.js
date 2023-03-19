import { Routes, Route } from "react-router-dom";
import Landing from "./landing";

import Patient from "./Patient/Patient";
import WaitingRoom from "./Patient/WaitingRoom";

import Doctor from "./Doctor/doctor";
import DoctorDashboard from "./Doctor/dashboard";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route path="/patient" element={<Patient />} />
      <Route path="/waiting-room" element={<WaitingRoom />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
    </Routes>
  );
}
export default App;
