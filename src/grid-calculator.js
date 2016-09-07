export default class GridCalculator {
  constructor() {
    this.invalidate();
  }

  set fixedLeftColumnCount(count) {
    this._fixedLeftColumnCount = count;
    this.invalidate();
  }

  set fixedRightColumnCount(count) {
    this._fixedRightColumnCount = count;
    this.invalidate();
  }

  set fixedHeaderCount(count) {
    this._fixedHeaderCount = count;
    this.invalidate();
  }

  set fixedFooterCount(count) {
    this._fixedFooterCount = count;
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

      sizes.push([ index, pixel, size ]);

      pixel += size;

      ++index;
    }

    return sizes;
  }

  fixedCellsWithinRange(fixedCellCount, estimatedSize, cache, maxCells, calculateSize) {
    const sizes = [];
    let pixel = 0;

    for (let count = fixedCellCount; count > 0; --count) {
      const cellIndex = maxCells - count;

      const size = this.getSize(cellIndex, cache, calculateSize, estimatedSize);

      sizes.push([ cellIndex, pixel, size ]);

      pixel += size;
    }

    return sizes;
  }

  cellsWithinBounds(bounds, rowCount, columnCount) {
    let lastTopRow = null;
    let lastTopRowBottom = 0;

    let lastBottomRow = null;
    let lastBottomRowTop = 0;

    let lastRightColumn = null;
    let lastRightColumnLeft = 0;

    let lastTopColumn = null;
    let lastTopColumnRight = 0;

    const scrollableRowCount = rowCount;
    const scrollableColumnCount = columnCount;

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
                                                 this._fixedLeftColumnCount,
                                                 this.calculateColumnWidth);

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
    const bottomLeftRows = this.fixedCellsWithinRange(this._fixedFooterCount,
                                                      this._estimatedRowHeight,
                                                      this._heightCache,
                                                      rowCount,
                                                      this.calculateRowHeight);

    const bottomLeftColumns = this.cellsWithinRange(0,
                                                    1e9,
                                                    this._estimatedColumnWidth,
                                                    this._widthCache,
                                                    this._fixedLeftColumnCount,
                                                    this.calculateColumnWidth);

    if (bottomLeftRows.length) {
      lastBottomRow = bottomLeftRows[bottomLeftRows.length - 1];
      lastBottomRowTop = lastBottomRow[1] + lastBottomRow[2];
    }

    const leftRows = this.cellsWithinRange(bounds.top + lastTopRowBottom,
                                           bounds.top + bounds.height - lastBottomRowTop,
                                           this._estimatedRowHeight,
                                           this._heightCache,
                                           scrollableRowCount,
                                           this.calculateRowHeight);

    const leftColumns = this.cellsWithinRange(0,
                                              1e9,
                                              this._estimatedColumnWidth,
                                              this._widthCache,
                                              this._fixedLeftColumnCount,
                                              this.calculateColumnWidth);

    // fixed-top-right
    const topRightRows = this.cellsWithinRange(0,
                                               1e9,
                                               this._estimatedRowHeight,
                                               this._heightCache,
                                               this._fixedHeaderCount,
                                               this.calculateRowHeight);

    const topRightColumns = this.fixedCellsWithinRange(this._fixedRightColumnCount,
                                                       this._estimatedColumnWidth,
                                                       this._widthCache,
                                                       columnCount,
                                                       this.calculateColumnWidth);

    // fixed-bottom-left
    const bottomRightRows = this.fixedCellsWithinRange(this._fixedFooterCount,
                                                       this._estimatedRowHeight,
                                                       this._heightCache,
                                                       rowCount,
                                                       this.calculateRowHeight);

    const bottomRightColumns = this.fixedCellsWithinRange(this._fixedRightColumnCount,
                                                          this._estimatedColumnWidth,
                                                          this._widthCache,
                                                          columnCount,
                                                          this.calculateColumnWidth);

    const rightRows = this.cellsWithinRange(bounds.top + lastTopRowBottom,
                                            bounds.top + bounds.height - lastBottomRowTop,
                                            this._estimatedRowHeight,
                                            this._heightCache,
                                            scrollableRowCount,
                                            this.calculateRowHeight);

    const rightColumns = this.fixedCellsWithinRange(this._fixedRightColumnCount,
                                                    this._estimatedColumnWidth,
                                                    this._widthCache,
                                                    columnCount,
                                                    this.calculateColumnWidth);

    if (bottomRightColumns.length) {
      lastRightColumn = bottomRightColumns[bottomRightColumns.length - 1];
      lastRightColumnLeft = lastRightColumn[1] + lastRightColumn[2];
    }

    // fixed-top
    const topRows = this.cellsWithinRange(0,
                                          1e9,
                                          this._estimatedRowHeight,
                                          this._heightCache,
                                          this._fixedHeaderCount,
                                          this.calculateRowHeight);

    const topColumns = this.cellsWithinRange(bounds.left + lastTopColumnRight,
                                             bounds.left + bounds.width - lastRightColumnLeft,
                                             this._estimatedColumnWidth,
                                             this._widthCache,
                                             scrollableColumnCount,
                                             this.calculateColumnWidth);

    // scrollable cells
    const rows = this.cellsWithinRange(bounds.top + lastTopRowBottom,
                                       bounds.top + bounds.height - lastBottomRowTop,
                                       this._estimatedRowHeight,
                                       this._heightCache,
                                       scrollableRowCount,
                                       this.calculateRowHeight);

    const columns = this.cellsWithinRange(bounds.left + lastTopColumnRight,
                                          bounds.left + bounds.width - lastRightColumnLeft,
                                          this._estimatedColumnWidth,
                                          this._widthCache,
                                          scrollableColumnCount,
                                          this.calculateColumnWidth);

    // fixed-bottom
    const bottomRows = this.fixedCellsWithinRange(this._fixedFooterCount,
                                                  this._estimatedRowHeight,
                                                  this._heightCache,
                                                  rowCount,
                                                  this.calculateRowHeight);

    const bottomColumns = this.cellsWithinRange(bounds.left + lastTopColumnRight,
                                                bounds.left + bounds.width - lastRightColumnLeft,
                                                this._estimatedColumnWidth,
                                                this._widthCache,
                                                scrollableColumnCount,
                                                this.calculateColumnWidth);

    const minColumn = columns.length ? columns[0][0] : null;
    const maxColumn = columns.length ? columns[columns.length - 1][0] : null;

    const minRow = rows.length ? rows[0][0] : null;
    const maxRow = rows.length ? rows[rows.length - 1][0] : null;

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
