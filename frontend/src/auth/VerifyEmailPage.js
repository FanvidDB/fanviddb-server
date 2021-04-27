import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useParams, Link } from "react-router-dom";
import { Spin } from "antd";
import { Localized, useLocalization } from "@fluent/react";
import { callApi } from "../api";
import _ from "lodash";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState();
  const { l10n } = useLocalization();

  useEffect(() => {
    callApi("/api/auth/verify", "POST", { token: token }).then(
      ({ status, ok, json }) => {
        let errors = [];
        if (status == 400) {
          // Errors from fastapi-users
          // https://frankie567.github.io/fastapi-users/usage/routes/#post-verify
          if (json.detail == "VERIFY_USER_TOKEN_EXPIRED") {
            errors.push(
              <Localized
                key="token-expired"
                id="verify-email-error-token-expired"
                elems={{
                  sendVerificationEmailLink: (
                    <Link to="/verify-email/send"></Link>
                  ),
                }}
              >
                <span></span>
              </Localized>
            );
          } else if (json.detail == "VERIFY_USER_BAD_TOKEN") {
            errors.push(
              <Localized
                key="bad-token"
                id="verify-email-error-bad-token"
                elems={{
                  sendVerificationEmailLink: (
                    <Link to="/verify-email/send"></Link>
                  ),
                }}
              >
                <span></span>
              </Localized>
            );
          } else if (json.detail == "VERIFY_USER_ALREADY_VERIFIED") {
            errors.push(
              <Localized
                key="already-verified"
                id="verify-email-error-already-verified"
                elems={{ loginLink: <Link to="/"></Link> }}
              >
                <span></span>
              </Localized>
            );
          }
        }

        if (!_.isEmpty(errors)) {
          setErrors(errors);
        } else if (!ok) {
          setErrors([
            <Localized key="unknown" id="verify-email-error-unknown" />,
          ]);
        }
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <div>
      <Helmet>
        <title>{l10n.getString("verify-email-page-title-bar")}</title>
      </Helmet>
      <h1>
        <Localized id="verify-email-page-title" />
      </h1>
      {isLoading ? (
        <Spin size="large" />
      ) : _.isEmpty(errors) ? (
        <p>
          <Localized
            id="verify-email-success"
            elems={{ loginLink: <Link to="/"></Link> }}
          >
            <span></span>
          </Localized>
        </p>
      ) : (
        <div>{errors}</div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
