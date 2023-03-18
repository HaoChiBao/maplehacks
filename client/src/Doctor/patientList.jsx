import DisplayPatient from "./patientDisplay";
import { useState } from "react";
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
    ]
    const [currentPatient, setCurrentPatient] = useState(patients[2])
    return (
        <div>
            <h1>Patient List</h1>
            {patients.map((patient) => {
                return <DisplayPatient patient = {patient} key = {'uid'}/>
            })}

            <h1>Current Patient</h1>
            <DisplayPatient patient = {currentPatient}/>
        </div>
    )
}
export default PatientList;