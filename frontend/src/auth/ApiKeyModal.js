import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Typography, Skeleton } from "antd";
import { Localized } from "@fluent/react";

const { Paragraph, Text } = Typography;

const ApiKeyModal = ({ open, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    if (!open) {
      return;
    }
    setIsLoading(true);
    fetch("/api/api_keys", { method: "POST" })
      .then((response) => {
        if (!response.ok) {
          setErrors([
            <Localized key="error-unknown" id="api-key-create-error-unknown" />,
          ]);
          setApiKey(null);
          setIsLoading(false);
        } else {
          response.json().then((json) => {
            setErrors([]);
            setApiKey(json.api_key);
            setIsLoading(false);
          });
        }
      })
      .catch(() => {
        setErrors([
          <Localized key="error-unknown" id="api-key-create-error-unknown" />,
        ]);
        setIsLoading(false);
      });
  }, [open]);
  return (
    <Modal open={open} footer={null} closable={true} onCancel={onCancel}>
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
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ApiKeyModal;
