import { Routes, Route } from "react-router-dom";
import Landing from "./landing";
import Doctor from "./Doctor/doctor";
import Patient from "./Patient/Patient";
import WaitingRoom from "./Patient/WaitingRoom";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route path="/doctor" element={<Doctor />} />
      <Route path="/patient" element={<Patient />} />
      <Route path="/waiting-room" element={<WaitingRoom />} />
    </Routes>
  );
}

export default App;
