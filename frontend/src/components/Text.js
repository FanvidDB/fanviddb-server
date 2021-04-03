import React from "react";
import PropTypes from "prop-types";

class Text extends React.Component {
  render() {
    const children = this.props.children;
    return <p>{children}</p>;
  }
}

Text.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Text;
