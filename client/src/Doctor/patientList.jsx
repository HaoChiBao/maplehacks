import React, { useState, useEffect } from "react";
import DisplayPatient from "./DisplayPatient";
import "./patientList.css";
import io from "socket.io-client";

const socket = io("http://localhost:3000/");

const PatientList = () => {
  const [currentPatientQueue, setcurrentPatientQueue] = useState([]);

  useEffect(() => {
    socket.emit("get_patient_queue");

    socket.on("patient_queue", (queue) => {
      setcurrentPatientQueue(queue);
    });

    // // Clean up event listener when component unmounts
    // return () => {
    //   socket.off("patient_queue");
    // };
  }, []);

  return (
    <div className="patientlist">
      <h1>Patient List</h1>
      {currentPatientQueue.map((patient) => {
        return (
          <DisplayPatient
            name={patient.name}
            reason={patient.reason}
            key={patient.socketID}
          />
        );
      })}
    </div>
  );
};
export default PatientList;
