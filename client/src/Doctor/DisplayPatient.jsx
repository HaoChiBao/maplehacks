function DisplayPatient({ name, reason }) {
  return (
    <div className="patient">
      <h2>{name}</h2>
      Reason:
      <h3>{reason}</h3>
    </div>
  );
}
export default DisplayPatient;
