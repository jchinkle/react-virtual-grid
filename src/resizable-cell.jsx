import React from 'react';
import ResizeHandle from './resize-handle';

export default class ResizableCell extends React.Component {
  static propTypes = {
    onColumnResize: React.PropTypes.func,
    onRowResize: React.PropTypes.func,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    rowIndex: React.PropTypes.number.isRequired,
    columnIndex: React.PropTypes.number.isRequired
  };

  renderColumnResizeHandle() {
    return (
      <ResizeHandle onResize={this.handleColumnResize} />
    );
  }

  renderRowResizeHandle() {
    return (
      <ResizeHandle onResize={this.handleRowResize}
                    dimension="height" />
    );
  }

  handleColumnResize = (widthChange, heightChange) => {
    if (this.props.onColumnResize) {
      this.props.onColumnResize(this.props.columnIndex, this.props.width + widthChange);
    }
  }

  handleRowResize = (widthChange, heightChange) => {
    if (this.props.onRowResize) {
      this.props.onRowResize(this.props.rowIndex, this.props.height + heightChange);
    }
  }
}
