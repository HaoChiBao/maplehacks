import { Routes, Route } from "react-router-dom";
import Landing from "./landing";

import Patient from "./Patient/Patient";
import WaitingRoom from "./Patient/WaitingRoom";
import MeetingRoom from "./Patient/MeetingRoom";
import VideoExit from "./Doctor/VideoExit";

import Doctor from "./Doctor/Doctor";
import DoctorDashboard from "./Doctor/Dashboard";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route path="/patient" element={<Patient />} />
      <Route path="/waiting-room" element={<WaitingRoom />} />

      <Route path="/patient/meeting-room" element={<MeetingRoom />} />

      <Route path="/doctor" element={<Doctor />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/exit" element={<VideoExit />} />
    </Routes>
  );
}
export default App;
