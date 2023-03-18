function DisplayPatient(props){
    console.log(props.patient)
    const age = props.patient.age;
    const name = props.patient.name;
    const reason = props.patient.reason;
    return (
        <div className = 'patient'>
            <h2>{name}</h2>
            Age:
            <h3>{age}</h3>
            Reason:
            <h3>{reason}</h3>
        </div>
    )
}
export default DisplayPatient;