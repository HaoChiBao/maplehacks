import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import logo from "./logo.png";

const Landing = () => {
  return (
    <div className="landing-page">
      <img src={logo}></img>
      <h1>Are you in need of medical care?</h1>
      <button className="patient">
        <Link to={`/patient`}>Get Started</Link>
      </button>
      <button className="doctor">
        <Link to={`/doctor`}>Are you a doctor?</Link>
      </button>
    </div>
  );
};
export default Landing;
