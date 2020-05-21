import React from 'react';
import styles from './button.module.scss';

type Props = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export const Button = (props: Props) => {
  const { title, onClick, disabled = false, className = '' } = props;

  const classes = [styles.btn, className];

  if (disabled) {
    classes.push(styles.disabled);
  }

  return (
    <button disabled={disabled} className={classes.join(' ')} onClick={onClick} type="button">{title}</button>
  );
};
