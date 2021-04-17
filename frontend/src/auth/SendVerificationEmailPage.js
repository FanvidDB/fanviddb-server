import React, { useState } from "react";
import { Alert } from "antd";
import { Localized } from "@fluent/react";
import { useHistory, useLocation } from "react-router-dom";
import SendVerificationEmailForm from "./SendVerificationEmailForm";

const SendVerificationEmailPage = () => {
  const location = useLocation();
  const history = useHistory();
  const [submittedEmail, setSubmittedEmail] = useState();

  const onInitialSubmit = () => {
    history.replace({ ...location, state: {} });
  };
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
        initialEmail={location.state.sendToEmail}
        onInitialSubmit={onInitialSubmit}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default SendVerificationEmailPage;
