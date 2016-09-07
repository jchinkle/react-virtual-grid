import React from 'react';
import cx from 'classnames';
import Grid from '../src/grid';

function toColor(number) {
  const num = number >>> 0;

  const b = num & 0xFF;
  const g = (num & 0xFF00) >>> 8;
  const r = (num & 0xFF0000) >>> 16;

  return [ r, g, b ];
}

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnCount: 100000,
      rowCount: 100000,
      fixedLeftColumnCount: 1,
      fixedRightColumnCount: 1,
      fixedHeaderCount: 1,
      fixedFooterCount: 1
    };
  }

  render() {
    const {styles} = Example;

    const rowHeight = 32;
    const columnWidth = 128;

    return (
      <div className={cx('table-view', styles.container)}>
        <Grid ref={this.bindGrid}
              columnCount={this.state.columnCount}
              rowCount={this.state.rowCount}
              estimatedColumnWidth={columnWidth}
              estimatedRowHeight={rowHeight}
              fixedLeftColumnCount={this.state.fixedLeftColumnCount}
              fixedRightColumnCount={this.state.fixedRightColumnCount}
              fixedHeaderCount={this.state.fixedHeaderCount}
              fixedFooterCount={this.state.fixedFooterCount}
              renderCell={this.renderCell}
              columnWidth={this.calculateColumnWidth}
              rowHeight={this.calculateRowHeight} />
      </div>
    );
  }

  calculateColumnWidth = (column) => {
    return 128;
  }

  calculateRowHeight = (row) => {
    return 32;
  }

  renderCell = (row, rowData, column, columnData) => {
    const [ colIndex, colLeft, width ] = columnData;
    const [ rowIndex, rowTop, height ] = rowData;

    const {styles} = Example;

    const cellNumber = (rowIndex * this.state.columnCount) + colIndex;

    const [ r, g, b ] = toColor(16777215 - cellNumber);

    const backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';

    const left = column < 1 ? 0 : colLeft;
    const top = row < 1 ? 0 : rowTop;

    const attrs = { left, top, width, height, backgroundColor };

    const title = rowIndex + '-' + colIndex;

    const classes = cx(styles.cell,
                       column === 0 && styles.cellLeft,
                       row === this.state.rowCount - 1 && styles.cellBottom);

    return (
      <div key={rowIndex + '-' + colIndex}
           style={attrs}
           className={classes}>{title}</div>
    );
  }
}

const styles = cssInJS({
  container: {
    position: 'absolute',
    left: 20,
    top: 50,
    right: 20,
    bottom: 20,
    border: '1px solid #000',
    boxSizing: 'border-box',
    overflow: 'hidden'
  },

  cell: {
    position: 'absolute',
    overflow: 'hidden',
    borderBottom: '1px solid #000',
    borderLeft: '1px solid #000',
    borderRight: '1px solid transparent',
    borderTop: '1px solid transparent',
    padding: 3,
    textAlign: 'center',
    fontFamily: 'sans-serif',
    paddingTop: 8,
    fontSize: 12,
    boxSizing: 'border-box'
  },

  cellLeft: {
    borderLeft: '1px solid transparent'
  },

  cellBottom: {
    borderTop: '1px solid #000',
    borderBottom: '1px solid transparent'
  }
});

Example.styles = styles;
