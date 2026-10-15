import { useSnakeGame, Direction, Difficulty } from './useSnakeGame';
import { useRef, useCallback } from 'react';

function App() {
  const {
    snake,
    food,
    gameState,
    score,
    highScore,
    difficulty,
    scoreAnimating,
    gridSize,
    startGame,
    togglePause,
    resetGame,
    changeDirection,
    setDifficulty,
  } = useSnakeGame();

  // Touch/swipe handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      changeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      changeDirection(dy > 0 ? 'DOWN' : 'UP');
    }
    touchStartRef.current = null;
  }, [changeDirection]);

  const handleDirectionButton = (dir: Direction) => {
    if (gameState === 'playing') {
      changeDirection(dir);
    }
  };

  const getCellType = (x: number, y: number) => {
    if (snake[0]?.x === x && snake[0]?.y === y) return 'head';
    if (snake.some((seg, i) => i > 0 && seg.x === x && seg.y === y)) return 'body';
    if (food.x === x && food.y === y) return 'food';
    return 'empty';
  };

  const getSnakeIndex = (x: number, y: number) => {
    return snake.findIndex(seg => seg.x === x && seg.y === y);
  };

  const difficultyLabels: Record<Difficulty, string> = {
    easy: '🐢 Fácil',
    medium: '🐇 Medio',
    hard: '🚀 Difícil',
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const type = getCellType(x, y);
        const snakeIdx = type !== 'empty' ? getSnakeIndex(x, y) : -1;
        const isHead = type === 'head';
        const isBody = type === 'body';
        const isFood = type === 'food';

        let cellClass = 'rounded-sm transition-all duration-75 ';
        if (isHead) {
          cellClass += 'bg-emerald-500 shadow-md shadow-emerald-500/50 rounded-md scale-110 z-10 ';
        } else if (isBody) {
          const opacity = Math.max(0.4, 1 - (snakeIdx / snake.length) * 0.6);
          cellClass += `rounded-sm `;
          return (
            <div
              key={`${x}-${y}`}
              className={cellClass}
              style={{
                backgroundColor: `rgba(16, 185, 129, ${opacity})`,
              }}
            />
          );
        } else if (isFood) {
          cellClass += 'animate-pulse-food bg-red-500 shadow-md shadow-red-500/50 rounded-full ';
        } else {
          cellClass += 'bg-slate-800/30 ';
        }

        cells.push(<div key={`${x}-${y}`} className={cellClass} />);
      }
    }
    return cells;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-lg mb-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400 mb-2">
          🐍 Snake Game
        </h1>

        {/* Score Board */}
        <div className="flex justify-between items-center bg-slate-800/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700/50">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Puntuación</p>
            <p className={`text-2xl font-bold text-emerald-400 ${scoreAnimating ? 'animate-score-pop' : ''}`}>
              {score}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Dificultad</p>
            <p className="text-lg font-semibold text-purple-400">{difficultyLabels[difficulty]}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Récord</p>
            <p className="text-2xl font-bold text-amber-400">🏆 {highScore}</p>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div
        className={`relative bg-slate-900/80 backdrop-blur-sm rounded-2xl border-2 border-slate-700/50 p-2 md:p-3 shadow-2xl shadow-purple-900/20 ${gameState === 'gameover' ? 'animate-game-over' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grid */}
        <div
          className="grid gap-[1px] bg-slate-800/20 rounded-xl overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
          }}
        >
          {renderGrid()}
        </div>

        {/* Overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-2xl animate-fade-in">
            <div className="text-6xl mb-4">🐍</div>
            <p className="text-xl text-white font-semibold mb-2">¿Listo para jugar?</p>
            <p className="text-sm text-slate-400 mb-4">Usa las flechas o WASD para mover</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all active:scale-95"
            >
              ▶ Jugar
            </button>
            <p className="text-xs text-slate-500 mt-3">o presiona Espacio</p>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-2xl animate-fade-in">
            <div className="text-5xl mb-4">⏸️</div>
            <p className="text-xl text-white font-semibold mb-4">Pausado</p>
            <button
              onClick={togglePause}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all active:scale-95"
            >
              ▶ Continuar
            </button>
            <p className="text-xs text-slate-500 mt-3">o presiona Espacio</p>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/85 backdrop-blur-sm rounded-2xl animate-fade-in">
            <div className="text-5xl mb-3">💀</div>
            <p className="text-2xl text-red-400 font-bold mb-1">¡Game Over!</p>
            <p className="text-lg text-white mb-1">Puntuación: <span className="text-emerald-400 font-bold">{score}</span></p>
            {score >= highScore && score > 0 && (
              <p className="text-sm text-amber-400 font-semibold mb-2">🎉 ¡Nuevo récord!</p>
            )}
            <button
              onClick={startGame}
              className="mt-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all active:scale-95"
            >
              🔄 Reintentar
            </button>
            <p className="text-xs text-slate-500 mt-3">o presiona Espacio</p>
          </div>
        )}
      </div>

      {/* Controls Section */}
      <div className="w-full max-w-lg mt-4 space-y-3">
        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          {gameState === 'idle' && (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all active:scale-95 text-sm"
            >
              ▶ Jugar
            </button>
          )}
          {gameState === 'playing' && (
            <button
              onClick={togglePause}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all active:scale-95 text-sm"
            >
              ⏸ Pausa
            </button>
          )}
          {gameState === 'paused' && (
            <button
              onClick={togglePause}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all active:scale-95 text-sm"
            >
              ▶ Continuar
            </button>
          )}
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all active:scale-95 text-sm"
          >
            🔄 Reiniciar
          </button>
        </div>

        {/* Difficulty Selector */}
        <div className="flex justify-center">
          <div className="flex gap-1 bg-slate-800/60 backdrop-blur-sm rounded-xl p-1 border border-slate-700/50">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  if (gameState === 'playing' || gameState === 'paused') {
                    resetGame();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  difficulty === d
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {difficultyLabels[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Touch D-Pad Controls (visible on mobile) */}
        <div className="flex justify-center md:hidden mt-2">
          <div className="grid grid-cols-3 gap-1 w-36">
            <div />
            <button
              className="touch-btn w-12 h-12 bg-slate-800/80 border border-slate-600/50 rounded-xl flex items-center justify-center text-2xl text-white"
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('UP'); }}
              onClick={() => handleDirectionButton('UP')}
            >
              ▲
            </button>
            <div />
            <button
              className="touch-btn w-12 h-12 bg-slate-800/80 border border-slate-600/50 rounded-xl flex items-center justify-center text-2xl text-white"
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('LEFT'); }}
              onClick={() => handleDirectionButton('LEFT')}
            >
              ◀
            </button>
            <div className="w-12 h-12 bg-slate-800/30 border border-slate-700/30 rounded-xl flex items-center justify-center text-xs text-slate-500">
              ●
            </div>
            <button
              className="touch-btn w-12 h-12 bg-slate-800/80 border border-slate-600/50 rounded-xl flex items-center justify-center text-2xl text-white"
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('RIGHT'); }}
              onClick={() => handleDirectionButton('RIGHT')}
            >
              ▶
            </button>
            <div />
            <button
              className="touch-btn w-12 h-12 bg-slate-800/80 border border-slate-600/50 rounded-xl flex items-center justify-center text-2xl text-white"
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('DOWN'); }}
              onClick={() => handleDirectionButton('DOWN')}
            >
              ▼
            </button>
            <div />
          </div>
        </div>

        {/* Keyboard hints (desktop) */}
        <div className="hidden md:flex justify-center gap-4 text-xs text-slate-500 mt-2">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-slate-300">↑↓←→</kbd>
            <span>Mover</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-slate-300">Espacio</kbd>
            <span>Pausa</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-slate-300">R</kbd>
            <span>Reiniciar</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
