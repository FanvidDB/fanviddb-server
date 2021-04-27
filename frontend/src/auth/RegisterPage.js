import React from "react";
import LoadableRegisterForm from "./LoadableRegisterForm";
import Helmet from "react-helmet";
import { Localized, useLocalization } from "@fluent/react";
import { useHistory } from "react-router-dom";

const RegisterPage = () => {
  const history = useHistory();
  const { l10n } = useLocalization();

  const onRegister = ({ email }) => {
    history.push(`/verify-email/send?email=${encodeURIComponent(email)}`);
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
