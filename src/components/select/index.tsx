import React, { useCallback, useState } from 'react';
import styles from './select.module.scss';
import { Option } from '../../models/Option';
import { ReactComponent as Expand } from './expand_more.svg';


type Props = {
  options: Option[];
  value: Option;
  onChange: (value: Option) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  prefix?: string;
};

export const Select = (props: Props) => {
  const { options, value, onChange, disabled, prefix = '', className = '', placeholder = 'Select...' } = props;
  const [opened, setOpened] = useState<boolean>(false);

  const handleChange = useCallback((option: Option) => () => {
    onChange(option);
    toggleOpen();
  }, [onChange, opened]);
  const toggleOpen = useCallback(() => {
    setOpened(!opened);
  }, [opened]);

  return (
    <div className={[styles.wrapper, className, disabled ? styles.disabled : ''].join(' ')}>
      <div className={styles.select} onClick={toggleOpen}>
        <div className={styles.label}>{value ? prefix ? `${prefix} ${value.label}` : value.label : placeholder}</div>
        <div className={styles.arrow}>
          <Expand/>
        </div>
      </div>
      {opened &&
      <ul className={styles.list}>
        {options.map((o) => {
          return (
            <li className={styles.item} onClick={handleChange(o)} key={o.value}>{o.label}</li>
          )
        })}
      </ul>
      }
    </div>
  )
};
