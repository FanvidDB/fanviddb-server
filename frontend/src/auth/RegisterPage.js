import React from "react";
import LoadableRegisterForm from "./LoadableRegisterForm";
import Helmet from "react-helmet";
import { Localized, useLocalization } from "@fluent/react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  let navigate = useNavigate();
  const { l10n } = useLocalization();

  const onRegister = ({ email }) => {
    navigate(`/verify-email/send?email=${encodeURIComponent(email)}`);
  };

  return (
    <div>
      <Helmet>
        <title>{l10n.getString("register-page-title-bar")}</title>
      </Helmet>
      <h1>
        <Localized id="register-page-title" />
      </h1>

      <LoadableRegisterForm onRegister={onRegister} />
    </div>
  );
};

export default RegisterPage;
