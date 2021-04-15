import React from "react";
import LoadableRegisterForm from "./LoadableRegisterForm";
import { Localized } from "@fluent/react";
import { useHistory } from "react-router-dom";

const RegisterPage = () => {
  const history = useHistory();

  const onRegister = ({ email }) => {
    history.push("/verify", {
      sendToEmail: email,
    });
  };

  return (
    <div>
      <h1>
        <Localized id="register-page-title" />
      </h1>

      <LoadableRegisterForm onRegister={onRegister} />
    </div>
  );
};

export default RegisterPage;
