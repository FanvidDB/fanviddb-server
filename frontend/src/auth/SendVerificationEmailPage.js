import React, { useState } from "react";
import { Alert } from "antd";
import { Localized } from "@fluent/react";
import { useLocation } from "react-router-dom";
import SendVerificationEmailForm from "./SendVerificationEmailForm";

const SendVerificationEmailPage = () => {
  const location = useLocation();
  const [submittedEmail, setSubmittedEmail] = useState();

  const onSubmit = (email) => {
    setSubmittedEmail(email);
  };

  return (
    <div>
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
        initialEmail={location.state && location.state.sendToEmail}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default SendVerificationEmailPage;
