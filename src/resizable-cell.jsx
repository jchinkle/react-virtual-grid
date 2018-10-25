import React from 'react';
import PropTypes from 'prop-types';
import ResizeHandle from './resize-handle';

export default class ResizableCell extends React.Component {
  static propTypes = {
    onColumnResizeStart: PropTypes.func,
    onColumnResize: PropTypes.func,
    onColumnResizeEnd: PropTypes.func,
    onColumnResizeDoubleClick: PropTypes.func,
    onRowResizeStart: PropTypes.func,
    onRowResize: PropTypes.func,
    onRowResizeEnd: PropTypes.func,
    onRowResizeDoubleClick: PropTypes.func,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    rowIndex: PropTypes.number.isRequired,
    columnIndex: PropTypes.number.isRequired
  };

  renderColumnResizeHandle() {
    return (
      <ResizeHandle onResizeStart={this.handleColumnResizeStart}
                    onResize={this.handleColumnResize}
                    onResizeEnd={this.handleColumnResizeEnd}
                    onResizeDoubleClick={this.handleColumnResizeDoubleClick} />
    );
  }

  renderRowResizeHandle() {
    return (
      <ResizeHandle onResizeStart={this.handleRowResizeStart}
                    onResize={this.handleRowResize}
                    onResizeEnd={this.handleRowResizeEnd}
                    onResizeDoubleClick={this.handleRowResizeDoubleClick}
                    dimension="height" />
    );
  }

  handleColumnResizeDoubleClick = () => {
    if (this.props.onColumnResizeDoubleClick) {
      this.props.onColumnResizeDoubleClick(this.props);
    }
  }

  handleColumnResizeStart = (widthChange, heightChange) => {
    if (this.props.onColumnResizeStart) {
      this.props.onColumnResizeStart(this.props.columnIndex, this.props.width + widthChange);
    }
  }

  handleColumnResize = (widthChange, heightChange) => {
    if (this.props.onColumnResize) {
      this.props.onColumnResize(this.props.columnIndex, this.props.width + widthChange);
    }
  }

  handleRowResizeDoubleClick = () => {
    if (this.props.onRowResizeDoubleClick) {
      this.props.onRowResizeDoubleClick(this.props);
    }
  }

  handleColumnResizeEnd = () => {
    if (this.props.onColumnResizeEnd) {
      this.props.onColumnResizeEnd();
    }
  }

  handleRowResizeStart = (widthChange, heightChange) => {
    if (this.props.onRowResizeStart) {
      this.props.onRowResizeStart(this.props.rowIndex, this.props.height + heightChange);
    }
  }

  handleRowResize = (widthChange, heightChange) => {
    if (this.props.onRowResize) {
      this.props.onRowResize(this.props.rowIndex, this.props.height + heightChange);
    }
  }

  handleRowResizeEnd = () => {
    if (this.props.onRowResizeEnd) {
      this.props.onRowResizeEnd();
    }
  }
}
