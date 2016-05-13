import React from 'react';
import Grid from './grid';

export default class ResizeHandle extends React.Component {
  static propTypes = {
    onResizeStart: React.PropTypes.func,
    onResize: React.PropTypes.func,
    onResizeEnd: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this._pageX = null;
    this._pageY = null;

    this.state = {};
  }

  componentWillUnmount() {
    this.releaseMouse();
    this.releaseTouch();
  }

  render() {
    const {styles} = ResizeHandle;

    let lineStyles = {
      ...styles.line
    };

    if (this.state.hover) {
      lineStyles = {
        ...lineStyles,
        ...styles.lineHover
      };
    }

    return (
      <div style={styles.container}
           onMouseEnter={this.handleMouseEnter}
           onMouseLeave={this.handleMouseLeave}
           onMouseDownCapture={this.handleMouseDown}
           onTouchStartCapture={this.handleTouchStart}>
        <div style={lineStyles}></div>
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
    this.end(event.touches[0].pageX, event.touches[0].pageY);
  }

  handleMouseDown = (event) => {
    this.start(event.pageX, event.pageY);

    event.preventDefault();
  }

  handleMouseMove = (event) => {
    this.move(event.pageX, event.pageY);
  }

  handleMouseUp = (event) => {
    this.end(event.pageX, event.pageY);
  }

  start(pageX, pageY) {
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

  end(pageX, pageY) {
    this.releaseMouse();
    this.releaseTouch();

    const diffX = pageX - this._pageX;
    const diffY = pageY - this._pageY;

    if (this.props.onResizeEnd) {
      this.props.onResizeEnd(diffX, diffY);
    }
  }

  handleMouseEnter = (event) => {
    this.setState({hover: true});
  }

  handleMouseLeave = (event) => {
    this.setState({hover: false});
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
  container: {
    position: 'absolute',
    top: 0,
    right: -9,
    bottom: 0,
    width: 16,
    cursor: 'ew-resize',
    backgroundColor: 'transparent',
    zIndex: 1
  },

  line: {
    position: 'absolute',
    left: 6,
    top: 0,
    width: 4,
    bottom: 0,
    backgroundColor: 'yellow',
    opacity: 0.3
  },

  lineHover: {
    backgroundColor: 'red'
  }
};

ResizeHandle.styles = styles;
