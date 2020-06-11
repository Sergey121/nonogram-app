import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './grid.module.scss';
import { RootState } from '../../store';
import { FieldType } from '../../models';
import {
  applyColumnResult,
  createField,
  createRowFromColumn, every,
  isArraysEqual,
  sum,
  tryResolveRow
} from '../../utils';
import { AppActions } from '../../store/app/actions';
import { Button } from '../button';

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const CELL_SIZE = 25;

function parseArray(text: string) {
  return text
    .replace(/[^\d\n]+/g, ' ')
    .trim()
    .split('\n')
    .map(row => (row.match(/\d+/g) || [])
      .map(parseFloat)
      .filter(Math.sign));
}

function parseText(text: string) {
  return text.replace(/(\]|\})[^\d\]\}]+/g, '\n').replace(/[^\d\n]+/g, '  ').replace(/[ \t]*\n[ \t]*/g, '\n').trim();
}

export const Grid = () => {
  const dispatch = useDispatch();
  const { columns, rows, running, speed, clear, selectedOption } = useSelector((state: RootState) => state.app);
  const [field, setField] = useState<FieldType>([]);
  const [isHorizontal, setHorizontal] = useState(true);
  const [scannerPosition, setScannerPosition] = useState(0);
  const [maxColumnHeight, setMaxColumnHeight] = useState<Array<number>>([]);
  const [maxRowsHeight, setMaxRowsHeight] = useState<Array<number>>([]);
  const [rowsInput, setRowsInput] = useState('');
  const [columnsInput, setColumnsInput] = useState('');

  useEffect(() => {
    if (!columns || !rows) {
      return;
    }

    const f = createField(rows, columns);

    setField(f);

    const maxCol = columns.slice().sort((a, b) => b.length - a.length)[0].length;
    setMaxColumnHeight(new Array(maxCol).fill(0));

    const maxRow = rows.slice().sort((a, b) => b.length - a.length)[0].length;
    setMaxRowsHeight(new Array(maxRow).fill(0));

    if (clear) {
      dispatch(AppActions.clearField(!clear));
    }
  }, [columns, rows, clear]);

  useEffect(() => {
    if (!rows || !columns) {
      return;
    }

    const solve = async () => {
      if (running) {

        try {
          let hasChanges;

          do {
            hasChanges = false;

            // Go through rows
            setHorizontal(true);
            for (let rowNumber = 0; rowNumber < rows.length; rowNumber++) {
              const row = field[rowNumber];

              if (!row.includes(0)) {
                continue;
              }

              setScannerPosition(rowNumber);

              const rowDefinition = rows[rowNumber];

              if (every(row, 0) && sum(rowDefinition) < row.length / 2) {
                continue;
              }

              const result = tryResolveRow(row, rowDefinition);
              if (!isArraysEqual(row, result)) {
                hasChanges = true;
              }
              field.splice(rowNumber, 1, result);

              await timeout(speed.value);
              setField(field.slice());
            }

            // Go through columns
            setHorizontal(false);
            for (let colNumber = 0; colNumber < columns.length; colNumber++) {
              const row = createRowFromColumn(field, colNumber);

              if (!row.includes(0)) {
                continue;
              }

              setScannerPosition(colNumber);

              const colDefinition = columns[colNumber];

              if (every(row, 0) && sum(colDefinition) < row.length / 2) {
                continue;
              }

              const result = tryResolveRow(row, colDefinition);
              if (!isArraysEqual(row, result)) {
                hasChanges = true;
              }
              applyColumnResult(field, colNumber, result);
              await timeout(speed.value);
              setField(field.slice());
            }
          } while (hasChanges);


          dispatch(AppActions.setRunning(false));
        } catch (e) {
          alert('Not correct data provided. Please, check your inputs carefully!');
          dispatch(AppActions.setRunning(false));
        }
      }
    };

    solve();
  }, [columns, rows, running]);

  const scannerStyle = columns && rows ? ({
    ...(isHorizontal ? {
      height: CELL_SIZE,
      width: columns.length * CELL_SIZE,
      top: scannerPosition * CELL_SIZE,
    } : {
      width: CELL_SIZE,
      height: rows.length * CELL_SIZE,
      left: scannerPosition * CELL_SIZE,
    }),
  }) : {};

  const TableHeader = useCallback(() => {
    if (!columns) {
      return null;
    }

    if (!columns.length || !maxColumnHeight.length) {
      return null;
    }

    const reversed = columns.slice().map(col => {
      const newArr = col.slice().reverse().concat(new Array(Math.abs(maxColumnHeight.length - col.length)).fill(undefined));
      return newArr.reverse();
    });

    return (
      <table className={styles.numberTable}>
        <tbody>
        {maxColumnHeight.map((headerRow, headerIndex) => {
          return (
            <tr key={headerIndex}>
              {reversed.map((column, colIndex) => {
                return (
                  <td key={colIndex} className={styles.numberCell}>
                    {column[headerIndex] !== undefined ? column[headerIndex] : ''}
                  </td>
                )
              })}
            </tr>
          );
        })}
        </tbody>
      </table>
    )
  }, [maxColumnHeight, columns]);

  const RowHeader = useCallback(() => {
    if (!rows) {
      return null;
    }

    if (!rows.length || !maxRowsHeight.length) {
      return null;
    }

    const reversed = rows.slice().map(row => {
      const newArr = row.slice().reverse().concat(new Array(Math.abs(maxRowsHeight.length - row.length)).fill(undefined));
      return newArr.reverse();
    });

    return (
      <table className={styles.numberTable}>
        <tbody>
        {reversed.map((row, rowIndex) => {
          return (
            <tr key={rowIndex}>
              {maxRowsHeight.map((rowHeight, rowHeightIndex) => {
                return (
                  <td key={rowHeightIndex} className={styles.numberCell}>
                    {row[rowHeightIndex] !== undefined ? row[rowHeightIndex] : ''}
                  </td>
                )
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    )
  }, [maxRowsHeight, rows]);

  const updateInput = useCallback((setter) => {
    return (e: ChangeEvent<HTMLTextAreaElement>) => {
      setter(e.target.value);
    }
  }, []);

  const handleParse = useCallback(() => {
    const r = parseText(rowsInput);
    const c = parseText(columnsInput);

    const rows = parseArray(r);
    const columns = parseArray(c);

    setRowsInput(parseText(rowsInput));
    setColumnsInput(parseText(columnsInput));

    if (r.length && c.length) {
      dispatch(AppActions.setCustomFields(rows, columns));
    }
  }, [rowsInput, columnsInput]);

  return (
    <>
      {selectedOption.value === -1 && (
        <>
          <div className={styles.description}>Put your rows in the left and columns in the right textarea. One row (column) a line, numbers separated by any non-numerical characters.</div>
          <div className={styles.inputs}>
          <textarea value={rowsInput} onChange={updateInput(setRowsInput)} placeholder={'Rows...'}
                    className={styles.input}/>
            <textarea value={columnsInput} onChange={updateInput(setColumnsInput)} placeholder={'Columns...'}
                      className={styles.input}/>
            <div className={styles.actions}>
              <Button title={'Parse'} onClick={handleParse}/>
            </div>
          </div>
        </>
      )}
      {rows && columns &&
      <table>
        <tbody>
        <tr>
          <td></td>
          <td>
            <TableHeader/>
          </td>
        </tr>
        <tr>
          <td>
            <RowHeader/>
          </td>
          <td>
            <table className={styles.table}>
              <tbody>
              {field.map((row, rowIndex) => {
                return (
                  <tr key={rowIndex} className={styles.row}>
                    {row.map((col, colIndex) => {
                      const classes = [styles.cell];

                      if (col === -1) {
                        classes.push(styles.empty);
                      }

                      if (col === 1) {
                        classes.push(styles.filled);
                      }
                      return (
                        <td key={colIndex} className={classes.join(' ')}>
                          {col === -1 && <div className={styles.dotWrapper}>
                            <div className={styles.dot}/>
                          </div>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {running &&
              <tr className={styles.scanner} style={scannerStyle}/>
              }
              {columns.filter((_, index) => (index + 1) % 5 === 0).map((r, i) => {
                const index = i + 1;
                return <tr key={index} className={styles.colDivider} style={{transform: `translateX(${CELL_SIZE * index * 5}px)`}}>
                  <span className={styles.dividerNumber}>{index * 5}</span>
                </tr>
              })}
              {rows.filter((_, index) => (index + 1) % 5 === 0).map((r, i) => {
                const index = i + 1;
                return <tr key={index} className={styles.rowDivider} style={{transform: `translateY(${CELL_SIZE * index * 5}px)`}}>
                  <span className={styles.dividerNumber}>{index * 5}</span>
                </tr>
              })}
              </tbody>
            </table>
          </td>
        </tr>
        </tbody>
      </table>
      }
    </>
  );
};