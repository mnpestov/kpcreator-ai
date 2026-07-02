import React, { useMemo } from 'react';
import './Confetti.css';

const Confetti = ({ pieceCount = 70 }) => {
  // Мемоизируем параметры частиц, чтобы при ререндерах конфетти не "дергалось"
  const pieces = useMemo(() => {
    return Array.from({ length: pieceCount }).map((_, i) => {
      // Рандомизируем свойства
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 5;
      const animationDuration = Math.random() * 3 + 3; // от 3 до 6 секунд
      
      // Выбираем яркий цвет
      const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Делаем кусочки разных размеров
      const width = Math.random() * 8 + 5; // 5-13px
      const height = Math.random() * 12 + 10; // 10-22px

      return (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${left}%`,
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`,
            backgroundColor: color,
            width: `${width}px`,
            height: `${height}px`,
          }}
        />
      );
    });
  }, [pieceCount]);

  return <div className="confetti-container" aria-hidden="true">{pieces}</div>;
};

export default Confetti;
