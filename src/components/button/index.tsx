import React from 'react';
import styles from './button.module.scss';

type Props = {
  title: string;
  onClick: () => void;
  className?: string;
};

export const Button = (props: Props) => {
  const { title, onClick, className = '' } = props;
  return (
    <button className={[styles.btn, className].join(' ')} onClick={onClick} type="button">{title}</button>
  );
};
