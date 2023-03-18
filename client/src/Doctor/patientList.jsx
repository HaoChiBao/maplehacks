import DisplayPatient from "./patientDisplay";
import { useState } from "react";
import "./patientList.css";
function PatientList(){
    const patients = [
        {
            name: 'John Doe',
            age: 20,
            reason: 'Cough',
        },
        {
            name: 'Burry Koe',
            age: 10,
            reason: 'Can\'t breath',
        },
        {
            name: 'Alexandar Jorge',
            age: 19,
            reason: 'Dying',
        },
        {
            name: 'John Doe',
            age: 20,
            reason: 'Cough',
        },
        {
            name: 'Burry Koe',
            age: 10,
            reason: 'Can\'t breath',
        }
    ]
    const [currentPatient, setCurrentPatient] = useState(patients[2])
    return (
        <div className="patientlist">
            <h1>Patient List</h1>
            {patients.map((patient) => {
                return <DisplayPatient patient = {patient} key = {'uid'}/>
            })}
        </div>
    )
}
export default PatientList;