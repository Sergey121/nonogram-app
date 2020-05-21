import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './grid.module.scss';
import { RootState } from '../../store';
import { FieldType } from '../../models';
import {
  applyColumnResult,
  createField,
  createRowFromColumn,
  isArraysEqual,
  resolveNonogram,
  tryResolveRow
} from '../../utils';
import { AppActions } from '../../store/app/actions';

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const Grid = () => {
  const dispatch = useDispatch();
  const { columns, rows, running } = useSelector((state: RootState) => state.app);
  const [field, setField] = useState<FieldType>([]);

  useEffect(() => {
    if (!columns || !rows) {
      return;
    }

    const f = createField(rows, columns);

    setField(f);
  }, [columns, rows]);

  useEffect(() => {
   const solve = async () => {
     if (running) {
       try {
         // const resolved = resolveNonogram(rows, columns);
         // setField(resolved);

         let hasChanges;

         do {
           hasChanges = false;

           // Go through rows
           for (let rowNumber = 0; rowNumber < rows.length; rowNumber++) {
             const row = field[rowNumber];
             const rowDefinition = rows[rowNumber];
             const result = tryResolveRow(row, rowDefinition);
             if (!isArraysEqual(row, result)) {
               hasChanges = true;
             }
             field.splice(rowNumber, 1, result);

             await timeout(30);
             setField(field.slice());
           }

           // Go through columns
           for (let colNumber = 0; colNumber < columns.length; colNumber++) {
             const row = createRowFromColumn(field, colNumber);
             const colDefinition = columns[colNumber];
             const result = tryResolveRow(row, colDefinition);
             if (!isArraysEqual(row, result)) {
               hasChanges = true;
             }
             applyColumnResult(field, colNumber, result);
             await timeout(30);
             setField(field.slice());
           }
         } while (hasChanges);


         dispatch(AppActions.setRunning(false));
       } catch (e) {
         console.log('Error', e);
       }
     }
   };

   solve();
  }, [columns, rows, running]);

  return (
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
                  {col === -1 && <div className={styles.dotWrapper}><div className={styles.dot}/></div>}
                </td>
              );
            })}
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};
