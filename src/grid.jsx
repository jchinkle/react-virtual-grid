import React from 'react';
import cx from 'classnames';
import GridCalculator from './grid-calculator';
import elementResizeDetector from 'element-resize-detector';

const POINTER_EVENTS_SCROLL_DELAY = 200;

export default class Grid extends React.Component {
  static propTypes = {
    preloadPixelsX: React.PropTypes.number,

    preloadPixelsY: React.PropTypes.number,

    estimatedRowHeight: React.PropTypes.number,

    estimatedColumnWidth: React.PropTypes.number,

    columnCount: React.PropTypes.number.isRequired,

    rowCount: React.PropTypes.number.isRequired,

    fixedLeftColumnCount: React.PropTypes.number,

    fixedRightColumnCount: React.PropTypes.number,

    fixedHeaderCount: React.PropTypes.number,

    fixedFooterCount: React.PropTypes.number,

    columnWidth: React.PropTypes.oneOfType([ React.PropTypes.number, React.PropTypes.func ]),

    rowHeight: React.PropTypes.oneOfType([ React.PropTypes.number, React.PropTypes.func ]),

    renderCell: React.PropTypes.func,

    onExtentsChange: React.PropTypes.func,

    resizableColumns: React.PropTypes.bool,

    resizableRows: React.PropTypes.bool
  };

  static defaultProps = {
    preloadPixelsX: 0,
    preloadPixelsY: 0,
    fixedLeftColumnCount: 0,
    fixedRightColumnCount: 0,
    fixedHeaderCount: 0,
    fixedFooterCount: 0,
    estimatedColumnWidth: 130,
    estimatedRowHeight: 30,
    resizableColumns: true,
    resizableRows: true
  };

  constructor(props) {
    super(props);

    this._pinnedColumnWidths = {};
    this._pinnedRowHeights = {};

    this._sizeDetector = elementResizeDetector({strategy: 'scroll'});

    this.state = {};
  }

  componentDidMount() {
    this._sizeDetector.listenTo(this._root, this.handleResize);
    this._scrollInner.addEventListener('scroll', this.handleScroll);
    this._root.addEventListener('wheel', this.handleWheel);

    this.update(0, 0);
  }

  componentWillUnmount() {
    this._sizeDetector.uninstall(this._root);
    this._scrollInner.removeEventListener('scroll', this.handleScroll);
    this._root.removeEventListener('wheel', this.handleWheel);
  }

  render() {
    const {styles} = Grid;

    const contentStyle = {
      ...styles.scrollContent,
      width: this.scrollableWidth,
      height: this.scrollableHeight
    };

    return (
      <div style={styles.container}
           ref={this.bindRoot}
           onMouseMove={this.handleRootMouseMove}>
        <div style={styles.gridBody}>
          {this.renderLeftPane()}
          {this.renderRightPane()}
          {this.renderCenterPane()}
          {this.renderColumnResizeGuide()}
          {this.renderRowResizeGuide()}
        </div>
        <div style={styles.scrollOverlay}
             ref={this.bindScrollOverlay}>
          <div style={styles.scrollContainer}
               ref={this.bindScrollInner}>
            <div className={cx('scroll-container', styles.scrollContent)}
                 style={contentStyle}>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderLeftPane() {
    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      top: 0,
      bottom: 0,
      width: this.fixedLeftColumnsWidth
    };

    return (
      <div ref={this.bindLeftPane}
           className={cx()}
           style={attrs}>
        {this.renderLeftPaneHeader()}
        {this.renderLeftPaneFooter()}
        {this.renderLeftPaneBody()}
      </div>
    );
  }

  renderLeftPaneHeader() {
    if (!this.state.cells || this.props.fixedLeftColumnCount < 1) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      top: 0,
      right: 0,
      height: this.fixedHeadersHeight
    };

    const contentStyle = {
    };

    return (
      <div ref={this.bindLeftPaneHeader}
           className={cx()}
           style={attrs}>
        <div className={cx(styles.leftPaneHeaderContent)}
             style={contentStyle}>
          {this.renderCellRange(0, this.props.fixedHeaderCount - 1, 0, this.props.fixedLeftColumnCount - 1, this.state.cells.topLeftRows, this.state.cells.topLeftColumns)}
        </div>
      </div>
    );
  }

  renderLeftPaneFooter() {
    if (!this.state.cells || this.props.fixedLeftColumnCount < 1 || this.props.fixedFooterCount < 1) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      bottom: 0,
      right: 0,
      height: this.fixedFootersHeight
    };

    const contentStyle = {
    };

    const fromRow = this.props.rowCount > 0 ? this.props.rowCount - this.props.fixedFooterCount : 0;
    const toRow = fromRow ? fromRow + this.props.fixedFooterCount - 1 : null;

    return (
      <div ref={this.bindLeftPaneFooter}
           className={cx()}
           style={attrs}>
        <div className={cx(styles.leftPaneFooterContent)}
             style={contentStyle}>
          {this.renderCellRange(fromRow, toRow, 0, this.props.fixedLeftColumnCount - 1, this.state.cells.bottomLeftRows, this.state.cells.bottomLeftColumns)}
        </div>
      </div>
    );
  }

  renderLeftPaneBody() {
    if (!this.state.cells || this.props.fixedLeftColumnCount < 1) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      top: this.fixedHeadersHeight,
      right: 0,
      bottom: this.fixedFootersHeight
    };

    const contentStyle = {
      position: 'absolute',
      width: this.props.estimatedColumnWidth,
      height: this.props.estimatedRowHeight * this.props.rowCount
    };

    const fromRow = this.state.cells.leftRows.length ? this.state.cells.leftRows[0][0] : null;
    const toRow = this.state.cells.leftRows.length ? this.state.cells.leftRows[this.state.cells.leftRows.length - 1][0] : null;

    return (
      <div ref={this.bindLeftPaneBody}
           className={cx()}
           style={attrs}>
        <div className={cx(styles.leftPaneBodyContent)}
             style={contentStyle}>
          {this.renderCellRange(fromRow, toRow, 0, this.props.fixedLeftColumnCount - 1, this.state.cells.leftRows, this.state.cells.leftColumns)}
        </div>
      </div>
    );
  }

  renderRightPane() {
    if (!this.state.cells || this.props.fixedRightColumnCount < 1) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      right: 0,
      top: 0,
      bottom: 0,
      width: this.fixedRightColumnsWidth
    };

    return (
      <div ref={this.bindRightPane}
           className={cx()}
           style={attrs}>
        {this.renderRightPaneHeader()}
        {this.renderRightPaneFooter()}
        {this.renderRightPaneBody()}
      </div>
    );
  }

  renderRightPaneHeader() {
    if (!this.state.cells || this.props.fixedRightColumnCount < 1) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      top: 0,
      right: 0,
      height: this.fixedHeadersHeight
    };

    const contentStyle = {
    };

    const fromColumn = this.props.columnCount > 0 ? this.props.columnCount - this.props.fixedRightColumnCount : 0;
    const toColumn = fromColumn ? fromColumn + this.props.fixedRightColumnCount - 1 : null;

    return (
      <div ref={this.bindRightPaneHeader}
           className={cx()}
           style={attrs}>
        <div className={cx(styles.rightPaneHeaderContent)}
             style={contentStyle}>
          {this.renderCellRange(0, this.props.fixedHeaderCount - 1, fromColumn, toColumn, this.state.cells.topRightRows, this.state.cells.topRightColumns)}
        </div>
      </div>
    );
  }

  renderRightPaneFooter() {
    if (!this.state.cells || this.props.fixedRightColumnCount < 1 || this.props.fixedFooterCount < 1) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      bottom: 0,
      right: 0,
      height: this.fixedFootersHeight
    };

    const contentStyle = {
    };

    const fromRow = this.props.rowCount > 0 ? this.props.rowCount - this.props.fixedFooterCount : 0;
    const toRow = fromRow ? fromRow + this.props.fixedFooterCount - 1 : null;

    const fromColumn = this.props.columnCount > 0 ? this.props.columnCount - this.props.fixedRightColumnCount : 0;
    const toColumn = fromColumn ? fromColumn + this.props.fixedRightColumnCount - 1 : null;

    return (
      <div ref={this.bindRightPaneFooter}
           className={cx()}
           style={attrs}>
        <div className={cx(styles.rightPaneFooterContent)}
             style={contentStyle}>
          {this.renderCellRange(fromRow, toRow, fromColumn, toColumn, this.state.cells.bottomRightRows, this.state.cells.bottomRightColumns)}
        </div>
      </div>
    );
  }

  renderRightPaneBody() {
    if (!this.state.cells || this.props.fixedRightColumnCount < 1) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      top: this.fixedHeadersHeight,
      right: 0,
      bottom: this.fixedFootersHeight
    };

    const contentStyle = {
      position: 'absolute',
      width: this.props.estimatedColumnWidth,
      height: this.props.estimatedRowHeight * this.props.rowCount,
      top: -this.fixedHeadersHeight,
      bottom: -this.fixedFootersHeight
    };

    const fromColumn = this.props.columnCount > 0 ? this.props.columnCount - this.props.fixedRightColumnCount : 0;
    const toColumn = fromColumn ? fromColumn + this.props.fixedRightColumnCount - 1 : null;

    const fromRow = this.state.cells.leftRows.length ? this.state.cells.leftRows[0][0] : null;
    const toRow = this.state.cells.leftRows.length ? this.state.cells.leftRows[this.state.cells.leftRows.length - 1][0] : null;

    return (
      <div ref={this.bindRightPaneBody}
           className={cx()}
           style={attrs}>
        <div className={cx(styles.rightPaneBodyContent)}
             style={contentStyle}>
          {this.renderCellRange(fromRow, toRow, fromColumn, toColumn, this.state.cells.rightRows, this.state.cells.rightColumns)}
        </div>
      </div>
    );
  }

  renderCenterPane() {
    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: this.fixedLeftColumnsWidth,
      top: 0,
      bottom: 0,
      right: this.fixedRightColumnsWidth
    };

    return (
      <div ref={this.bindCenterPane}
           className={cx()}
           style={attrs}>
        {this.renderCenterPaneHeader()}
        {this.renderCenterPaneFooter()}
        {this.renderCenterPaneBody()}
      </div>
    );
  }

  renderCenterPaneHeader() {
    if (!this.state.cells || this.props.fixedHeaderCount < 1) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      top: 0,
      right: 0,
      height: this.fixedHeadersHeight,
      overflow: 'visible' // TODO(zhm) this is needed for the column menus, what does it possibly break?
    };

    const contentStyle = {
      position: 'absolute',
      width: this.props.estimatedColumnWidth * this.props.columnCount,
      height: this.props.estimatedRowHeight,
      left: -this.fixedLeftColumnsWidth
    };

    const fromColumn = this.state.cells.topColumns.length ? this.state.cells.topColumns[0][0] : null;
    const toColumn = this.state.cells.topColumns.length ? this.state.cells.topColumns[this.state.cells.topColumns.length - 1][0] : null;

    return (
      <div ref={this.bindCenterPaneHeader}
           className={cx()}
           style={attrs}>
        <div className={cx(styles.centerPaneHeaderContent)}
             style={contentStyle}>
          {this.renderCellRange(0, this.props.fixedHeaderCount - 1, fromColumn, toColumn, this.state.cells.topRows, this.state.cells.topColumns)}
        </div>
      </div>
    );
  }

  renderCenterPaneFooter() {
    if (!this.state.cells || this.props.fixedFooterCount < 1) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      bottom: 0,
      right: 0,
      height: this.fixedFootersHeight,
      overflow: 'visible' // TODO(zhm) this is needed for the column menus, what does it possibly break?
    };

    const contentStyle = {
      position: 'absolute',
      width: this.props.estimatedColumnWidth * this.props.columnCount,
      height: this.props.estimatedRowHeight,
      left: -this.fixedLeftColumnsWidth
    };

    const fromColumn = this.state.cells.bottomColumns.length ? this.state.cells.bottomColumns[0][0] : null;
    const toColumn = this.state.cells.bottomColumns.length ? this.state.cells.bottomColumns[this.state.cells.bottomColumns.length - 1][0] : null;

    const fromRow = this.props.rowCount > 0 ? this.props.rowCount - this.props.fixedFooterCount : 0;
    const toRow = fromRow ? fromRow + this.props.fixedFooterCount - 1 : null;

    return (
      <div ref={this.bindCenterPaneFooter}
           className={cx()}
           style={attrs}>
        <div className={cx(styles.centerPaneHeaderContent)}
             style={contentStyle}>
          {this.renderCellRange(fromRow, toRow, fromColumn, toColumn, this.state.cells.bottomRows, this.state.cells.bottomColumns)}
        </div>
      </div>
    );
  }

  renderCenterPaneBody() {
    if (!this.state.cells) {
      return null;
    }

    const {styles} = Grid;

    const attrs = {
      ...styles.pane,
      left: 0,
      top: this.fixedHeadersHeight,
      right: 0,
      bottom: this.fixedFootersHeight
    };

    const contentStyle = {
      position: 'absolute',
      width: this.props.estimatedColumnWidth * this.props.columnCount,
      height: this.props.estimatedRowHeight * this.props.rowCount,
      left: -this.fixedLeftColumnsWidth,
      top: -this.fixedHeadersHeight
    };

    const fromRow = this.state.cells.rows.length ? this.state.cells.rows[0][0] : null;
    const toRow = this.state.cells.rows.length ? this.state.cells.rows[this.state.cells.rows.length - 1][0] : null;

    const fromColumn = this.state.cells.columns.length ? this.state.cells.columns[0][0] : null;
    const toColumn = this.state.cells.columns.length ? this.state.cells.columns[this.state.cells.columns.length - 1][0] : null;

    return (
      <div ref={this.bindCenterPaneBody}
           className={cx()}
           style={attrs}>
        <div className={cx(styles.centerPaneBodyContent)}
             style={contentStyle}>
          {this.renderCellRange(fromRow, toRow, fromColumn, toColumn, this.state.cells.rows, this.state.cells.columns)}
        </div>
      </div>
    );
  }

  renderColumnResizeGuide() {
    if (this._resizingColumn == null) {
      return null;
    }

    const {styles} = Grid;

    const column = this.state.cells.columns.find((cell) => {
      return cell[0] === this._resizingColumn;
    });

    const guideStyle = {
      ...styles.columnResizeGuide,
      left: -this._scrollInner.scrollLeft + column[1] + column[2] - 2
    };

    return (
      <div style={guideStyle}></div>
    );
  }

  renderRowResizeGuide() {
    if (this._resizingRow == null) {
      return null;
    }

    const {styles} = Grid;

    const row = this.state.cells.rows.find((cell) => {
      return cell[0] === this._resizingRow;
    });

    const guideStyle = {
      ...styles.rowResizeGuide,
      top: -this._scrollInner.scrollTop + row[1] + row[2] - 2
    };

    return (
      <div style={guideStyle}></div>
    );
  }

  get scrollableWidth() {
    if (!this.state.cells || !this.state.cells.columns.length) {
      return this.props.estimatedColumnWidth * this.props.columnCount;
    }

    const lastColumn = this.state.cells.columns[this.state.cells.columns.length - 1];
    const width = lastColumn[1] + lastColumn[2];

    return width + (((this.props.columnCount - 1) - lastColumn[0]) * this.props.estimatedColumnWidth);
  }

  get scrollableHeight() {
    if (!this.state.cells || !this.state.cells.rows.length) {
      return this.props.estimatedRowHeight * this.props.rowCount;
    }

    const lastRow = this.state.cells.rows[this.state.cells.rows.length - 1];
    const height = lastRow[1] + lastRow[2];

    return height + (((this.props.rowCount - 1) - lastRow[0]) * this.props.estimatedRowHeight);
  }

  get fixedHeadersHeight() {
    if (!this.state.cells || !this.state.cells.topLeftRows.length) {
      return 0;
    }

    const lastTopLeftRow = this.state.cells.topLeftRows[this.state.cells.topLeftRows.length - 1];
    const topOffset = lastTopLeftRow[1] + lastTopLeftRow[2];

    return topOffset;
  }

  get fixedFootersHeight() {
    if (!this.state.cells || !this.state.cells.bottomLeftRows.length) {
      return 0;
    }

    const lastBottomRow = this.state.cells.bottomLeftRows[this.state.cells.bottomLeftRows.length - 1];
    const lastBottomRowTop = lastBottomRow[1] + lastBottomRow[2];

    return lastBottomRowTop;
  }

  get fixedRightColumnsWidth() {
    if (!this.state.cells || this.state.cells.rightColumns.length === 0) {
      return 0;
    }

    const lastColumn = this.state.cells.rightColumns[this.state.cells.rightColumns.length - 1];
    const lastOffset = lastColumn[1] + lastColumn[2];

    return lastOffset;
  }

  get fixedLeftColumnsWidth() {
    if (!this.state.cells || !this.state.cells.leftColumns.length) {
      return 0;
    }

    const lastColumn = this.state.cells.leftColumns[this.state.cells.leftColumns.length - 1];
    const lastOffset = lastColumn[1] + lastColumn[2];

    return lastOffset;
  }

  get scrollbarSize() {
    if (this._scrollbarSize == null) {
      this._scrollbarSize = Math.max(15, this._scrollInner.offsetHeight - this._scrollInner.clientHeight);
    }

    return this._scrollbarSize;
  }

  isOverScrollbar(x, y) {
    const scrollbarSize = this.scrollbarSize;

    return ((x >= this._root.offsetWidth - scrollbarSize) && (x <= this._root.offsetWidth)) ||
           ((y >= this._root.offsetHeight - scrollbarSize) && (y <= this._root.offsetHeight));
  }

  handleRootMouseMove = (event) => {
    const isOverScrollbar = this.isOverScrollbar(event.offsetX, event.offsetY);

    // when the mouse moves between the 2 regions, swap the pointer events
    if (this._isOverScrollbar !== isOverScrollbar) {
      if (isOverScrollbar) {
        // when over the scrollbar area, enable the pointer events on the scroll area
        this.enableScrollableAreaPointerEvents();
      } else {
        // when over the grid area, disable the pointer events on the scroll area so the cells are interactive
        this.disableScrollableAreaPointerEventsSoon();
      }
    }

    this._isOverScrollbar = isOverScrollbar;
  }

  enableScrollableAreaPointerEvents() {
    clearTimeout(this._disableScrollableAreaPointerEventsDelay);
    this._disableScrollableAreaPointerEventsDelay = null;

    this._scrollOverlay.style.pointerEvents = 'auto';
  }

  disableScrollableAreaPointerEventsSoon() {
    clearTimeout(this._disableScrollableAreaPointerEventsDelay);

    this._disableScrollableAreaPointerEventsDelay = setTimeout(() => {
      this._disableScrollableAreaPointerEventsDelay = null;

      if (!this._isOverScrollbar) {
        this.disableScrollableAreaPointerEventsNow();
      }
    }, POINTER_EVENTS_SCROLL_DELAY);
  }

  get isScrolling() {
    return this._disableScrollableAreaPointerEventsDelay != null;
  }

  disableScrollableAreaPointerEventsNow() {
    this._scrollOverlay.style.pointerEvents = 'none';
  }

  bindRoot = (node) => {
    this._root = node;
  }

  bindScrollOverlay = (node) => {
    this._scrollOverlay = node;
  }

  bindScrollInner = (node) => {
    this._scrollInner = node;
  }

  bindLeftPane = (node) => {
    this._leftPane = node;
  }

  bindLeftPaneHeader = (node) => {
    this._leftPaneHeader = node;
  }

  bindLeftPaneFooter = (node) => {
    this._leftPaneFooter = node;
  }

  bindLeftPaneBody = (node) => {
    this._leftPaneBody = node;
  }

  bindRightPane = (node) => {
    this._rightPane = node;
  }

  bindRightPaneHeader = (node) => {
    this._rightPaneHeader = node;
  }

  bindRightPaneFooter = (node) => {
    this._rightPaneFooter = node;
  }

  bindRightPaneBody = (node) => {
    this._rightPaneBody = node;
  }

  bindCenterPane = (node) => {
    this._centerPane = node;
  }

  bindCenterPaneHeader = (node) => {
    this._centerPaneHeader = node;
  }

  bindCenterPaneFooter = (node) => {
    this._centerPaneFooter = node;
  }

  bindCenterPaneBody = (node) => {
    this._centerPaneBody = node;
  }

  handleResize = (event) => {
    const {scrollTop, scrollLeft} = this._scrollInner;

    this.update(scrollTop, scrollLeft);
  }

  handleScroll = (event) => {
    const {scrollTop, scrollLeft} = event.target;

    this.update(scrollTop, scrollLeft);
  }

  handleWheel = (event) => {
    if (!this.isScrolling) {
      this.enableScrollableAreaPointerEvents();
      event.preventDefault();
    }

    this.disableScrollableAreaPointerEventsSoon();
  }

  handleColumnResizeStart = (column, width) => {
    this._resizingColumn = column;

    // this._pinnedColumnWidths[column] = Math.min(10000, Math.max(20, width));
    this.invalidateSizes();
    this.refresh();
  }

  handleColumnResize = (column, width) => {
    this._pinnedColumnWidths[column] = Math.min(10000, Math.max(20, width));
    this.invalidateSizes();
    this.refresh();
  }

  handleColumnResizeEnd = () => {
    this._resizingColumn = null;

    this.invalidateSizes();
    this.refresh();
  }

  handleRowResizeStart = (row, height) => {
    this._resizingRow = row;

    // this._pinnedRowHeights[row] = Math.min(10000, Math.max(20, height));
    this.invalidateSizes();
    this.refresh();
  }

  handleRowResize = (row, height) => {
    this._pinnedRowHeights[row] = Math.min(10000, Math.max(20, height));
    this.invalidateSizes();
    this.refresh();
  }

  handleRowResizeEnd = () => {
    this._resizingRow = null;

    this.invalidateSizes();
    this.refresh();
  }

  invalidateSizes() {
    this.calculator.invalidate();
  }

  refresh = (force) => {
    const {scrollTop, scrollLeft} = this._scrollInner;

    this.update(scrollTop, scrollLeft, force);
  }

  update(scrollTop, scrollLeft, force) {
    const x = scrollLeft - this.props.preloadPixelsX;
    const y = scrollTop - this.props.preloadPixelsY;

    const bounds = {
      left: Math.max(0, x),
      top: Math.max(0, y),
      width: this._root.clientWidth + (2 * this.props.preloadPixelsX) + (x < 0 ? x : 0),
      height: this._root.clientHeight + (2 * this.props.preloadPixelsY) + (y < 0 ? y : 0)
    };

    const cells = this.calculator.cellsWithinBounds(bounds, this.props.rowCount, this.props.columnCount);

    if (cells.changed || force) {
      const fromRow = cells.rows.length ? cells.rows[0][0] : null;
      const toRow = cells.rows.length ? cells.rows[cells.rows.length - 1][0] : null;
      const fromColumn = cells.columns.length ? cells.columns[0][0] : null;
      const toColumn = cells.columns.length ? cells.columns[cells.columns.length - 1][0] : null;

      if (this.props.onExtentsChange) {
        this.props.onExtentsChange(fromRow, toRow, fromColumn, toColumn);
      }

      this.setState({cells: cells});
    }

    if (this.state.cells) {
      this.setScroll(scrollLeft, scrollTop);
    }
  }

  setScroll(x, y) {
    if (this._leftPaneBody) {
      this._leftPaneBody.childNodes[0].style.top = (-y - this.fixedHeadersHeight) + 'px';
    }

    if (this._rightPaneBody) {
      this._rightPaneBody.childNodes[0].style.top = (-y - this.fixedHeadersHeight) + 'px';
    }

    if (this._centerPaneHeader) {
      this._centerPaneHeader.childNodes[0].style.left = (-x - this.fixedLeftColumnsWidth) + 'px';
    }

    if (this._centerPaneFooter) {
      this._centerPaneFooter.childNodes[0].style.left = (-x - this.fixedLeftColumnsWidth) + 'px';
    }

    this._centerPaneBody.childNodes[0].style.top = (-y - this.fixedHeadersHeight) + 'px';
    this._centerPaneBody.childNodes[0].style.left = (-x - this.fixedLeftColumnsWidth) + 'px';
  }

  get calculator() {
    if (!this._calculator) {
      this._calculator = new GridCalculator();
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

  calculateRowHeight = (row) => {
    if (this._pinnedRowHeights[row] != null) {
      return this._pinnedRowHeights[row];
    }

    return this.props.rowHeight(row);
  }

  calculateColumnWidth = (column) => {
    if (this._pinnedColumnWidths[column] != null) {
      return this._pinnedColumnWidths[column];
    }

    return this.props.columnWidth(column);
  }

  renderCellRange(fromRow, toRow, fromColumn, toColumn, rows, columns) {
    const cells = [];

    const render = this.props.renderCell;

    for (let row = toRow; row >= fromRow; --row) {
      for (let column = toColumn; column >= fromColumn; --column) {
        const rowData = rows[row - fromRow];
        const columnData = columns[column - fromColumn];

        cells.push(render(row, rowData, column, columnData, this));
      }
    }

    return cells;
  }
}

const styles = {
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
  },

  columnResizeGuide: {
    position: 'absolute',
    top: 1,
    bottom: 0,
    width: 4,
    backgroundColor: '#18a3f7',
    cursor: 'ew-resize',
    borderRadius: 0
  },

  rowResizeGuide: {
    position: 'absolute',
    left: 1,
    right: 0,
    height: 4,
    backgroundColor: '#18a3f7',
    cursor: 'ns-resize',
    borderRadius: 0
  }
};

Grid.styles = styles;
