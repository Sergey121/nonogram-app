import React, { useCallback } from 'react';
import styles from './header.module.scss';
import { Button } from '../button';

export const Header = () => {
  const handleClick = useCallback(() => {
    console.log('Click');
  }, []);
  return (
    <nav className={styles.navigation}>
      <div className={styles.name}>Nonogram solver Visualizer</div>
      <Button className={styles.btn} title={'Visualize!'} onClick={handleClick}/>
    </nav>
  )
};
