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
      columnCount: 4096,
      rowCount: 4096,
      fixedColumnCount: 2,
      fixedHeaderCount: 2,
      fixedFooterCount: 2
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
              fixedColumnCount={this.state.fixedColumnCount}
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
    // return parseInt(128 + (((column % 256) + 1)), 10);
  }

  calculateRowHeight = (row) => {
    return 32;
    // return parseInt(32 + ((row % 64) + 1), 10);
  }

  renderCell = (row, rowData, column, columnData) => {
    const [ colIndex, colLeft, width ] = columnData;
    const [ rowIndex, rowTop, height ] = rowData;

    const {styles} = Example;

    const cellNumber = (rowIndex * this.state.columnCount) + colIndex;

    const [ r, g, b ] = toColor(16777215 - cellNumber);

    const backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    // const backgroundColor = 'transparent';

    const left = column < 1 ? 0 : colLeft;
    const top = row < 1 ? 0 : rowTop;

    const attrs = { left, top, width, height, backgroundColor };

    const color = '#' + (16777215 - cellNumber).toString(16);
    const title = rowIndex + '-' + colIndex + ' (' + color + ')';

    const classes = cx(styles.cell,
                       column === this.state.fixedColumnCount && styles.cellLeft);

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
    left: 50,
    top: 50,
    right: 50,
    bottom: 50,
    border: '3px solid #000',
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
  }
});

Example.styles = styles;
