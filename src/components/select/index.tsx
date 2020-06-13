import React, { useCallback, useRef, useState } from 'react';
import styles from './select.module.scss';
import { Option } from '../../models/Option';
import { ReactComponent as Expand } from './expand_more.svg';
import { useOnClickOutside } from '../../hooks/useClickOutside';


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
  const ref = useRef<HTMLUListElement>(null);
  const { options, value, onChange, disabled, prefix = '', className = '', placeholder = 'Select...' } = props;
  const [opened, setOpened] = useState<boolean>(false);

  useOnClickOutside(ref, () => setOpened(false));

  const toggleOpen = useCallback(() => {
    setOpened(!opened);
  }, [opened]);

  const handleChange = useCallback((option: Option) => () => {
    onChange(option);
    toggleOpen();
  }, [toggleOpen, onChange]);

  return (
    <div className={[styles.wrapper, className, disabled ? styles.disabled : ''].join(' ')}>
      <div className={styles.select} onClick={toggleOpen}>
        <div className={styles.label}>{value ? prefix ? `${prefix} ${value.label}` : value.label : placeholder}</div>
        <div className={styles.arrow}>
          <Expand/>
        </div>
      </div>
      {opened &&
      <ul className={styles.list} ref={ref}>
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
