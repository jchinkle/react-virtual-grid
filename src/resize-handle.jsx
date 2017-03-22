/* eslint-disable react/style-prop-object */

import React from 'react';

const DOUBLE_CLICK_DELAY = 500;

export default class ResizeHandle extends React.Component {
  static propTypes = {
    onResizeStart: React.PropTypes.func,
    onResize: React.PropTypes.func,
    onResizeEnd: React.PropTypes.func,
    onResizeDoubleClick: React.PropTypes.func,
    dimension: React.PropTypes.string
  };

  static defaultProps = {
    dimension: 'width'
  };

  constructor(props) {
    super(props);

    this._pageX = null;
    this._pageY = null;
    this._clickCount = 0;

    this.state = {
      dragging: false,
      hovering: false
    };
  }

  componentWillUnmount() {
    this.releaseMouse();
    this.releaseTouch();
  }

  render() {
    const {styles} = ResizeHandle;

    let containerStyles = null;
    let lineStyles = null;

    if (this.props.dimension === 'width') {
      containerStyles = styles.containerWidth;
      lineStyles = styles.lineWidth;
    } else {
      containerStyles = styles.containerHeight;
      lineStyles = styles.lineHeight;
    }

    if (this.state.hovering || this.state.dragging) {
      lineStyles = {
        ...lineStyles,
        ...styles.lineHover
      };
    }

    return (
      <div style={containerStyles}
           onMouseEnter={this.handleMouseEnter}
           onMouseLeave={this.handleMouseLeave}
           onMouseDownCapture={this.handleMouseDown}
           onTouchStartCapture={this.handleTouchStart}>
        <div style={lineStyles} />
      </div>
    );
  }

  handleTouchStart = (event) => {
    this.start(event.touches[0].pageX, event.touches[0].pageY);

    event.preventDefault();
  }

  handleTouchMove = (event) => {
    this.move(event.touches[0].pageX, event.touches[0].pageY);
  }

  handleTouchEnd = (event) => {
    this.end();
  }

  handleMouseDown = (event) => {
    this._clickCount++;

    setTimeout(() => {
      this._clickCount = Math.max(0, this._clickCount - 1);
    }, DOUBLE_CLICK_DELAY);

    if (this._clickCount > 1) {
      this._clickCount = 0;

      if (this.props.onResizeDoubleClick) {
        this.props.onResizeDoubleClick();
        return;
      }
    }

    this.start(event.pageX, event.pageY);

    event.preventDefault();
  }

  handleMouseMove = (event) => {
    this.move(event.pageX, event.pageY);
  }

  handleMouseUp = (event) => {
    this.end();
  }

  start(pageX, pageY) {
    this.setState({dragging: true});

    this._pageX = pageX;
    this._pageY = pageY;

    this.captureTouch();
    this.captureMouse();

    if (this.props.onResizeStart) {
      this.props.onResizeStart();
    }
  }

  move(pageX, pageY) {
    const diffX = pageX - this._pageX;
    const diffY = pageY - this._pageY;

    if (this.props.onResize) {
      this.props.onResize(diffX, diffY);
    }

    this._pageX = pageX;
    this._pageY = pageY;
  }

  end() {
    this.releaseMouse();
    this.releaseTouch();

    if (this.props.onResizeEnd) {
      this.props.onResizeEnd();
    }

    this.setState({dragging: false});
  }

  handleMouseEnter = (event) => {
    this.setState({hovering: true});
  }

  handleMouseLeave = (event) => {
    this.setState({hovering: false});
  }

  captureMouse() {
    document.body.addEventListener('mousemove', this.handleMouseMove, true);
    document.body.addEventListener('mouseup', this.handleMouseUp, true);
  }

  releaseMouse() {
    document.body.removeEventListener('mousemove', this.handleMouseMove, true);
    document.body.removeEventListener('mouseup', this.handleMouseUp, true);
  }

  captureTouch() {
    document.body.addEventListener('touchmove', this.handleTouchMove, true);
    document.body.addEventListener('touchend', this.handleTouchEnd, true);
  }

  releaseTouch() {
    document.body.removeEventListener('touchmove', this.handleTouchMove, true);
    document.body.removeEventListener('touchend', this.handleTouchEnd, true);
  }
}

const styles = {
  containerWidth: {
    position: 'absolute',
    top: 0,
    right: -9,
    bottom: 0,
    width: 16,
    cursor: 'ew-resize',
    backgroundColor: 'transparent',
    // zIndex: 1, TODO(zhm) IE10 seems to need this zIndex to receive any mouse events, I think it ends up below everything somehow
    pointerEvents: 'auto'
  },

  containerHeight: {
    position: 'absolute',
    left: 0,
    bottom: -9,
    right: 0,
    height: 16,
    cursor: 'ns-resize',
    backgroundColor: 'transparent',
    // zIndex: 1,
    pointerEvents: 'auto'
  },

  lineWidth: {
    position: 'absolute',
    left: 7,
    top: -2,
    width: 3,
    bottom: -1,
    backgroundColor: 'transparent',
    opacity: 1,
    borderRadius: 0
  },

  lineHeight: {
    position: 'absolute',
    top: 6,
    left: -1,
    right: -1,
    height: 3,
    backgroundColor: 'transparent',
    opacity: 1,
    borderRadius: 0
  },

  lineHover: {
    backgroundColor: '#18a3f7'
  }
};

ResizeHandle.styles = styles;
