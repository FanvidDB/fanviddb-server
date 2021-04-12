import React from "react";
import { Progress } from "antd";
import zxcvbn from "zxcvbn";
import PropTypes from "prop-types";

const PasswordStrengthBar = ({ password }) => {
  // Limit to 100 characters for performance reasons.
  const passwordStrength = zxcvbn((password || "").substring(0, 100));

  return (
    <Progress
      showInfo={false}
      steps={4}
      percent={25 * passwordStrength.score}
    />
  );
};

PasswordStrengthBar.propTypes = {
  password: PropTypes.string,
};

export default PasswordStrengthBar;
