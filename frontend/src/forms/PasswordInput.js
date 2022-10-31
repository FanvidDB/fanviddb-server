import React from "react";
import { Progress, Input } from "antd";
import zxcvbn from "zxcvbn";
import PropTypes from "prop-types";

const PasswordInput = (props) => {
  // Limit to 100 characters for performance reasons.
  const passwordStrength = zxcvbn((props.value || "").substring(0, 100));

  return (
    <div>
      <Input.Password {...props} />
      <Progress
        showInfo={false}
        steps={4}
        percent={25 * passwordStrength.score}
      />
    </div>
  );
};

PasswordInput.propTypes = {
  value: PropTypes.string,
};

export default PasswordInput;
