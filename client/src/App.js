import { Route, Routes } from "react-router-dom";
import Landing from "./landing";
import Doctor from "./Doctor/doctor";
import Patient from "./Patient/patient";

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
