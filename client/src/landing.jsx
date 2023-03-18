import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div>
      <h1>Landing</h1>
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
