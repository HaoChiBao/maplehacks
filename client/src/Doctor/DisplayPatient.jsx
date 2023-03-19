function DisplayPatient({ name, reason }) {
  return (
    <div style={{ borderBottom: "3px white", paddingBottom: "30px" }}>
    <div className="patient">
      <h3>{name}</h3>
      <h5>Reason: {reason}</h5>
    </div>
    </div>

  );
}
export default DisplayPatient;
