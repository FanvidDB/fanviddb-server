import React, { useState } from "react";
import { Progress, Input } from "antd";
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

const PasswordStrengthInput = (props) => {
  const [value, setValue] = useState("");
  return (
    <div>
      <Input.Password {...props} onChange={(e) => setValue(e.target.value)} />
      <PasswordStrengthBar password={value} />
    </div>
  );
};

PasswordStrengthInput.propTypes = {
  value: PropTypes.string,
};

export default PasswordStrengthInput;
