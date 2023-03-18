function DisplayPatient(props) {
  console.log(props.patient);
  const name = props.patient.name;
  const reason = props.patient.reason;
  return (
    <div className="patient">
      <h2>{name}</h2>
      Reason:
      <h3>{reason}</h3>
    </div>
  );
}
export default DisplayPatient;
