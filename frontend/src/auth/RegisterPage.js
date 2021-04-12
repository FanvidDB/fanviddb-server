import React from "react";
import LoadableRegisterForm from "./LoadableRegisterForm";
import { Localized } from "@fluent/react";

const RegisterPage = () => (
  <div>
    <h1>
      <Localized id="register-page-title" />
    </h1>

    <LoadableRegisterForm />
  </div>
);

export default RegisterPage;
