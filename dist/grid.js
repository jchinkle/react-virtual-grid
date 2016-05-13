'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _gridCalculator = require('./grid-calculator');

var _gridCalculator2 = _interopRequireDefault(_gridCalculator);

var _elementResizeDetector = require('element-resize-detector');

var _elementResizeDetector2 = _interopRequireDefault(_elementResizeDetector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var POINTER_EVENTS_SCROLL_DELAY = 200;

var Grid = function (_React$Component) {
  _inherits(Grid, _React$Component);

  function Grid(props) {
    _classCallCheck(this, Grid);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.handleRootMouseMove = function (event) {
      var isOverScrollbar = _this.isOverScrollbar(event.clientX, event.clientY);

      // when the mouse moves between the 2 regions, swap the pointer events
      if (_this._isOverScrollbar !== isOverScrollbar) {
        if (isOverScrollbar) {
          // when over the scrollbar area, enable the pointer events on the scroll area
          _this.enableScrollableAreaPointerEvents();
        } else {
          // when over the grid area, disable the pointer events on the scroll area so the cells are interactive
          _this.disableScrollableAreaPointerEventsSoon();
        }
      }

      _this._isOverScrollbar = isOverScrollbar;
    };

    _this.bindRoot = function (node) {
      _this._root = node;
    };

    _this.bindScrollOverlay = function (node) {
      _this._scrollOverlay = node;
    };

    _this.bindScrollInner = function (node) {
      _this._scrollInner = node;
    };

    _this.bindLeftPane = function (node) {
      _this._leftPane = node;
    };

    _this.bindLeftPaneHeader = function (node) {
      _this._leftPaneHeader = node;
    };

    _this.bindLeftPaneBody = function (node) {
      _this._leftPaneBody = node;
    };

    _this.bindRightPane = function (node) {
      _this._rightPane = node;
    };

    _this.bindRightPaneHeader = function (node) {
      _this._rightPaneHeader = node;
    };

    _this.bindRightPaneBody = function (node) {
      _this._rightPaneBody = node;
    };

    _this.handleResize = function (event) {
      var _this$_scrollInner = _this._scrollInner;
      var scrollTop = _this$_scrollInner.scrollTop;
      var scrollLeft = _this$_scrollInner.scrollLeft;


      _this.update(scrollTop, scrollLeft);
    };

    _this.handleScroll = function (event) {
      var _event$target = event.target;
      var scrollTop = _event$target.scrollTop;
      var scrollLeft = _event$target.scrollLeft;


      _this.update(scrollTop, scrollLeft);
    };

    _this.handleWheel = function (event) {
      if (!_this.isScrolling) {
        _this.enableScrollableAreaPointerEvents();
        event.preventDefault();
      }

      _this.disableScrollableAreaPointerEventsSoon();
    };

    _this.handleColumnResize = function (column, width) {
      _this._pinnedColumnWidths[column] = Math.min(10000, Math.max(20, width));
      _this.invalidateSizes();
      _this.refresh();
    };

    _this.handleRowResize = function (row, height) {
      _this._pinnedRowHeights[row] = Math.min(10000, Math.max(20, height));
      _this.invalidateSizes();
      _this.refresh();
    };

    _this.refresh = function () {
      var _this$_scrollInner2 = _this._scrollInner;
      var scrollTop = _this$_scrollInner2.scrollTop;
      var scrollLeft = _this$_scrollInner2.scrollLeft;


      _this.update(scrollTop, scrollLeft);
    };

    _this.calculateRowHeight = function (row) {
      if (_this._pinnedRowHeights[row] != null) {
        return _this._pinnedRowHeights[row];
      }

      return _this.props.rowHeight(row);
    };

    _this.calculateColumnWidth = function (column) {
      if (_this._pinnedColumnWidths[column] != null) {
        return _this._pinnedColumnWidths[column];
      }

      return _this.props.columnWidth(column);
    };

    _this._pinnedColumnWidths = {};
    _this._pinnedRowHeights = {};

    _this._sizeDetector = (0, _elementResizeDetector2.default)({ strategy: 'scroll' });

    _this.state = {};
    return _this;
  }

  Grid.prototype.componentDidMount = function componentDidMount() {
    this._sizeDetector.listenTo(this._root, this.handleResize);
    this._scrollInner.addEventListener('scroll', this.handleScroll);
    this._root.addEventListener('wheel', this.handleWheel);

    this.update(0, 0);
  };

  Grid.prototype.componentWillUnmount = function componentWillUnmount() {
    this._sizeDetector.uninstall(this._root);
    this._scrollInner.removeEventListener('scroll', this.handleScroll);
    this._root.removeEventListener('wheel', this.handleWheel);
  };

  Grid.prototype.render = function render() {
    var styles = Grid.styles;


    var contentStyle = _extends({}, styles.scrollContent, {
      width: this.scrollableWidth,
      height: this.scrollableHeight
    });

    return _react2.default.createElement(
      'div',
      { style: styles.container,
        ref: this.bindRoot,
        onMouseMove: this.handleRootMouseMove },
      _react2.default.createElement(
        'div',
        { style: styles.gridBody },
        this.renderLeftPane(),
        this.renderRightPane()
      ),
      _react2.default.createElement(
        'div',
        { style: styles.scrollOverlay,
          ref: this.bindScrollOverlay },
        _react2.default.createElement(
          'div',
          { style: styles.scrollContainer,
            ref: this.bindScrollInner },
          _react2.default.createElement('div', { className: (0, _classnames2.default)(styles.scrollContent),
            style: contentStyle })
        )
      )
    );
  };

  Grid.prototype.renderLeftPane = function renderLeftPane() {
    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: 0,
      bottom: 0,
      width: this.fixedColumnsWidth
    });

    return _react2.default.createElement(
      'div',
      { ref: this.bindLeftPane,
        className: (0, _classnames2.default)(),
        style: attrs },
      this.renderLeftPaneHeader(),
      this.renderLeftPaneBody()
    );
  };

  Grid.prototype.renderLeftPaneHeader = function renderLeftPaneHeader() {
    if (!this.state.cells || this.props.fixedColumnCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: 0,
      right: 0,
      height: this.fixedHeadersHeight
    });

    var contentStyle = {};

    return _react2.default.createElement(
      'div',
      { ref: this.bindLeftPaneHeader,
        className: (0, _classnames2.default)(),
        style: attrs },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.leftPaneHeaderContent),
          style: contentStyle },
        this.renderCellRange(0, this.props.fixedHeaderCount - 1, 0, this.props.fixedColumnCount - 1, this.state.cells.topLeftRows, this.state.cells.topLeftColumns)
      )
    );
  };

  Grid.prototype.renderLeftPaneBody = function renderLeftPaneBody() {
    if (!this.state.cells || this.props.fixedColumnCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: this.fixedHeadersHeight,
      right: 0,
      bottom: 0
    });

    var contentStyle = {
      position: 'absolute',
      width: this.props.estimatedColumnWidth,
      height: this.props.estimatedRowHeight * this.props.rowCount,
      top: -this.fixedHeadersHeight
    };

    var fromRow = this.state.cells.leftRows[0][0];
    var toRow = this.state.cells.leftRows[this.state.cells.leftRows.length - 1][0];

    return _react2.default.createElement(
      'div',
      { ref: this.bindLeftPaneBody,
        className: (0, _classnames2.default)(),
        style: attrs },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.leftPaneBodyContent),
          style: contentStyle },
        this.renderCellRange(fromRow, toRow, 0, this.props.fixedColumnCount - 1, this.state.cells.leftRows, this.state.cells.leftColumns)
      )
    );
  };

  Grid.prototype.renderRightPane = function renderRightPane() {
    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: this.fixedColumnsWidth,
      top: 0,
      bottom: 0,
      right: 0
    });

    return _react2.default.createElement(
      'div',
      { ref: this.bindRightPane,
        className: (0, _classnames2.default)(),
        style: attrs },
      this.renderRightPaneHeader(),
      this.renderRightPaneBody()
    );
  };

  Grid.prototype.renderRightPaneHeader = function renderRightPaneHeader() {
    if (!this.state.cells || this.props.fixedHeaderCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: 0,
      right: 0,
      height: this.fixedHeadersHeight
    });

    var contentStyle = {
      position: 'absolute',
      width: this.props.estimatedColumnWidth * this.props.columnCount,
      height: this.props.estimatedRowHeight,
      left: -this.fixedColumnsWidth
    };

    var fromColumn = this.state.cells.topColumns[0][0];
    var toColumn = this.state.cells.topColumns[this.state.cells.topColumns.length - 1][0];

    return _react2.default.createElement(
      'div',
      { ref: this.bindRightPaneHeader,
        className: (0, _classnames2.default)(),
        style: attrs },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.rightPaneHeaderContent),
          style: contentStyle },
        this.renderCellRange(0, this.props.fixedHeaderCount - 1, fromColumn, toColumn, this.state.cells.topRows, this.state.cells.topColumns)
      )
    );
  };

  Grid.prototype.renderRightPaneBody = function renderRightPaneBody() {
    if (!this.state.cells) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: this.fixedHeadersHeight,
      right: 0,
      bottom: 0
    });

    var contentStyle = {
      position: 'absolute',
      width: this.props.estimatedColumnWidth * this.props.columnCount,
      height: this.props.estimatedRowHeight * this.props.rowCount,
      left: -this.fixedColumnsWidth,
      top: -this.fixedHeadersHeight
    };

    var fromRow = this.state.cells.rows[0][0];
    var toRow = this.state.cells.rows[this.state.cells.rows.length - 1][0];

    var fromColumn = this.state.cells.columns[0][0];
    var toColumn = this.state.cells.columns[this.state.cells.columns.length - 1][0];

    return _react2.default.createElement(
      'div',
      { ref: this.bindRightPaneBody,
        className: (0, _classnames2.default)(),
        style: attrs },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.rightPaneBodyContent),
          style: contentStyle },
        this.renderCellRange(fromRow, toRow, fromColumn, toColumn, this.state.cells.rows, this.state.cells.columns)
      )
    );
  };

  Grid.prototype.isOverScrollbar = function isOverScrollbar(x, y) {
    var scrollbarSize = this.scrollbarSize;

    return x >= this._root.offsetWidth - scrollbarSize || y >= this._root.offsetHeight - scrollbarSize;
  };

  Grid.prototype.enableScrollableAreaPointerEvents = function enableScrollableAreaPointerEvents() {
    clearTimeout(this._disableScrollableAreaPointerEventsDelay);
    this._disableScrollableAreaPointerEventsDelay = null;

    this._scrollOverlay.style.pointerEvents = 'auto';
  };

  Grid.prototype.disableScrollableAreaPointerEventsSoon = function disableScrollableAreaPointerEventsSoon() {
    var _this2 = this;

    clearTimeout(this._disableScrollableAreaPointerEventsDelay);

    this._disableScrollableAreaPointerEventsDelay = setTimeout(function () {
      _this2._disableScrollableAreaPointerEventsDelay = null;

      if (!_this2._isOverScrollbar) {
        _this2.disableScrollableAreaPointerEventsNow();
      }
    }, POINTER_EVENTS_SCROLL_DELAY);
  };

  Grid.prototype.disableScrollableAreaPointerEventsNow = function disableScrollableAreaPointerEventsNow() {
    this._scrollOverlay.style.pointerEvents = 'none';
  };

  Grid.prototype.invalidateSizes = function invalidateSizes() {
    this.calculator.invalidate();
  };

  Grid.prototype.update = function update(scrollTop, scrollLeft) {
    var x = scrollLeft - this.props.preloadPixelsX;
    var y = scrollTop - this.props.preloadPixelsY;

    var bounds = {
      left: Math.max(0, x),
      top: Math.max(0, y),
      width: this._root.clientWidth + 2 * this.props.preloadPixelsX + (x < 0 ? x : 0),
      height: this._root.clientHeight + 2 * this.props.preloadPixelsY + (y < 0 ? y : 0)
    };

    var cells = this.calculator.cellsWithinBounds(bounds, this.props.rowCount, this.props.columnCount);

    if (cells.changed) {
      var fromRow = cells.rows[0][0];
      var toRow = cells.rows[cells.rows.length - 1][0];
      var fromColumn = cells.columns[0][0];
      var toColumn = cells.columns[cells.columns.length - 1][0];

      if (this.props.onExtentsChange) {
        this.props.onExtentsChange(fromRow, toRow, fromColumn, toColumn);
      }

      this.setState({ cells: cells });
    }

    if (this.state.cells) {
      this.setScroll(scrollLeft, scrollTop);
    }
  };

  Grid.prototype.setScroll = function setScroll(x, y) {
    if (this._leftPaneBody) {
      this._leftPaneBody.childNodes[0].style.top = -y - this.fixedHeadersHeight + 'px';
    }

    if (this._rightPaneHeader) {
      this._rightPaneHeader.childNodes[0].style.left = -x - this.fixedColumnsWidth + 'px';
    }

    this._rightPaneBody.childNodes[0].style.top = -y - this.fixedHeadersHeight + 'px';
    this._rightPaneBody.childNodes[0].style.left = -x - this.fixedColumnsWidth + 'px';
  };

  Grid.prototype.renderCellRange = function renderCellRange(fromRow, toRow, fromColumn, toColumn, rows, columns) {
    var cells = [];

    var render = this.props.renderCell;

    // for (let row = fromRow; row <= toRow; ++row) {
    //   for (let column = fromColumn; column <= toColumn; ++column) {
    for (var row = toRow; row >= fromRow; --row) {
      for (var column = toColumn; column >= fromColumn; --column) {
        var rowData = rows[row - fromRow];
        var columnData = columns[column - fromColumn];

        cells.push(render(row, rowData, column, columnData, this));
      }
    }

    return cells;
  };

  _createClass(Grid, [{
    key: 'scrollableWidth',
    get: function get() {
      if (!this.state.cells || !this.state.cells.columns.length) {
        return this.props.estimatedColumnWidth * this.props.columnCount;
      }

      var lastColumn = this.state.cells.columns[this.state.cells.columns.length - 1];
      var width = lastColumn[1] + lastColumn[2];

      return width + (this.props.columnCount - lastColumn[0] - 1) * this.props.estimatedColumnWidth;
    }
  }, {
    key: 'scrollableHeight',
    get: function get() {
      if (!this.state.cells || !this.state.cells.rows.length) {
        return this.props.estimatedRowHeight * this.props.rowCount;
      }

      var lastRow = this.state.cells.rows[this.state.cells.rows.length - 1];
      var height = lastRow[1] + lastRow[2];

      return height + (this.props.rowCount - lastRow[0] - 1) * this.props.estimatedRowHeight;
    }
  }, {
    key: 'fixedHeadersHeight',
    get: function get() {
      if (!this.state.cells || !this.state.cells.topLeftRows.length) {
        return 0;
      }

      var lastTopLeftRow = this.state.cells.topLeftRows[this.state.cells.topLeftRows.length - 1];
      var topOffset = lastTopLeftRow[1] + lastTopLeftRow[2];

      return topOffset;
    }
  }, {
    key: 'fixedColumnsWidth',
    get: function get() {
      if (!this.state.cells || !this.state.cells.leftColumns.length) {
        return 0;
      }

      var lastLeftColumn = this.state.cells.leftColumns[this.state.cells.leftColumns.length - 1];
      var leftOffset = lastLeftColumn[1] + lastLeftColumn[2];

      return leftOffset;
    }
  }, {
    key: 'scrollbarSize',
    get: function get() {
      if (this._scrollbarSize == null) {
        this._scrollbarSize = Math.max(15, this._scrollInner.offsetHeight - this._scrollInner.clientHeight);
      }

      return this._scrollbarSize;
    }
  }, {
    key: 'isScrolling',
    get: function get() {
      return this._disableScrollableAreaPointerEventsDelay != null;
    }
  }, {
    key: 'calculator',
    get: function get() {
      if (!this._calculator) {
        this._calculator = new _gridCalculator2.default();
        this._calculator.estimatedColumnWidth = this.props.estimatedColumnWidth;
        this._calculator.estimatedRowHeight = this.props.estimatedRowHeight;
        this._calculator.fixedColumnCount = this.props.fixedColumnCount;
        this._calculator.fixedHeaderCount = this.props.fixedHeaderCount;
        this._calculator.calculateRowHeight = this.calculateRowHeight;
        this._calculator.calculateColumnWidth = this.calculateColumnWidth;
      }

      return this._calculator;
    }
  }]);

  return Grid;
}(_react2.default.Component);

Grid.propTypes = {
  preloadPixelsX: _react2.default.PropTypes.number,

  preloadPixelsY: _react2.default.PropTypes.number,

  estimatedRowHeight: _react2.default.PropTypes.number,

  estimatedColumnWidth: _react2.default.PropTypes.number,

  columnCount: _react2.default.PropTypes.number.isRequired,

  rowCount: _react2.default.PropTypes.number.isRequired,

  fixedColumnCount: _react2.default.PropTypes.number,

  fixedHeaderCount: _react2.default.PropTypes.number,

  columnWidth: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.func]),

  rowHeight: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.func]),

  renderCell: _react2.default.PropTypes.func,

  onExtentsChange: _react2.default.PropTypes.func,

  resizableColumns: _react2.default.PropTypes.bool,

  resizableRows: _react2.default.PropTypes.bool
};
Grid.defaultProps = {
  preloadPixelsX: 0,
  preloadPixelsY: 0,
  estimatedColumnWidth: 130,
  estimatedRowHeight: 30,
  resizableColumns: true,
  resizableRows: true
};
exports.default = Grid;


var styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
    // zIndex: 2
  },

  scrollOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    // zIndex: 2,
    overflow: 'hidden',
    pointerEvents: 'none'
  },

  scrollContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch'
  },

  gridBody: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },

  pane: {
    position: 'absolute',
    overflow: 'hidden'
  }
};

Grid.styles = styles;
//# sourceMappingURL=grid.js.map