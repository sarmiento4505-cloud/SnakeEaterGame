import React from 'react';
import { useSnakeGame } from './useSnakeGame';

export default function App() {
  const {
    snake,
    food,
    gameState,
    score,
    highScore,
    difficulty,
    gridSize,
    startGame,
    togglePause,
    resetGame,
    changeDirection,
    setDifficulty
  } = useSnakeGame();

  const cellSize = 20;
  const boardSize = gridSize * cellSize;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h1>Snake Game</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', alignItems: 'center' }}>
        <div>Puntuación: <strong>{score}</strong></div>
        <div>Récord: <strong>{highScore}</strong></div>
        <div>
          Dificultad:{' '}
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value as any)}
            disabled={gameState === 'playing'}
            style={{ padding: '5px', background: '#333', color: '#fff', border: '1px solid #555' }}
          >
            <option value="easy">Fácil</option>
            <option value="medium">Media</option>
            <option value="hard">Difícil</option>
          </select>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: boardSize,
          height: boardSize,
          backgroundColor: '#1e1e1e',
          border: '3px solid #444',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: segment.x * cellSize,
              top: segment.y * cellSize,
              width: cellSize - 2,
              height: cellSize - 2,
              backgroundColor: index === 0 ? '#4CAF50' : '#8BC34A',
              borderRadius: index === 0 ? '4px' : '2px',
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            left: food.x * cellSize,
            top: food.y * cellSize,
            width: cellSize - 2,
            height: cellSize - 2,
            backgroundColor: '#FF5722',
            borderRadius: '50%',
          }}
        />

        {gameState !== 'playing' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            {gameState === 'idle' && <h2>Listo para jugar</h2>}
            {gameState === 'paused' && <h2>Juego Pausado</h2>}
            {gameState === 'gameover' && <h2 style={{ color: '#FF5722' }}>¡Juego Terminado!</h2>}

            <button
              onClick={startGame}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {gameState === 'idle' ? 'Iniciar Partida' : gameState === 'paused' ? 'Continuar' : 'Jugar de Nuevo'}
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        {gameState === 'playing' && (
          <button onClick={togglePause} style={{ padding: '8px 15px', background: '#FF9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Pausar
          </button>
        )}
        <button onClick={resetGame} style={{ padding: '8px 15px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Reiniciar
        </button>
      </div>

      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '5px' }}>
        <div></div>
        <button onClick={() => changeDirection('UP')} style={{ height: '50px', background: '#333', color: '#fff', border: '1px solid #555', fontSize: '18px' }}>⬆️</button>
        <div></div>
        <button onClick={() => changeDirection('LEFT')} style={{ height: '50px', background: '#333', color: '#fff', border: '1px solid #555', fontSize: '18px' }}>⬅️</button>
        <button onClick={() => changeDirection('DOWN')} style={{ height: '50px', background: '#333', color: '#fff', border: '1px solid #555', fontSize: '18px' }}>⬇️</button>
        <button onClick={() => changeDirection('RIGHT')} style={{ height: '50px', background: '#333', color: '#fff', border: '1px solid #555', fontSize: '18px' }}>➡️</button>
      </div>
    </div>
  );
}
