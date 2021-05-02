import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Typography, Skeleton } from "antd";
import { Localized } from "@fluent/react";
import { callApi } from "../api";

const { Paragraph, Text } = Typography;

const ApiKeyModal = ({ visible, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    if (!visible) {
      return;
    }
    setIsLoading(true);
    callApi("/api/api_keys/", "POST").then(({ ok, json }) => {
      if (!ok) {
        setErrors([
          <Localized key="error-unknown" id="api-key-create-error-unknown" />,
        ]);
        setApiKey(null);
      } else {
        setErrors([]);
        setApiKey(json.api_key);
      }
      setIsLoading(false);
    });
  }, [visible]);
  return (
    <Modal visible={visible} footer={null} closable={true} onCancel={onClose}>
      <Skeleton
        title={false}
        paragraph={{ rows: 1 }}
        active
        loading={isLoading}
      >
        {apiKey && <Paragraph copyable>{apiKey}</Paragraph>}
        {errors.map((error, index) => (
          <Paragraph key={index}>
            <Text type="danger">{error}</Text>
          </Paragraph>
        ))}
      </Skeleton>
    </Modal>
  );
};

ApiKeyModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ApiKeyModal;
