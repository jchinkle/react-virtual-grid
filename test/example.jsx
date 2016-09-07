import React from 'react';
import cx from 'classnames';
import Grid from '../src/grid';

const CELL_SIZE = 64;

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
      columnCount: 500000,
      rowCount: 500000,
      fixedLeftColumnCount: 1,
      fixedRightColumnCount: 1,
      fixedHeaderCount: 1,
      fixedFooterCount: 1
    };
  }

  render() {
    const {styles} = Example;

    const rowHeight = CELL_SIZE;
    const columnWidth = CELL_SIZE;

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
    return CELL_SIZE;
  }

  calculateRowHeight = (row) => {
    return CELL_SIZE;
  }

  renderCell = (row, rowData, column, columnData) => {
    const [ colIndex, colLeft, width ] = columnData;
    const [ rowIndex, rowTop, height ] = rowData;

    const {styles} = Example;

    const backgroundColor = 'transparent';

    const isFixed = column === 0 || row === 0 || column === this.state.columnCount - 1 || row === this.state.rowCount - 1;

    const left = column < 1 ? 0 : colLeft;
    const top = row < 1 ? 0 : rowTop;

    const attrs = { left, top, width, height, backgroundColor };

    const title = rowIndex + '-' + colIndex;

    const classes = cx(styles.cell,
                       column === 0 && styles.cellLeft,
                       column === 1 && styles.bodyLeft,
                       row === 0 && column > 1 && styles.cellTop,
                       row === 0 && column === 1 && styles.cellTopFirst,
                       row === this.state.rowCount - 1 && column > 1 && styles.cellBottom,
                       row === this.state.rowCount - 1 && column === 0 && styles.cellBottomFixed,
                       row === this.state.rowCount - 1 && column === 1 && styles.cellBottomFirst,
                       column === this.state.columnCount - 1 && styles.cellRight,
                       isFixed && styles.fixed);

    return (
      <div key={rowIndex + '-' + colIndex}
           style={attrs}
           className={classes}>{title}</div>
    );
  }
}

const styles = cssInJS({
  container: {
    backgroundColor: 'black',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    border: '1px solid transparent',
    boxSizing: 'border-box',
    overflow: 'hidden'
  },

  cell: {
    position: 'absolute',
    overflow: 'hidden',
    borderBottom: '1px solid #1D9DF9',
    borderLeft: '1px solid #1D9DF9',
    borderRight: '1px solid transparent',
    borderTop: '1px solid transparent',
    padding: 3,
    textAlign: 'center',
    fontFamily: 'sans-serif',
    paddingTop: 23,
    fontSize: 10,
    boxSizing: 'border-box',
    color: '#1D9DF9'
  },

  fixed: {
    color: '#F8A104'
  },

  bodyLeft: {
    borderLeft: '1px solid transparent'
  },

  cellTopFirst: {
    borderBottom: '1px solid #F8A104'
  },

  cellTop: {
    borderBottom: '1px solid #F8A104',
    borderLeft: '1px solid #F8A104'
  },

  cellLeft: {
    borderRight: '1px solid #F8A104',
    borderBottom: '1px solid #F8A104',
    borderLeft: '1px solid #F8A104'
  },

  cellRight: {
    borderLeft: '1px solid #F8A104',
    borderBottom: '1px solid #F8A104',
    borderRight: '1px solid #F8A104'
  },

  cellBottomFixed: {
    borderTop: '1px solid #F8A104'
  },

  cellBottomFirst: {
    borderTop: '1px solid #F8A104',
    borderBottom: '1px solid transparent'
  },

  cellBottom: {
    borderTop: '1px solid #F8A104',
    borderLeft: '1px solid #F8A104',
    borderBottom: '1px solid transparent'
  }
});

Example.styles = styles;
