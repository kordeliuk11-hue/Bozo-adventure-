import { useState, useEffect, useCallback } from 'react';

export interface PlayerControls {
  left: boolean;
  right: boolean;
  jump: boolean;
  attack: boolean;
  switchWeapon: boolean;
}

export const usePlayerControls = () => {
  const [controls, setControls] = useState<PlayerControls>({
    left: false,
    right: false,
    jump: false,
    attack: false,
    switchWeapon: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        setControls((c) => ({ ...c, left: true, right: false }));
        break;
      case 'ArrowRight':
      case 'd':
        setControls((c) => ({ ...c, right: true, left: false }));
        break;
      case ' ':
      case 'ArrowUp':
      case 'w':
        setControls((c) => ({ ...c, jump: true }));
        break;
      case 'x':
      case 'Shift':
        setControls((c) => ({ ...c, attack: true }));
        break;
      case 'q':
        setControls((c) => ({ ...c, switchWeapon: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
        setControls((c) => ({ ...c, left: false }));
        break;
      case 'ArrowRight':
      case 'd':
        setControls((c) => ({ ...c, right: false }));
        break;
       case ' ':
       case 'ArrowUp':
       case 'w':
        setControls((c) => ({ ...c, jump: false }));
        break;
       case 'x':
       case 'Shift':
        setControls((c) => ({ ...c, attack: false }));
        break;
      case 'q':
        setControls((c) => ({...c, switchWeapon: false}));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { controls, setControls };
};