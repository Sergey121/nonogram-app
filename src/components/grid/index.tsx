import React, { useCallback, useEffect, useState } from 'react';
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

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const CELL_SIZE = 25;

export const Grid = () => {
  const dispatch = useDispatch();
  const { columns, rows, running, speed, clear } = useSelector((state: RootState) => state.app);
  const [field, setField] = useState<FieldType>([]);
  const [isHorizontal, setHorizontal] = useState(true);
  const [scannerPosition, setScannerPosition] = useState(0);
  const [maxColumnHeight, setMaxColumnHeight] = useState<Array<number>>([]);
  const [maxRowsHeight, setMaxRowsHeight] = useState<Array<number>>([]);

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
        }
      }
    };

    solve();
  }, [columns, rows, running]);

  const scannerStyle = {
    ...(isHorizontal ? {
      height: CELL_SIZE,
      width: columns.length * CELL_SIZE,
      top: scannerPosition * CELL_SIZE,
    } : {
      width: CELL_SIZE,
      height: rows.length * CELL_SIZE,
      left: scannerPosition * CELL_SIZE,
    }),
  };

  const TableHeader = useCallback(() => {
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

  return (
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
            </tbody>
          </table>
        </td>
      </tr>
      </tbody>
    </table>
  );
};
