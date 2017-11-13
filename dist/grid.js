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

var _iscrollProbe = require('iscroll/build/iscroll-probe');

var _iscrollProbe2 = _interopRequireDefault(_iscrollProbe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

/* eslint-disable react/no-unused-prop-types */

var Grid = function (_React$Component) {
  _inherits(Grid, _React$Component);

  function Grid(props) {
    _classCallCheck(this, Grid);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    _this._scrolling = false;

    _this._pinnedColumnWidths = {};
    _this._pinnedRowHeights = {};

    _this._sizeDetector = (0, _elementResizeDetector2.default)({ strategy: 'scroll' });

    _this.state = {};
    return _this;
  }

  Grid.prototype.componentDidMount = function componentDidMount() {
    this._sizeDetector.listenTo(this._root, this.handleResize);

    this.update(0, 0);

    var scrollOptions = _extends({
      disableMouse: true,
      bounce: false, // disable bounce because we're already customizing positioning
      scrollX: true,
      freeScroll: true,
      scrollbars: true,
      probeType: 3,
      mouseWheel: true,
      preventDefault: false,
      interactiveScrollbars: true
    }, this.props.scrollOptions);

    this._scroller = new _iscrollProbe2.default(this._scrollInner, scrollOptions);
    this._scroller.on('scroll', this.handleScroll);
    this._scroller.on('scrollStart', this.handleScrollStart);
    this._scroller.on('scrollEnd', this.handleScrollEnd);
  };

  Grid.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.refresh(true, nextProps);
  };

  Grid.prototype.componentWillUnmount = function componentWillUnmount() {
    this._sizeDetector.uninstall(this._root);

    this._scroller.off('scroll', this.handleScroll);
    this._scroller.off('scrollStart', this.handleScrollStart);
    this._scroller.off('scrollEnd', this.handleScrollEnd);
    this._scroller.destroy();
  };

  Grid.prototype.render = function render() {
    var styles = Grid.styles;


    var contentStyle = _extends({}, styles.scrollContent, {
      position: 'absolute',
      width: this.calculateScrollableWidth(this.props, this.state.cells),
      height: this.calculateScrollableHeight(this.props, this.state.cells)
    });

    return _react2.default.createElement(
      'div',
      { style: styles.container,
        ref: this.bindRoot,
        key: 'grid-root' },
      _react2.default.createElement(
        'div',
        { style: styles.scrollOverlay,
          ref: this.bindScrollOverlay,
          key: 'grid-scroll-overlay' },
        _react2.default.createElement(
          'div',
          { className: 'scroll-inner',
            style: styles.scrollContainer,
            ref: this.bindScrollInner,
            key: 'grid-scroll-inner' },
          _react2.default.createElement(
            'div',
            { className: (0, _classnames2.default)('scroll-container'),
              style: contentStyle,
              key: 'grid-scroll-container' },
            _react2.default.createElement(
              'div',
              { style: styles.gridBody,
                key: 'grid-scroll-body' },
              this.renderLeftPane(),
              this.renderRightPane(),
              this.renderCenterPane(),
              this.renderColumnResizeGuide(),
              this.renderRowResizeGuide()
            )
          )
        )
      )
    );
  };

  Grid.prototype.renderLeftPane = function renderLeftPane() {
    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      width: this.fixedLeftColumnsWidth
    });

    return _react2.default.createElement(
      'div',
      { ref: this.bindLeftPane,
        className: (0, _classnames2.default)('left-pane'),
        style: attrs,
        key: 'grid-left-pane' },
      this.renderLeftPaneHeader(),
      this.renderLeftPaneFooter(),
      this.renderLeftPaneBody()
    );
  };

  Grid.prototype.renderLeftPaneHeader = function renderLeftPaneHeader() {
    if (!this.state.cells || this.props.fixedLeftColumnCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: 0,
      right: 0,
      height: this.calculateFixedHeadersHeight(this.state.cells)
    });

    var contentStyle = {};

    return _react2.default.createElement(
      'div',
      { ref: this.bindLeftPaneHeader,
        className: (0, _classnames2.default)('left-pane-header'),
        style: attrs,
        key: 'grid-left-pane-header' },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.leftPaneHeaderContent),
          style: contentStyle,
          key: 'grid-left-pane-header-content' },
        this.renderCellRange('left-pane-header', 0, this.props.fixedHeaderCount - 1, 0, this.props.fixedLeftColumnCount - 1, this.state.cells.topLeftRows, this.state.cells.topLeftColumns)
      )
    );
  };

  Grid.prototype.renderLeftPaneFooter = function renderLeftPaneFooter() {
    if (!this.state.cells || this.props.fixedLeftColumnCount < 1 || this.props.fixedFooterCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      bottom: 0,
      right: 0,
      height: this.calculateFixedFootersHeight(this.state.cells)
    });

    var contentStyle = {};

    var fromRow = this.props.rowCount > 0 ? this.props.rowCount - this.props.fixedFooterCount : 0;
    var toRow = fromRow ? fromRow + this.props.fixedFooterCount - 1 : null;

    return _react2.default.createElement(
      'div',
      { ref: this.bindLeftPaneFooter,
        className: (0, _classnames2.default)('left-pane-footer'),
        style: attrs,
        key: 'grid-left-pane-footer' },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.leftPaneFooterContent),
          style: contentStyle,
          key: 'grid-left-pane-footer-content' },
        this.renderCellRange('left-pane-footer', fromRow, toRow, 0, this.props.fixedLeftColumnCount - 1, this.state.cells.bottomLeftRows, this.state.cells.bottomLeftColumns)
      )
    );
  };

  Grid.prototype.renderLeftPaneBody = function renderLeftPaneBody() {
    if (!this.state.cells || this.props.fixedLeftColumnCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: this.calculateFixedHeadersHeight(this.state.cells),
      right: 0,
      bottom: this.calculateFixedFootersHeight(this.state.cells)
    });

    var contentStyle = _extends({
      position: 'absolute',
      width: this.props.estimatedColumnWidth,
      height: this.props.estimatedRowHeight * this.props.rowCount
    }, styles.translatedPane);

    var fromRow = this.state.cells.leftRows.length ? this.state.cells.leftRows[0][0] : null;
    var toRow = this.state.cells.leftRows.length ? this.state.cells.leftRows[this.state.cells.leftRows.length - 1][0] : null;

    return _react2.default.createElement(
      'div',
      { ref: this.bindLeftPaneBody,
        className: (0, _classnames2.default)('left-pane-body'),
        style: attrs,
        key: 'grid-left-pane-body' },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.leftPaneBodyContent),
          style: contentStyle,
          key: 'grid-left-pane-body-content' },
        this.renderCellRange('left-pane-body', fromRow, toRow, 0, this.props.fixedLeftColumnCount - 1, this.state.cells.leftRows, this.state.cells.leftColumns)
      )
    );
  };

  Grid.prototype.renderRightPane = function renderRightPane() {
    if (!this.state.cells || this.props.fixedRightColumnCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      right: 0,
      width: this.fixedRightColumnsWidth
    });

    return _react2.default.createElement(
      'div',
      { ref: this.bindRightPane,
        className: (0, _classnames2.default)('right-pane'),
        style: attrs,
        key: 'grid-right-pane' },
      this.renderRightPaneHeader(),
      this.renderRightPaneFooter(),
      this.renderRightPaneBody()
    );
  };

  Grid.prototype.renderRightPaneHeader = function renderRightPaneHeader() {
    if (!this.state.cells || this.props.fixedRightColumnCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: 0,
      right: 0,
      height: this.calculateFixedHeadersHeight(this.state.cells)
    });

    var contentStyle = {};

    var fromColumn = this.props.columnCount > 0 ? this.props.columnCount - this.props.fixedRightColumnCount : 0;
    var toColumn = fromColumn ? fromColumn + this.props.fixedRightColumnCount - 1 : null;

    return _react2.default.createElement(
      'div',
      { ref: this.bindRightPaneHeader,
        className: (0, _classnames2.default)('right-pane-header'),
        style: attrs,
        key: 'grid-right-pane-header' },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.rightPaneHeaderContent),
          style: contentStyle,
          key: 'grid-right-pane-header-content' },
        this.renderCellRange('right-pane-header', 0, this.props.fixedHeaderCount - 1, fromColumn, toColumn, this.state.cells.topRightRows, this.state.cells.topRightColumns)
      )
    );
  };

  Grid.prototype.renderRightPaneFooter = function renderRightPaneFooter() {
    if (!this.state.cells || this.props.fixedRightColumnCount < 1 || this.props.fixedFooterCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      bottom: 0,
      right: 0,
      height: this.calculateFixedFootersHeight(this.state.cells)
    });

    var contentStyle = {};

    var fromRow = this.props.rowCount > 0 ? this.props.rowCount - this.props.fixedFooterCount : 0;
    var toRow = fromRow ? fromRow + this.props.fixedFooterCount - 1 : null;

    var fromColumn = this.props.columnCount > 0 ? this.props.columnCount - this.props.fixedRightColumnCount : 0;
    var toColumn = fromColumn ? fromColumn + this.props.fixedRightColumnCount - 1 : null;

    return _react2.default.createElement(
      'div',
      { ref: this.bindRightPaneFooter,
        className: (0, _classnames2.default)('right-pane-footer'),
        style: attrs,
        key: 'grid-right-pane-footer' },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.rightPaneFooterContent),
          style: contentStyle,
          key: 'grid-right-pane-footer-content' },
        this.renderCellRange('right-pane-footer', fromRow, toRow, fromColumn, toColumn, this.state.cells.bottomRightRows, this.state.cells.bottomRightColumns)
      )
    );
  };

  Grid.prototype.renderRightPaneBody = function renderRightPaneBody() {
    if (!this.state.cells || this.props.fixedRightColumnCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: this.calculateFixedHeadersHeight(this.state.cells),
      right: 0,
      bottom: this.calculateFixedFootersHeight(this.state.cells)
    });

    var contentStyle = _extends({
      position: 'absolute',
      width: this.props.estimatedColumnWidth,
      height: this.props.estimatedRowHeight * this.props.rowCount,
      top: -this.calculateFixedHeadersHeight(this.state.cells),
      bottom: -this.calculateFixedFootersHeight(this.state.cells)
    }, styles.translatedPane);

    var fromColumn = this.props.columnCount > 0 ? this.props.columnCount - this.props.fixedRightColumnCount : 0;
    var toColumn = fromColumn ? fromColumn + this.props.fixedRightColumnCount - 1 : null;

    var fromRow = this.state.cells.leftRows.length ? this.state.cells.leftRows[0][0] : null;
    var toRow = this.state.cells.leftRows.length ? this.state.cells.leftRows[this.state.cells.leftRows.length - 1][0] : null;

    return _react2.default.createElement(
      'div',
      { ref: this.bindRightPaneBody,
        className: (0, _classnames2.default)('right-pane-body'),
        style: attrs,
        key: 'grid-right-pane-body' },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.rightPaneBodyContent),
          style: contentStyle,
          key: 'grid-right-pane-body-content' },
        this.renderCellRange('right-pane-body', fromRow, toRow, fromColumn, toColumn, this.state.cells.rightRows, this.state.cells.rightColumns)
      )
    );
  };

  Grid.prototype.renderCenterPane = function renderCenterPane() {
    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: this.fixedLeftColumnsWidth,
      right: this.fixedRightColumnsWidth
    });

    return _react2.default.createElement(
      'div',
      { ref: this.bindCenterPane,
        className: (0, _classnames2.default)('center-pane'),
        style: attrs,
        key: 'grid-center-pane' },
      this.renderCenterPaneHeader(),
      this.renderCenterPaneFooter(),
      this.renderCenterPaneBody()
    );
  };

  Grid.prototype.renderCenterPaneHeader = function renderCenterPaneHeader() {
    if (!this.state.cells || this.props.fixedHeaderCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: 0,
      right: 0,
      height: this.calculateFixedHeadersHeight(this.state.cells),
      overflow: 'visible' // TODO(zhm) this is needed for the column menus, what does it possibly break?
    });

    var contentStyle = _extends({
      position: 'absolute',
      width: this.props.estimatedColumnWidth * this.props.columnCount,
      height: this.props.estimatedRowHeight,
      left: -this.fixedLeftColumnsWidth
    }, styles.translatedPane);

    var fromColumn = this.state.cells.topColumns.length ? this.state.cells.topColumns[0][0] : null;
    var toColumn = this.state.cells.topColumns.length ? this.state.cells.topColumns[this.state.cells.topColumns.length - 1][0] : null;

    return _react2.default.createElement(
      'div',
      { ref: this.bindCenterPaneHeader,
        className: (0, _classnames2.default)('center-pane-header'),
        style: attrs,
        key: 'grid-center-pane-header' },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.centerPaneHeaderContent),
          style: contentStyle,
          key: 'grid-center-pane-header-content' },
        this.renderCellRange('center-pane-header', 0, this.props.fixedHeaderCount - 1, fromColumn, toColumn, this.state.cells.topRows, this.state.cells.topColumns)
      )
    );
  };

  Grid.prototype.renderCenterPaneFooter = function renderCenterPaneFooter() {
    if (!this.state.cells || this.props.fixedFooterCount < 1) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      bottom: 0,
      right: 0,
      height: this.calculateFixedFootersHeight(this.state.cells),
      overflow: 'visible' // TODO(zhm) this is needed for the column menus, what does it possibly break?
    });

    var contentStyle = _extends({
      position: 'absolute',
      width: this.props.estimatedColumnWidth * this.props.columnCount,
      height: this.props.estimatedRowHeight,
      left: -this.fixedLeftColumnsWidth
    }, styles.translatedPane);

    var fromColumn = this.state.cells.bottomColumns.length ? this.state.cells.bottomColumns[0][0] : null;
    var toColumn = this.state.cells.bottomColumns.length ? this.state.cells.bottomColumns[this.state.cells.bottomColumns.length - 1][0] : null;

    var fromRow = this.props.rowCount > 0 ? this.props.rowCount - this.props.fixedFooterCount : 0;
    var toRow = fromRow ? fromRow + this.props.fixedFooterCount - 1 : null;

    return _react2.default.createElement(
      'div',
      { ref: this.bindCenterPaneFooter,
        className: (0, _classnames2.default)('center-pane-footer'),
        style: attrs,
        key: 'grid-center-pane-footer' },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.centerPaneHeaderContent),
          style: contentStyle,
          key: 'grid-center-pane-footer-content' },
        this.renderCellRange('center-pane-footer', fromRow, toRow, fromColumn, toColumn, this.state.cells.bottomRows, this.state.cells.bottomColumns)
      )
    );
  };

  Grid.prototype.renderCenterPaneBody = function renderCenterPaneBody() {
    if (!this.state.cells) {
      return null;
    }

    var styles = Grid.styles;


    var attrs = _extends({}, styles.pane, {
      left: 0,
      top: this.calculateFixedHeadersHeight(this.state.cells),
      right: 0,
      bottom: this.calculateFixedFootersHeight(this.state.cells)
    });

    var contentStyle = _extends({
      position: 'absolute',
      width: this.props.estimatedColumnWidth * this.props.columnCount,
      height: this.props.estimatedRowHeight * this.props.rowCount,
      left: -this.fixedLeftColumnsWidth,
      top: -this.calculateFixedHeadersHeight(this.state.cells)
    }, styles.translatedPane);

    var fromRow = this.state.cells.rows.length ? this.state.cells.rows[0][0] : null;
    var toRow = this.state.cells.rows.length ? this.state.cells.rows[this.state.cells.rows.length - 1][0] : null;

    var fromColumn = this.state.cells.columns.length ? this.state.cells.columns[0][0] : null;
    var toColumn = this.state.cells.columns.length ? this.state.cells.columns[this.state.cells.columns.length - 1][0] : null;

    return _react2.default.createElement(
      'div',
      { ref: this.bindCenterPaneBody,
        className: (0, _classnames2.default)('center-pane-body'),
        style: attrs,
        key: 'grid-center-pane-body' },
      _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)(styles.centerPaneBodyContent),
          style: contentStyle,
          key: 'grid-center-pane-body-content' },
        this.renderCellRange('center-pane-body', fromRow, toRow, fromColumn, toColumn, this.state.cells.rows, this.state.cells.columns)
      )
    );
  };

  Grid.prototype.renderColumnResizeGuide = function renderColumnResizeGuide() {
    var _this2 = this;

    if (this._resizingColumn == null) {
      return null;
    }

    var styles = Grid.styles;


    var column = this.state.cells.columns.find(function (cell) {
      return cell[0] === _this2._resizingColumn;
    });

    var guideStyle = _extends({}, styles.columnResizeGuide, {
      left: column[1] + column[2],
      top: this._centerPaneBody.offsetTop - 1
    });

    return _react2.default.createElement('div', { style: guideStyle,
      key: 'grid-column-resize-guide' });
  };

  Grid.prototype.renderRowResizeGuide = function renderRowResizeGuide() {
    var _this3 = this;

    if (this._resizingRow == null) {
      return null;
    }

    var styles = Grid.styles;


    var row = this.state.cells.rows.find(function (cell) {
      return cell[0] === _this3._resizingRow;
    });

    var guideStyle = _extends({}, styles.rowResizeGuide, {
      top: row[1] + row[2] - 1,
      left: this._leftPane.offsetWidth
    });

    return _react2.default.createElement('div', { style: guideStyle,
      key: 'grid-row-resize-guide' });
  };

  Grid.prototype.calculateScrollableWidth = function calculateScrollableWidth(_ref, cells) {
    var estimatedColumnWidth = _ref.estimatedColumnWidth,
        columnCount = _ref.columnCount;

    if (!cells || !cells.columns.length) {
      return estimatedColumnWidth * columnCount;
    }

    var lastColumn = cells.columns[cells.columns.length - 1];
    var width = lastColumn[1] + lastColumn[2];

    return width + (columnCount - 1 - lastColumn[0]) * estimatedColumnWidth;
  };

  Grid.prototype.calculateScrollableHeight = function calculateScrollableHeight(_ref2, cells) {
    var estimatedRowHeight = _ref2.estimatedRowHeight,
        rowCount = _ref2.rowCount;

    if (!cells || !cells.rows.length) {
      return estimatedRowHeight * rowCount;
    }

    var lastRow = cells.rows[cells.rows.length - 1];
    var height = lastRow[1] + lastRow[2];

    return height + (rowCount - 1 - lastRow[0]) * estimatedRowHeight;
  };

  Grid.prototype.calculateFixedHeadersHeight = function calculateFixedHeadersHeight(cells) {
    if (!cells || !cells.topLeftRows.length) {
      return 0;
    }

    var lastTopLeftRow = cells.topLeftRows[cells.topLeftRows.length - 1];
    var topOffset = lastTopLeftRow[1] + lastTopLeftRow[2];

    return topOffset;
  };

  Grid.prototype.calculateFixedFootersHeight = function calculateFixedFootersHeight(cells) {
    if (!cells || !cells.bottomLeftRows.length) {
      return 0;
    }

    var lastBottomRow = cells.bottomLeftRows[cells.bottomLeftRows.length - 1];
    var lastBottomRowTop = lastBottomRow[1] + lastBottomRow[2];

    return lastBottomRowTop;
  };

  Grid.prototype.invalidateSizes = function invalidateSizes() {
    this.calculator.invalidate();
  };

  Grid.prototype.update = function update(scrollTop, scrollLeft, force, props) {
    var _this4 = this;

    if (!this._root) {
      return;
    }

    props = props || this.props;

    var x = scrollLeft - props.preloadPixelsX;
    var y = scrollTop - props.preloadPixelsY;

    var bounds = {
      left: Math.max(0, x),
      top: Math.max(0, y),
      width: this._root.clientWidth + 2 * props.preloadPixelsX + (x < 0 ? x : 0),
      height: this._root.clientHeight + 2 * props.preloadPixelsY + (y < 0 ? y : 0)
    };

    var cells = this.calculator.cellsWithinBounds(bounds, props.rowCount, props.columnCount);

    if (cells.changed || force) {
      var fromRow = cells.rows.length ? cells.rows[0][0] : null;
      var toRow = cells.rows.length ? cells.rows[cells.rows.length - 1][0] : null;
      var fromColumn = cells.columns.length ? cells.columns[0][0] : null;
      var toColumn = cells.columns.length ? cells.columns[cells.columns.length - 1][0] : null;

      if (props.onExtentsChange) {
        props.onExtentsChange(fromRow, toRow, fromColumn, toColumn);
      }

      this.setState({ cells: cells });
    }

    if (cells) {
      this.setScroll(scrollLeft, scrollTop, cells);
    }

    var scrollableWidth = this.calculateScrollableWidth(props, cells);
    var scrollableHeight = this.calculateScrollableHeight(props, cells);

    // if the srollable width or height changes, refresh the scroller
    if (force || this._lastScrollableWidth !== scrollableWidth || this._lastScrollableHeight !== scrollableHeight) {
      this._lastScrollableWidth = scrollableWidth;
      this._lastScrollableHeight = scrollableHeight;

      // if there were no cells, there might be more cells above. This handles a case where the table renders at a scroll
      // offset with no data. For example, scroll down in a huge list of a results, then filter it to only a few results.
      // The scroll view is left at a large offset but there's no data. Because we don't know how far we'd have to move
      // up to find data, the simplest thing to do is to go to position 0, 0.
      var diffY = Math.max(0, scrollTop + this._root.clientHeight - Math.max(this._root.clientHeight, scrollableHeight));
      var diffX = Math.max(0, scrollLeft + this._root.clientWidth - Math.max(this._root.clientWidth, scrollableWidth));

      setTimeout(function () {
        if (diffY > 0 || diffX > 0) {
          var updatedScrollLeft = scrollLeft - diffX;
          var updatedScrollTop = scrollTop - diffY;

          _this4._scroller.scrollTo(-updatedScrollLeft, -updatedScrollTop);
          _this4.update(updatedScrollTop, updatedScrollLeft);
        }

        _this4._scroller.refresh();
      }, 1);
    }
  };

  Grid.prototype.setScroll = function setScroll(x, y, cells) {
    var fixedHeadersHeight = this.calculateFixedHeadersHeight(cells);

    if (this._leftPaneBody) {
      this._leftPaneBody.childNodes[0].style.top = -y - fixedHeadersHeight + 'px';
    }

    if (this._rightPaneBody) {
      this._rightPaneBody.childNodes[0].style.top = -y - fixedHeadersHeight + 'px';
    }

    if (this._centerPaneHeader) {
      this._centerPaneHeader.childNodes[0].style.left = -x - this.fixedLeftColumnsWidth + 'px';
    }

    if (this._centerPaneFooter) {
      this._centerPaneFooter.childNodes[0].style.left = -x - this.fixedLeftColumnsWidth + 'px';
    }

    if (this._centerPaneBody) {
      this._centerPaneBody.childNodes[0].style.top = -y - fixedHeadersHeight + 'px';
      this._centerPaneBody.childNodes[0].style.left = -x - this.fixedLeftColumnsWidth + 'px';
    }

    if (this._leftPane) {
      this._leftPane.style.left = x + 'px';
      this._leftPane.style.top = y + 'px';
      this._leftPane.style.height = this._scrollOverlay.offsetHeight + 'px';
    }

    if (this._rightPane) {
      this._rightPane.style.left = x + this._scrollOverlay.offsetWidth - this.fixedRightColumnsWidth + 'px';
      this._rightPane.style.top = y + 'px';
      this._rightPane.style.height = this._scrollOverlay.offsetHeight + 'px';
    }

    if (this._centerPane) {
      this._centerPane.style.left = x + this.fixedLeftColumnsWidth + 'px';
      this._centerPane.style.top = y + 'px';
      this._centerPane.style.height = this._scrollOverlay.offsetHeight + 'px';
      this._centerPane.style.width = this._scrollOverlay.offsetWidth - this.fixedRightColumnsWidth - this.fixedLeftColumnsWidth + 'px';
    }

    if (this._scrollInner) {
      if (this._scrollInner.childNodes[0].offsetHeight < this._scrollInner.offsetHeight) {
        this._scrollInner.childNodes[0].style.height = this._scrollInner.offsetHeight + 'px';
      }

      if (this._scrollInner.childNodes[0].offsetWidth < this._scrollInner.offsetWidth) {
        this._scrollInner.childNodes[0].style.width = this._scrollInner.offsetWidth + 'px';
      }
    }
  };

  Grid.prototype.clearPinnedWidths = function clearPinnedWidths() {
    this._pinnedColumnWidths = {};
  };

  Grid.prototype.clearPinnedWidth = function clearPinnedWidth(columnIndex) {
    delete this._pinnedColumnWidths[columnIndex];
  };

  Grid.prototype.clearPinnedHeights = function clearPinnedHeights() {
    this._pinnedRowHeights = {};
  };

  Grid.prototype.clearPinnedHeight = function clearPinnedHeight(rowIndex) {
    delete this._pinnedRowHeights[rowIndex];
  };

  Grid.prototype.renderCells = function renderCells(cells) {
    return cells;
  };

  Grid.prototype.renderRows = function renderRows(rows) {
    return rows;
  };

  Grid.prototype.renderCellRange = function renderCellRange(pane, fromRow, toRow, fromColumn, toColumn, rows, columns) {
    var rowRange = [];

    var renderCell = this.props.renderCell;
    var renderRow = this.props.renderRow || this.renderRow;
    var renderRows = this.props.renderRows || this.renderRows;

    for (var row = toRow, visibleRowIndex = 0; row >= fromRow; --row, ++visibleRowIndex) {
      var rowCells = [];
      var rowData = rows[row - fromRow];
      var columnRange = [];

      for (var column = toColumn, visibleColumnIndex = 0; column >= fromColumn; --column, ++visibleColumnIndex) {
        var columnData = columns[column - fromColumn];

        columnRange.push(columnData);

        rowCells.push(renderCell(pane, row, rowData, column, columnData, this, visibleRowIndex, visibleColumnIndex));
      }

      rowRange.push(renderRow(pane, rowCells, rowData, columnRange));
    }

    return renderRows(rowRange);
  };

  _createClass(Grid, [{
    key: 'isScrolling',
    get: function get() {
      return this._scrolling;
    }
  }, {
    key: 'fixedRightColumnsWidth',
    get: function get() {
      if (!this.state.cells || this.state.cells.rightColumns.length === 0) {
        return 0;
      }

      var lastColumn = this.state.cells.rightColumns[this.state.cells.rightColumns.length - 1];
      var lastOffset = lastColumn[1] + lastColumn[2];

      return lastOffset;
    }
  }, {
    key: 'fixedLeftColumnsWidth',
    get: function get() {
      if (!this.state.cells || !this.state.cells.leftColumns.length) {
        return 0;
      }

      var lastColumn = this.state.cells.leftColumns[this.state.cells.leftColumns.length - 1];
      var lastOffset = lastColumn[1] + lastColumn[2];

      return lastOffset;
    }
  }, {
    key: 'calculator',
    get: function get() {
      if (!this._calculator) {
        this._calculator = new _gridCalculator2.default();
        this._calculator.estimatedColumnWidth = this.props.estimatedColumnWidth;
        this._calculator.estimatedRowHeight = this.props.estimatedRowHeight;
        this._calculator.fixedLeftColumnCount = this.props.fixedLeftColumnCount;
        this._calculator.fixedRightColumnCount = this.props.fixedRightColumnCount;
        this._calculator.fixedHeaderCount = this.props.fixedHeaderCount;
        this._calculator.fixedFooterCount = this.props.fixedFooterCount;
        this._calculator.calculateRowHeight = this.calculateRowHeight;
        this._calculator.calculateColumnWidth = this.calculateColumnWidth;
      }

      return this._calculator;
    }
  }, {
    key: 'scrollTop',
    get: function get() {
      return -this._scroller.y;
    }
  }, {
    key: 'scrollLeft',
    get: function get() {
      return -this._scroller.x;
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

  fixedLeftColumnCount: _react2.default.PropTypes.number,

  fixedRightColumnCount: _react2.default.PropTypes.number,

  fixedHeaderCount: _react2.default.PropTypes.number,

  fixedFooterCount: _react2.default.PropTypes.number,

  columnWidth: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.func]),

  rowHeight: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.func]),

  renderRow: _react2.default.PropTypes.func,

  renderRows: _react2.default.PropTypes.func,

  renderCell: _react2.default.PropTypes.func,

  renderCells: _react2.default.PropTypes.func,

  onExtentsChange: _react2.default.PropTypes.func,

  onScrollStart: _react2.default.PropTypes.func,

  onScroll: _react2.default.PropTypes.func,

  onScrollEnd: _react2.default.PropTypes.func,

  scrollOptions: _react2.default.PropTypes.object
};
Grid.defaultProps = {
  preloadPixelsX: 0,
  preloadPixelsY: 0,
  fixedLeftColumnCount: 0,
  fixedRightColumnCount: 0,
  fixedHeaderCount: 0,
  fixedFooterCount: 0,
  estimatedColumnWidth: 130,
  estimatedRowHeight: 30
};

var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.bindRoot = function (node) {
    _this5._root = node;
  };

  this.bindScrollOverlay = function (node) {
    _this5._scrollOverlay = node;
  };

  this.bindScrollInner = function (node) {
    _this5._scrollInner = node;
  };

  this.bindLeftPane = function (node) {
    _this5._leftPane = node;
  };

  this.bindLeftPaneHeader = function (node) {
    _this5._leftPaneHeader = node;
  };

  this.bindLeftPaneFooter = function (node) {
    _this5._leftPaneFooter = node;
  };

  this.bindLeftPaneBody = function (node) {
    _this5._leftPaneBody = node;
  };

  this.bindRightPane = function (node) {
    _this5._rightPane = node;
  };

  this.bindRightPaneHeader = function (node) {
    _this5._rightPaneHeader = node;
  };

  this.bindRightPaneFooter = function (node) {
    _this5._rightPaneFooter = node;
  };

  this.bindRightPaneBody = function (node) {
    _this5._rightPaneBody = node;
  };

  this.bindCenterPane = function (node) {
    _this5._centerPane = node;
  };

  this.bindCenterPaneHeader = function (node) {
    _this5._centerPaneHeader = node;
  };

  this.bindCenterPaneFooter = function (node) {
    _this5._centerPaneFooter = node;
  };

  this.bindCenterPaneBody = function (node) {
    _this5._centerPaneBody = node;
  };

  this.handleResize = function (event) {
    _this5.update(_this5.scrollTop, _this5.scrollLeft);
  };

  this.handleScroll = function (event) {
    _this5.update(_this5.scrollTop, _this5.scrollLeft);

    if (_this5.props.onScroll) {
      _this5.props.onScroll(_this5);
    }
  };

  this.handleScrollStart = function (event) {
    _this5._scrolling = true;

    if (_this5.props.onScrollStart) {
      _this5.props.onScrollStart(_this5);
    }
  };

  this.handleScrollEnd = function (event) {
    _this5._scrolling = false;

    if (_this5.props.onScrollEnd) {
      _this5.props.onScrollEnd(_this5);
    }
  };

  this.handleColumnResizeStart = function (column, width) {
    _this5._resizingColumn = column;

    // this._pinnedColumnWidths[column] = Math.min(10000, Math.max(20, width));
    _this5.invalidateSizes();
    _this5.refresh();
  };

  this.handleColumnResize = function (column, width) {
    _this5._pinnedColumnWidths[column] = Math.min(10000, Math.max(20, width));
    _this5.invalidateSizes();
    _this5.refresh();
  };

  this.handleColumnResizeEnd = function () {
    _this5._resizingColumn = null;

    _this5.invalidateSizes();
    _this5.refresh();
  };

  this.handleRowResizeStart = function (row, height) {
    _this5._resizingRow = row;

    // this._pinnedRowHeights[row] = Math.min(10000, Math.max(20, height));
    _this5.invalidateSizes();
    _this5.refresh();
  };

  this.handleRowResize = function (row, height) {
    _this5._pinnedRowHeights[row] = Math.min(10000, Math.max(20, height));
    _this5.invalidateSizes();
    _this5.refresh();
  };

  this.handleRowResizeEnd = function () {
    _this5._resizingRow = null;

    _this5.invalidateSizes();
    _this5.refresh();
  };

  this.refresh = function (force, props) {
    _this5.update(_this5.scrollTop, _this5.scrollLeft, force, props || _this5.props);
  };

  this.calculateRowHeight = function (row) {
    if (_this5._pinnedRowHeights[row] != null) {
      return _this5._pinnedRowHeights[row];
    }

    return _this5.props.rowHeight(row);
  };

  this.calculateColumnWidth = function (column) {
    if (_this5._pinnedColumnWidths[column] != null) {
      return _this5._pinnedColumnWidths[column];
    }

    return _this5.props.columnWidth(column);
  };

  this.renderRow = function (pane, cells, rowData, columnRange) {
    var rowIndex = rowData[0],
        rowTop = rowData[1],
        height = rowData[2];


    var rowStyle = {
      position: 'absolute',
      left: 0,
      top: rowTop,
      height: height
    };

    var renderCells = _this5.props.renderCells || _this5.renderCells;

    return _react2.default.createElement(
      'div',
      { key: 'row-' + rowIndex,
        style: rowStyle },
      renderCells(cells)
    );
  };
};

exports.default = Grid;


var styles = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },

  scrollOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },

  scrollContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
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
  },

  translatedPane: {},

  columnResizeGuide: {
    position: 'absolute',
    top: 1,
    bottom: 0,
    width: 1,
    backgroundColor: '#18a3f7',
    cursor: 'ew-resize',
    borderRadius: 0
  },

  rowResizeGuide: {
    position: 'absolute',
    left: 1,
    right: 0,
    height: 1,
    backgroundColor: '#18a3f7',
    cursor: 'ns-resize',
    borderRadius: 0
  }
};

Grid.styles = styles;
//# sourceMappingURL=grid.js.map