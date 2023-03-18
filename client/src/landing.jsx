import React from "react";
import { Link } from "react-router-dom";
import "./landing.css";

const Landing = () => {
  const handleClick = () => {};
  return (
    <div className="landing-page">
      <h1>Welcome</h1>
      <h3>are you seeking medical care</h3>
      <button>
        <Link to={`/patient`}>Patient</Link>
      </button>
      <button>
        {" "}
        <Link to={`/doctor`}>Doctor</Link>
      </button>
    </div>
  );
};
export default Landing;
