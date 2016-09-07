"use strict";

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GridCalculator = function () {
  function GridCalculator() {
    _classCallCheck(this, GridCalculator);

    this.invalidate();
  }

  GridCalculator.prototype.getSize = function getSize(index, cache, calculateSize, estimatedSize) {
    var customSize = cache[index];

    if (customSize == null) {
      customSize = cache[index] = calculateSize(index);
    }

    return customSize != null ? customSize : estimatedSize;
  };

  GridCalculator.prototype.cellsWithinRange = function cellsWithinRange(minPixel, maxPixel, estimatedSize, cache, maxCells, calculateSize) {
    var pixel = 0;
    var index = 0;

    var sizes = [];

    var found = false;

    // find the first edge
    while (!found) {
      var size = this.getSize(index, cache, calculateSize, estimatedSize);

      if (pixel + size > minPixel) {
        found = true;
      } else {
        pixel += size;

        ++index;
      }
    }

    // find the other edge
    while (maxPixel > pixel && sizes.length < maxCells && index < maxCells) {
      var _size = this.getSize(index, cache, calculateSize, estimatedSize);

      sizes.push([index, pixel, _size]);

      pixel += _size;

      ++index;
    }

    return sizes;
  };

  GridCalculator.prototype.fixedCellsWithinRange = function fixedCellsWithinRange(fixedCellCount, estimatedSize, cache, maxCells, calculateSize) {
    var sizes = [];
    var pixel = 0;

    for (var count = fixedCellCount; count > 0; --count) {
      var cellIndex = maxCells - count;

      var size = this.getSize(cellIndex, cache, calculateSize, estimatedSize);

      sizes.push([cellIndex, pixel, size]);

      pixel += size;
    }

    return sizes;
  };

  GridCalculator.prototype.cellsWithinBounds = function cellsWithinBounds(bounds, rowCount, columnCount) {
    var lastTopRow = null;
    var lastTopRowBottom = 0;

    var lastBottomRow = null;
    var lastBottomRowTop = 0;

    var lastRightColumn = null;
    var lastRightColumnLeft = 0;

    var lastTopColumn = null;
    var lastTopColumnRight = 0;

    var scrollableRowCount = rowCount;
    var scrollableColumnCount = columnCount;

    // fixed-top-left
    var topLeftRows = this.cellsWithinRange(0, 1e9, this._estimatedRowHeight, this._heightCache, this._fixedHeaderCount, this.calculateRowHeight);

    var topLeftColumns = this.cellsWithinRange(0, 1e9, this._estimatedColumnWidth, this._widthCache, this._fixedLeftColumnCount, this.calculateColumnWidth);

    // fixed-left
    if (topLeftRows.length) {
      lastTopRow = topLeftRows[topLeftRows.length - 1];
      lastTopRowBottom = lastTopRow[1] + lastTopRow[2];
    }

    if (topLeftColumns.length) {
      lastTopColumn = topLeftColumns[topLeftColumns.length - 1];
      lastTopColumnRight = lastTopColumn[1] + lastTopColumn[2];
    }

    // fixed-bottom-left
    var bottomLeftRows = this.fixedCellsWithinRange(this._fixedFooterCount, this._estimatedRowHeight, this._heightCache, rowCount, this.calculateRowHeight);

    var bottomLeftColumns = this.cellsWithinRange(0, 1e9, this._estimatedColumnWidth, this._widthCache, this._fixedLeftColumnCount, this.calculateColumnWidth);

    if (bottomLeftRows.length) {
      lastBottomRow = bottomLeftRows[bottomLeftRows.length - 1];
      lastBottomRowTop = lastBottomRow[1] + lastBottomRow[2];
    }

    var leftRows = this.cellsWithinRange(bounds.top + lastTopRowBottom, bounds.top + bounds.height - lastBottomRowTop, this._estimatedRowHeight, this._heightCache, scrollableRowCount, this.calculateRowHeight);

    var leftColumns = this.cellsWithinRange(0, 1e9, this._estimatedColumnWidth, this._widthCache, this._fixedLeftColumnCount, this.calculateColumnWidth);

    // fixed-top-right
    var topRightRows = this.cellsWithinRange(0, 1e9, this._estimatedRowHeight, this._heightCache, this._fixedHeaderCount, this.calculateRowHeight);

    var topRightColumns = this.fixedCellsWithinRange(this._fixedRightColumnCount, this._estimatedColumnWidth, this._widthCache, columnCount, this.calculateColumnWidth);

    // fixed-bottom-left
    var bottomRightRows = this.fixedCellsWithinRange(this._fixedFooterCount, this._estimatedRowHeight, this._heightCache, rowCount, this.calculateRowHeight);

    var bottomRightColumns = this.fixedCellsWithinRange(this._fixedRightColumnCount, this._estimatedColumnWidth, this._widthCache, columnCount, this.calculateColumnWidth);

    var rightRows = this.cellsWithinRange(bounds.top + lastTopRowBottom, bounds.top + bounds.height - lastBottomRowTop, this._estimatedRowHeight, this._heightCache, scrollableRowCount, this.calculateRowHeight);

    var rightColumns = this.fixedCellsWithinRange(this._fixedRightColumnCount, this._estimatedColumnWidth, this._widthCache, columnCount, this.calculateColumnWidth);

    if (bottomRightColumns.length) {
      lastRightColumn = bottomRightColumns[bottomRightColumns.length - 1];
      lastRightColumnLeft = lastRightColumn[1] + lastRightColumn[2];
    }

    // fixed-top
    var topRows = this.cellsWithinRange(0, 1e9, this._estimatedRowHeight, this._heightCache, this._fixedHeaderCount, this.calculateRowHeight);

    var topColumns = this.cellsWithinRange(bounds.left + lastTopColumnRight, bounds.left + bounds.width - lastRightColumnLeft, this._estimatedColumnWidth, this._widthCache, scrollableColumnCount, this.calculateColumnWidth);

    // scrollable cells
    var rows = this.cellsWithinRange(bounds.top + lastTopRowBottom, bounds.top + bounds.height - lastBottomRowTop, this._estimatedRowHeight, this._heightCache, scrollableRowCount, this.calculateRowHeight);

    var columns = this.cellsWithinRange(bounds.left + lastTopColumnRight, bounds.left + bounds.width - lastRightColumnLeft, this._estimatedColumnWidth, this._widthCache, scrollableColumnCount, this.calculateColumnWidth);

    // fixed-bottom
    var bottomRows = this.fixedCellsWithinRange(this._fixedFooterCount, this._estimatedRowHeight, this._heightCache, rowCount, this.calculateRowHeight);

    var bottomColumns = this.cellsWithinRange(bounds.left + lastTopColumnRight, bounds.left + bounds.width - lastRightColumnLeft, this._estimatedColumnWidth, this._widthCache, scrollableColumnCount, this.calculateColumnWidth);

    var minColumn = columns.length ? columns[0][0] : null;
    var maxColumn = columns.length ? columns[columns.length - 1][0] : null;

    var minRow = rows.length ? rows[0][0] : null;
    var maxRow = rows.length ? rows[rows.length - 1][0] : null;

    var same = minColumn === this._minColumn && maxColumn === this._maxColumn && minRow === this._minRow && maxRow === this._maxRow;

    this._minColumn = minColumn;
    this._maxColumn = maxColumn;
    this._minRow = minRow;
    this._maxRow = maxRow;

    return {
      changed: !same,

      columns: columns,
      rows: rows,

      topLeftRows: topLeftRows,
      topLeftColumns: topLeftColumns,

      topRightRows: topRightRows,
      topRightColumns: topRightColumns,

      bottomLeftRows: bottomLeftRows,
      bottomLeftColumns: bottomLeftColumns,

      bottomRightRows: bottomRightRows,
      bottomRightColumns: bottomRightColumns,

      leftRows: leftRows,
      leftColumns: leftColumns,

      rightRows: rightRows,
      rightColumns: rightColumns,

      topRows: topRows,
      topColumns: topColumns,

      bottomRows: bottomRows,
      bottomColumns: bottomColumns
    };
  };

  GridCalculator.prototype.invalidate = function invalidate() {
    this._widthCache = {};
    this._heightCache = {};
    this._minColumn = null;
    this._maxColumn = null;
    this._minRow = null;
    this._maxRow = null;
  };

  _createClass(GridCalculator, [{
    key: "fixedLeftColumnCount",
    set: function set(count) {
      this._fixedLeftColumnCount = count;
      this.invalidate();
    }
  }, {
    key: "fixedRightColumnCount",
    set: function set(count) {
      this._fixedRightColumnCount = count;
      this.invalidate();
    }
  }, {
    key: "fixedHeaderCount",
    set: function set(count) {
      this._fixedHeaderCount = count;
      this.invalidate();
    }
  }, {
    key: "fixedFooterCount",
    set: function set(count) {
      this._fixedFooterCount = count;
      this.invalidate();
    }
  }, {
    key: "estimatedColumnWidth",
    set: function set(width) {
      this._estimatedColumnWidth = width;
      this.invalidate();
    }
  }, {
    key: "estimatedRowHeight",
    set: function set(height) {
      this._estimatedRowHeight = height;
      this.invalidate();
    }
  }]);

  return GridCalculator;
}();

exports.default = GridCalculator;
//# sourceMappingURL=grid-calculator.js.map