import type { CubeType } from '../types/cubes';

const MODIFIERS = ["", "'", "2"];
const MOVES_2x2 = ['R', 'U', 'F'];
const MOVES_3X3 = ["U", "D", "L", "R", "F", "B"];
const MOVES_4x4 = [...MOVES_3X3, "Uw", "Dw", "Lw", "Rw", "Fw", "Bw"];
const MOVES_5x5 = [...MOVES_4x4, '3Rw', '3Lw', '3Uw', '3Dw', '3Fw', '3Bw'];
const MOVES_PYRAMINX = ['U', 'L', 'R', 'B'];
const MOVES_SKEWB = ['U', 'R', 'L', 'B'];
const MOVES_SQUARE1 = ['U', 'D', 'L', 'R', 'Uw', 'Dw'];



function getRandomMove(moves: string[], lastMove: string | null): string {
  let move: string;
  do {
    move = moves[Math.floor(Math.random() * moves.length)];
  } while (move[0] === lastMove?.[0]);
  
  const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
  return move + modifier;
}

function generateStandardScramble(moves: string[], length: number): string {
  const scramble: string[] = [];
  let lastMove: string | null = null;
  
  for (let i = 0; i < length; i++) {
    const move = getRandomMove(moves, lastMove);
    scramble.push(move);
    lastMove = move;
  }
  
  return scramble.join(' ');
}


function generateMegaminxScramble(): string {
  const scramble: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const line: string[] = [];
    for (let j = 0; j < 5; j++) {
      line.push(Math.random() > 0.5 ? 'R++' : 'R--');
      line.push(Math.random() > 0.5 ? 'D++' : 'D--');
    }
    line.push(Math.random() > 0.5 ? 'U' : "U'");
    scramble.push(line.join(' '));
  }
  
  return scramble.join('\n');
}

export function generateScramble(cubeType: CubeType): string {
  switch (cubeType) {
    case '2x2':
      return generateStandardScramble(MOVES_2x2, 9);
    case '3x3':
      return generateStandardScramble(MOVES_3X3, 20);
    case '4x4':
      return generateStandardScramble(MOVES_4x4, 44);
    case '5x5':
      return generateStandardScramble(MOVES_5x5, 60);
    case 'pyraminx':
      return generateStandardScramble(MOVES_PYRAMINX, 11);
    case 'square-1':
      return generateStandardScramble(MOVES_SQUARE1, 18);
    case 'megaminx':
      return generateMegaminxScramble();
    case 'skewb':
      return generateStandardScramble(MOVES_SKEWB, 9);
    default:
      return generateStandardScramble(MOVES_3X3, 20);
  }
}
