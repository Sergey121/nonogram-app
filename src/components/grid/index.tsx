import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './grid.module.scss';
import { RootState } from '../../store';
import { FieldType } from '../../models';
import { createField, resolveNonogram } from '../../utils';

export const Grid = () => {
  const { columns, rows } = useSelector((state: RootState) => state.app);
  const [field, setField] = useState<FieldType>([]);

  useEffect(() => {
    if (!columns || !rows) {
      return;
    }

    const f = createField(rows, columns);

    const resolved = resolveNonogram(rows, columns);

    setField(resolved);
  }, [columns, rows]);

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
                <td key={colIndex} className={classes.join(' ')}/>
              );
            })}
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};
