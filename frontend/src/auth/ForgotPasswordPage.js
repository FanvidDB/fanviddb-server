import React, { useState } from "react";
import Helmet from "react-helmet";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { Localized, useLocalization } from "@fluent/react";

const ForgotPasswordPage = () => {
  const [isRequested, setIsRequested] = useState(false);
  const { l10n } = useLocalization();
  const onForgotPassword = () => {
    setIsRequested(true);
  };
  return (
    <>
      <Helmet>
        <title>{l10n.getString("forgot-password-page-title-bar")}</title>
      </Helmet>
      <h1>
        <Localized id="forgot-password-page-title" />
      </h1>

      {isRequested ? <Localized id="forgot-password-page-requested" /> : <ForgotPasswordForm onForgotPassword={onForgotPassword} />}
    </>
  );
};

export default ForgotPasswordPage;
