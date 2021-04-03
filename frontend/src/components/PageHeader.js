import React from "react";
import PropTypes from "prop-types";

class PageHeader extends React.Component {
  render() {
    const children = this.props.children;
    return <h1>{children}</h1>;
  }
}

PageHeader.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PageHeader;
