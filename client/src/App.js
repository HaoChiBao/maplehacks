import { Routes, Route } from "react-router-dom";
import Landing from "./landing";

import Patient from "./Patient/patient";
import WaitingRoom from "./Patient/WaitingRoom";
import MeetingRoom from "./Patient/meetingRoom";
import VideoExit from "./Doctor/videoExit";

import Doctor from "./Doctor/doctor";
import DoctorDashboard from "./Doctor/dashboard";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route path="/patient" element={<Patient />} />
      <Route path="/waiting-room" element={<WaitingRoom />} />
      <Route path="/meeting-room" element={<MeetingRoom />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/exit" element={<VideoExit />} />
    </Routes>
  );
}
export default App;
