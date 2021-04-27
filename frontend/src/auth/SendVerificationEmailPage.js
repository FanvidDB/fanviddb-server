import React, { useState } from "react";
import Helmet from "react-helmet";
import { Alert } from "antd";
import { Localized, useLocalization } from "@fluent/react";
import { useLocation } from "react-router-dom";
import SendVerificationEmailForm from "./SendVerificationEmailForm";

const SendVerificationEmailPage = () => {
  const { l10n } = useLocalization();
  const location = useLocation();
  const [submittedEmail, setSubmittedEmail] = useState();

  const onSubmit = (email) => {
    setSubmittedEmail(email);
  };

  const searchParams = new URLSearchParams(location.search);

  return (
    <div>
      <Helmet>
        <title>
          {l10n.getString("send-verification-email-page-title-bar")}
        </title>
      </Helmet>
      <h1>
        <Localized id="send-verification-email-page-title" />
      </h1>

      {submittedEmail && (
        <Alert
          type="success"
          showIcon
          style={{ marginBottom: "24px" }}
          message={
            <Localized
              id="send-verification-email-form-success"
              vars={{ email: submittedEmail }}
            />
          }
        />
      )}
      <SendVerificationEmailForm
        initialEmail={searchParams.get("email")}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default SendVerificationEmailPage;
