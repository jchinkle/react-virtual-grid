export default class GridCalculator {
  constructor() {
    this.invalidate();
  }

  set fixedColumnCount(count) {
    this._fixedColumnCount = count;
    this.invalidate();
  }

  set fixedHeaderCount(count) {
    this._fixedHeaderCount = count;
    this.invalidate();
  }

  set estimatedColumnWidth(width) {
    this._estimatedColumnWidth = width;
    this.invalidate();
  }

  set estimatedRowHeight(height) {
    this._estimatedRowHeight = height;
    this.invalidate();
  }

  getSize(index, cache, calculateSize, estimatedSize) {
    let customSize = cache[index];

    if (customSize == null) {
      customSize = cache[index] = calculateSize(index);
    }

    return (customSize != null ? customSize : estimatedSize);
  }

  cellsWithinRange(minPixel, maxPixel, estimatedSize, cache, maxCells, calculateSize) {
    let pixel = 0;
    let index = 0;

    const sizes = [];

    let found = false;

    // find the first edge
    while (!found) {
      const size = this.getSize(index, cache, calculateSize, estimatedSize);

      if (pixel + size > minPixel) {
        found = true;
      } else {
        pixel += size;

        ++index;
      }
    }

    // find the other edge
    while (maxPixel > pixel && sizes.length < maxCells && index < maxCells) {
      const size = this.getSize(index, cache, calculateSize, estimatedSize);
      // let customSize = cache[index];

      // if (customSize == null) {
      //   customSize = cache[index] = calculateSize(index);
      // }

      // const size = (customSize != null ? customSize : estimatedSize);

      sizes.push([ index, pixel, size ]);

      pixel += size;

      ++index;
    }

    return sizes;
  }

  cellsWithinBounds(bounds, rowCount, columnCount) {
    let lastRow = null;
    let lastRowHeight = 0;

    let lastColumn = null;
    let lastColumnWidth = 0;

    // fixed-top-left
    const topLeftRows = this.cellsWithinRange(0,
                                              1e9,
                                              this._estimatedRowHeight,
                                              this._heightCache,
                                              this._fixedHeaderCount,
                                              this.calculateRowHeight);

    const topLeftColumns = this.cellsWithinRange(0,
                                                 1e9,
                                                 this._estimatedColumnWidth,
                                                 this._widthCache,
                                                 this._fixedColumnCount,
                                                 this.calculateColumnWidth);

    // fixed-left
    if (topLeftRows.length) {
      lastRow = topLeftRows[topLeftRows.length - 1];
      lastRowHeight = lastRow[1] + lastRow[2];
    }

    if (topLeftColumns.length) {
      lastColumn = topLeftColumns[topLeftColumns.length - 1];
      lastColumnWidth = lastColumn[1] + lastColumn[2];
    }

    const leftRows = this.cellsWithinRange(bounds.top + lastRowHeight,
                                           bounds.top + bounds.height,
                                           this._estimatedRowHeight,
                                           this._heightCache,
                                           rowCount,
                                           this.calculateRowHeight);

    const leftColumns = this.cellsWithinRange(0,
                                              1e9,
                                              this._estimatedColumnWidth,
                                              this._widthCache,
                                              this._fixedColumnCount,
                                              this.calculateColumnWidth);

    // fixed-top
    const topRows = this.cellsWithinRange(0,
                                          1e9,
                                          this._estimatedRowHeight,
                                          this._heightCache,
                                          this._fixedHeaderCount,
                                          this.calculateRowHeight);

    const topColumns = this.cellsWithinRange(bounds.left + lastColumnWidth,
                                             bounds.left + bounds.width,
                                             this._estimatedColumnWidth,
                                             this._widthCache,
                                             columnCount,
                                             this.calculateColumnWidth);

    // scrollable cells
    const rows = this.cellsWithinRange(bounds.top + lastRowHeight,
                                       bounds.top + bounds.height,
                                       this._estimatedRowHeight,
                                       this._heightCache,
                                       rowCount,
                                       this.calculateRowHeight);

    const columns = this.cellsWithinRange(bounds.left + lastColumnWidth,
                                          bounds.left + bounds.width,
                                          this._estimatedColumnWidth,
                                          this._widthCache,
                                          columnCount,
                                          this.calculateColumnWidth);

    const minColumn = columns[0][0];
    const maxColumn = columns[columns.length - 1][0];

    const minRow = rows[0][0];
    const maxRow = rows[rows.length - 1][0];

    const same = minColumn === this._minColumn &&
                 maxColumn === this._maxColumn &&
                 minRow === this._minRow &&
                 maxRow === this._maxRow;

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
  }

  invalidate() {
    this._widthCache = {};
    this._heightCache = {};
    this._minColumn = null;
    this._maxColumn = null;
    this._minRow = null;
    this._maxRow = null;
  }
}
