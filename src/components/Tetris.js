import React, { useState } from "react";

import { createStage, checkCollision } from "../gameHelpers";

// Styled Components
import { StyledTetrisWrapper, StyledTetris } from "./styles/StyledTetris";

//music to play
import music from "../Lavender Haze-[onlinevideoconverter.com].mp3";
import tetris_music from "../Tetris_99_-_Main_Theme_1_hour.mp3";

// Custom Hooks
import { useInterval } from "../hooks/useInterval";
import { usePlayer } from "../hooks/usePlayer";
import { useStage } from "../hooks/useStage";
import { useGameStatus } from "../hooks/useGameStatus";
import { useAudio } from "../hooks/useAudio";

// Components
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";
import SpecialButton from "./SpecialButton";

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [
    player,
    updatePlayerPos,
    resetPlayer,
    playerRotate,
    resetPlayerSpecial,
  ] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] =
    useGameStatus(rowsCleared);
  const [playing, setPlaying, toggle] = useAudio(tetris_music);
  const [playingSp, setPlayingSp, toggleSp] = useAudio(music);

  console.log("re-render");

  const movePlayer = (dir) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const startGame = () => {
    console.log("test");
    // Reset everything
    setPlayingSp(false);
    setPlaying(true);
    setStage(createStage(12, 20));
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
  };

  const drop = () => {
    // increase level when player has cleared 5 rows
    if (rows > (level + 1) * 5) {
      setLevel((prev) => prev + 1);
      // also increase speed
      setDropTime(1000 / (level + 1) + 200);
    }
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game Over
      if (player.pos.y < 1) {
        console.log("GAME OVER!!!");
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        console.log("inteval on");
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
    console.log("inteval off");
    setDropTime(null);
    drop();
  };

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      }
    }
  };

  useInterval(() => {
    drop();
    console.log("hi");
  }, dropTime);

  const specialLevel = () => {
    setPlayingSp(true);
    setPlaying(false);
    setStage(createStage(24, 40));
    setDropTime(1000);
    resetPlayerSpecial();
  };

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={(e) => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton callback={startGame} />
          {level >= 3 ? (
            <>
              <SpecialButton callback={specialLevel} />
            </>
          ) : (
            <></>
          )}
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
};

export default Tetris;
