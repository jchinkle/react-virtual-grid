'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); } /* eslint-disable react/style-prop-object */

var DOUBLE_CLICK_DELAY = 500;

var ResizeHandle = function (_React$Component) {
  _inherits(ResizeHandle, _React$Component);

  function ResizeHandle(props) {
    _classCallCheck(this, ResizeHandle);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.handleTouchStart = function (event) {
      _this.start(event.touches[0].pageX, event.touches[0].pageY);

      event.preventDefault();
    };

    _this.handleTouchMove = function (event) {
      _this.move(event.touches[0].pageX, event.touches[0].pageY);
    };

    _this.handleTouchEnd = function (event) {
      _this.end();
    };

    _this.handleMouseDown = function (event) {
      _this._clickCount++;

      setTimeout(function () {
        _this._clickCount = Math.max(0, _this._clickCount - 1);
      }, DOUBLE_CLICK_DELAY);

      if (_this._clickCount > 1) {
        _this._clickCount = 0;

        if (_this.props.onResizeDoubleClick) {
          _this.props.onResizeDoubleClick();
          return;
        }
      }

      _this.start(event.pageX, event.pageY);

      event.preventDefault();
    };

    _this.handleMouseMove = function (event) {
      _this.move(event.pageX, event.pageY);
    };

    _this.handleMouseUp = function (event) {
      _this.end();
    };

    _this.handleMouseEnter = function (event) {
      _this.setState({ hovering: true });
    };

    _this.handleMouseLeave = function (event) {
      _this.setState({ hovering: false });
    };

    _this._pageX = null;
    _this._pageY = null;
    _this._clickCount = 0;

    _this.state = {
      dragging: false,
      hovering: false
    };
    return _this;
  }

  ResizeHandle.prototype.componentWillUnmount = function componentWillUnmount() {
    this.releaseMouse();
    this.releaseTouch();
  };

  ResizeHandle.prototype.render = function render() {
    var styles = ResizeHandle.styles;


    var containerStyles = null;
    var lineStyles = null;

    if (this.props.dimension === 'width') {
      containerStyles = styles.containerWidth;
      lineStyles = styles.lineWidth;
    } else {
      containerStyles = styles.containerHeight;
      lineStyles = styles.lineHeight;
    }

    if (this.state.hovering || this.state.dragging) {
      lineStyles = _extends({}, lineStyles, styles.lineHover);
    }

    return _react2.default.createElement(
      'div',
      { style: containerStyles,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        onMouseDownCapture: this.handleMouseDown,
        onTouchStartCapture: this.handleTouchStart },
      _react2.default.createElement('div', { style: lineStyles })
    );
  };

  ResizeHandle.prototype.start = function start(pageX, pageY) {
    this.setState({ dragging: true });

    this._pageX = pageX;
    this._pageY = pageY;

    this.captureTouch();
    this.captureMouse();

    if (this.props.onResizeStart) {
      this.props.onResizeStart();
    }
  };

  ResizeHandle.prototype.move = function move(pageX, pageY) {
    var diffX = pageX - this._pageX;
    var diffY = pageY - this._pageY;

    if (this.props.onResize) {
      this.props.onResize(diffX, diffY);
    }

    this._pageX = pageX;
    this._pageY = pageY;
  };

  ResizeHandle.prototype.end = function end() {
    this.releaseMouse();
    this.releaseTouch();

    if (this.props.onResizeEnd) {
      this.props.onResizeEnd();
    }

    this.setState({ dragging: false });
  };

  ResizeHandle.prototype.captureMouse = function captureMouse() {
    document.body.addEventListener('mousemove', this.handleMouseMove, true);
    document.body.addEventListener('mouseup', this.handleMouseUp, true);
  };

  ResizeHandle.prototype.releaseMouse = function releaseMouse() {
    document.body.removeEventListener('mousemove', this.handleMouseMove, true);
    document.body.removeEventListener('mouseup', this.handleMouseUp, true);
  };

  ResizeHandle.prototype.captureTouch = function captureTouch() {
    document.body.addEventListener('touchmove', this.handleTouchMove, true);
    document.body.addEventListener('touchend', this.handleTouchEnd, true);
  };

  ResizeHandle.prototype.releaseTouch = function releaseTouch() {
    document.body.removeEventListener('touchmove', this.handleTouchMove, true);
    document.body.removeEventListener('touchend', this.handleTouchEnd, true);
  };

  return ResizeHandle;
}(_react2.default.Component);

ResizeHandle.propTypes = {
  onResizeStart: _react2.default.PropTypes.func,
  onResize: _react2.default.PropTypes.func,
  onResizeEnd: _react2.default.PropTypes.func,
  onResizeDoubleClick: _react2.default.PropTypes.func,
  dimension: _react2.default.PropTypes.string
};
ResizeHandle.defaultProps = {
  dimension: 'width'
};
exports.default = ResizeHandle;


var styles = {
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
    left: 6,
    top: -2,
    width: 5,
    bottom: -1,
    backgroundColor: 'transparent',
    opacity: 1,
    borderRadius: 0
  },

  lineHeight: {
    position: 'absolute',
    top: 5,
    left: -1,
    right: -1,
    height: 5,
    backgroundColor: 'transparent',
    opacity: 1,
    borderRadius: 0
  },

  lineHover: {
    backgroundColor: '#18a3f7'
  }
};

ResizeHandle.styles = styles;
//# sourceMappingURL=resize-handle.js.map