import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spin } from "antd";
import { Localized } from "@fluent/react";
import { callApi } from "../api";
import _ from "lodash";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState();

  useEffect(() => {
    callApi("/api/auth/verify", "POST", { token: token }).then(({ ok }) => {
      if (ok) {
        setIsLoading(false);
      } else {
        setErrors([<Localized key="0" id="verify-email-error-unknown" />]);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <div>
      <h1>
        <Localized id="verify-email-page-title" />
      </h1>
      {isLoading ? (
        <Spin size="large" />
      ) : _.isEmpty(errors) ? (
        <p>
          <Localized
            id="verify-email-success"
            elems={{ a: <Link to="/"></Link> }}
          />
        </p>
      ) : (
        <div>{errors}</div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
