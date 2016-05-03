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
      // let customSize = cache[index];

      // if (customSize == null) {
      //   customSize = cache[index] = calculateSize(index);
      // }

      // const size = (customSize != null ? customSize : estimatedSize);

      sizes.push([index, pixel, _size]);

      pixel += _size;

      ++index;
    }

    return sizes;
  };

  GridCalculator.prototype.cellsWithinBounds = function cellsWithinBounds(bounds, rowCount, columnCount) {
    var lastRow = null;
    var lastRowHeight = 0;

    var lastColumn = null;
    var lastColumnWidth = 0;

    // fixed-top-left
    var topLeftRows = this.cellsWithinRange(0, 1e9, this._estimatedRowHeight, this._heightCache, this._fixedHeaderCount, this.calculateRowHeight);

    var topLeftColumns = this.cellsWithinRange(0, 1e9, this._estimatedColumnWidth, this._widthCache, this._fixedColumnCount, this.calculateColumnWidth);

    // fixed-left
    if (topLeftRows.length) {
      lastRow = topLeftRows[topLeftRows.length - 1];
      lastRowHeight = lastRow[1] + lastRow[2];
    }

    if (topLeftColumns.length) {
      lastColumn = topLeftColumns[topLeftColumns.length - 1];
      lastColumnWidth = lastColumn[1] + lastColumn[2];
    }

    var leftRows = this.cellsWithinRange(bounds.top + lastRowHeight, bounds.top + bounds.height, this._estimatedRowHeight, this._heightCache, rowCount, this.calculateRowHeight);

    var leftColumns = this.cellsWithinRange(0, 1e9, this._estimatedColumnWidth, this._widthCache, this._fixedColumnCount, this.calculateColumnWidth);

    // fixed-top
    var topRows = this.cellsWithinRange(0, 1e9, this._estimatedRowHeight, this._heightCache, this._fixedHeaderCount, this.calculateRowHeight);

    var topColumns = this.cellsWithinRange(bounds.left + lastColumnWidth, bounds.left + bounds.width, this._estimatedColumnWidth, this._widthCache, columnCount, this.calculateColumnWidth);

    // scrollable cells
    var rows = this.cellsWithinRange(bounds.top + lastRowHeight, bounds.top + bounds.height, this._estimatedRowHeight, this._heightCache, rowCount, this.calculateRowHeight);

    var columns = this.cellsWithinRange(bounds.left + lastColumnWidth, bounds.left + bounds.width, this._estimatedColumnWidth, this._widthCache, columnCount, this.calculateColumnWidth);

    var minColumn = columns[0][0];
    var maxColumn = columns[columns.length - 1][0];

    var minRow = rows[0][0];
    var maxRow = rows[rows.length - 1][0];

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

      leftRows: leftRows,
      leftColumns: leftColumns,

      topRows: topRows,
      topColumns: topColumns
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
    key: "fixedColumnCount",
    set: function set(count) {
      this._fixedColumnCount = count;
      this.invalidate();
    }
  }, {
    key: "fixedHeaderCount",
    set: function set(count) {
      this._fixedHeaderCount = count;
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