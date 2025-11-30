import React from 'react';
import { Player } from '../types';

interface DialogueBubbleProps {
  text: string;
  player: Player;
}

const DialogueBubble: React.FC<DialogueBubbleProps> = ({ text, player }) => {
  const bubbleWidth = text.length * 8 + 16; // Estimate width based on text length
  const bubbleHeight = 32;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${player.pos.x + player.size.x / 2}px`,
    top: `${player.pos.y - bubbleHeight - 4}px`,
    transform: 'translateX(-50%)',
    width: `${bubbleWidth}px`,
    height: `${bubbleHeight}px`,
    backgroundColor: '#9bbc0f',
    border: '2px solid #0f380f',
    color: '#0f380f',
    padding: '4px',
    textAlign: 'center',
    fontSize: '10px',
    lineHeight: '1.2',
    zIndex: 30,
    whiteSpace: 'nowrap',
  };

  const tailStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid #0f380f',
  }

  return (
    <div style={style}>
      {text}
      <div style={tailStyle}></div>
    </div>
  );
};

export default DialogueBubble;
