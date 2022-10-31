import React, { useState } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import ResetPasswordForm from "./ResetPasswordForm";
import { Localized, useLocalization } from "@fluent/react";

const ResetPasswordPage = () => {
  const [isReset, setIsReset] = useState(false);
  const { l10n } = useLocalization();
  const onResetPassword = () => {
    setIsReset(true);
  };
  return (
    <>
      <Helmet>
        <title>{l10n.getString("reset-password-page-title-bar")}</title>
      </Helmet>
      <h1>
        <Localized id="reset-password-page-title" />
      </h1>

      {isReset ? (
        <Localized
          id="reset-password-page-success"
          elems={{ loginLink: <Link to="/login"></Link> }}
        >
          <span></span>
        </Localized>
      ) : (
        <ResetPasswordForm onResetPassword={onResetPassword} />
      )}
    </>
  );
};

export default ResetPasswordPage;
