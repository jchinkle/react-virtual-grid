'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fulcrumCore = require('fulcrum-core');

var _measure = require('../measure');

var _measure2 = _interopRequireDefault(_measure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var ResizeHandle = function (_React$Component) {
  _inherits(ResizeHandle, _React$Component);

  function ResizeHandle() {
    _classCallCheck(this, ResizeHandle);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  ResizeHandle.width = function width(element) {
    var _SimpleElementHeaderC = SimpleElementHeaderCell;
    var styles = _SimpleElementHeaderC.styles;


    var html = [element].map(function (e) {
      if (element != null) {
        return '<div class="' + styles.measure + '">' + (e.label || '') + '</div>';
      }

      return null;
    });

    var rects = (0, _measure2.default)(_lodash2.default.compact(html));

    var maxWidth = 0;

    for (var _iterator = rects, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var rect = _ref;

      maxWidth = Math.max(maxWidth, rect.width);
    }

    return { width: Math.ceil(maxWidth) };
  };

  ResizeHandle.prototype.render = function render() {
    var _SimpleElementHeaderC2 = SimpleElementHeaderCell;
    var styles = _SimpleElementHeaderC2.styles;


    return _react2.default.createElement(
      'div',
      { style: this.props.style,
        className: (0, _classnames2.default)(this.props.className, styles.container) },
      this.props.element.label
    );
  };

  return ResizeHandle;
}(_react2.default.Component);

ResizeHandle.propTypes = {
  style: _react2.default.PropTypes.instanceOf(Object),
  className: _react2.default.PropTypes.string,
  element: _react2.default.PropTypes.instanceOf(_fulcrumCore.Element).isRequired
};
exports.default = ResizeHandle;


var styles = {
  container: 'src_resizable-header-cell_jsx-styles-container',
  measure: 'src_resizable-header-cell_jsx-styles-measure'
};

SimpleElementHeaderCell.styles = styles;
//# sourceMappingURL=resizable-header-cell.js.map