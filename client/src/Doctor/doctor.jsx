import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Doctor.css";

import { System } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
const system = new System();

function Doctor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submitForm = () => {
    console.log(email, password);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(system.getAuth.auth, email, password)
        .then((promise) => {
          console.log(promise.user.uid, "- user reference");
          console.log("auth accepted");

          localStorage.setItem("maplehacks-uid", promise.user.uid);
          localStorage.setItem("maplehacks-isdoctor", true);

          window.location.assign("/doctor/dashboard");

          // will throw error if user is not found
        })
        .catch((error) => {
          console.log(error);
          setMessage("*Incorrect email or password");
        });
    } else {
      setMessage("*Please fill all fields properly");
    }
  };

  return (
    <div className="doctor-page">
      <div className="form">
        <h1>Sign In</h1>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={submitForm}>Sign In</button>
        <div className="message">{message}</div>
      </div>
    </div>
  );
}
export default Doctor;
