## React Virtual Grid

![Clusters of Information](grid.jpg)

High performance virtual grid. This is a low level component for building fast tables. This component does not load any data and is not intended to be a drop-in widget. Some React and purist principles might be sacrificed for maximum performance.

### Features

* High performance
* Virtual rows + columns
* Dynamic per-row heights and per-column widths
* Fixed headers, footers, left columns, right columns
* Column + row resizing
* Custom cell rendering

### Setup

```sh
npm install react-virtual-grid
```

### Usage

```jsx
const columnCount = 4000;
const rowCount = 4000;

class Example extends React.Component {
  render() {
    return (
      <Grid columnCount={columnCount}
            rowCount={rowCount}
            estimatedColumnWidth={128}
            estimatedRowHeight={32}
            fixedLeftColumnCount={fixedLeftColumnCount}
            fixedRightColumnCount={fixedRightColumnCount}
            fixedHeaderCount={fixedHeaderCount}
            fixedFooterCount={fixedFooterCount}
            renderCell={this.renderCell}
            columnWidth={this.calculateColumnWidth}
            rowHeight={this.calculateRowHeight} />
    );
  }

  calculateColumnWidth = (column) => {
    // calculate the width, or null if you're not sure yet because data hasn't loaded
    return 128;
  }

  calculateRowHeight = (row) => {
    // calculate the height, or null if you're not sure yet because data hasn't loaded
    return 32;
  }

  renderCell = (row, rowData, column, columnData) => {
    const [ colIndex, colLeft, width ] = columnData;
    const [ rowIndex, rowTop, height ] = rowData;

    const cellNumber = (rowIndex * this.state.columnCount) + colIndex;

    const left = column < 1 ? 0 : colLeft;
    const top = row < 1 ? 0 : rowTop;

    const attrs = { left, top, width, height };

    const title = rowIndex + '-' + colIndex;

    return (
      <div key={rowIndex + '-' + colIndex}
           style={attrs}>{title}</div>
    );
  }
}
```

### Hacking

```sh
# gem install foreman
foreman start

# open http://localhost:4001/test
# code changes will be recompiled automatically
```

### Building

Build the production version of the library:

```sh
make dist
```

### Tests

```sh
foreman start

# in another terminal
npm test
```
