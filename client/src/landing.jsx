function Landing(){
    function patientRedirect(){
        window.location.assign("/patient")
    }
    function doctorRedirect(){
        window.location.assign("/doctor")
    }
    return(
        <div>
            <h1>Landing</h1>
            <button onClick={patientRedirect}>Patient</button>
            <button onClick={doctorRedirect}>Doctor</button>
        </div>
    )
}
export default Landing