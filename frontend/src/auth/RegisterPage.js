import React from "react";
import RegisterForm from "./RegisterForm";
import { Localized } from "@fluent/react";

const RegisterPage = () => (
  <div>
    <h1>
      <Localized id="register-page-title" />
    </h1>

    <RegisterForm />
  </div>
);

export default RegisterPage;
