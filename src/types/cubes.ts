export type DefaultCubeType = '2x2' | '3x3' | '4x4' | '5x5' | '6x6' | '7x7' | 'Pyraminx' | 'Megaminx' | 'Skewb' | 'Square-1';

export type CubeType = DefaultCubeType | string;

export type Penalty = null | '+2' | 'DNF';

export interface Solve {
  id: string;
  cubeType: CubeType;
  time: number;
  penalty: Penalty;
  scramble: string;
  timestamp: string;
  session: string;
}

export interface CubeStats {
  count: number;
  best: number | null;
  worst: number | null;
  average: number | null;
  ao5: number | null;
  ao12: number | null;
  ao50: number | null;
  ao100: number | null;
  bestAo5: number | null;
  bestAo12: number | null;
}

export interface Session {
  id: string;
  name: string;
  createdAt: string;
}

export interface CustomCubeType {
  id: string;
  type: string;
  label: string;
  icon: string;
  scrambleLength: number;
  moves: string[]; 
}

export interface CubeTypeInfo {
  type: CubeType;
  label: string;
  icon: string;
  isCustom?: boolean;
}


export const DEFAULT_CUBE_TYPES: CubeTypeInfo[] = [
    {type: '2x2', label: '2x2',  icon: '🟩'},
    {type: '3x3', label: '3x3',  icon: '🟥'}
    {type: '4x4', label: '4x4',  icon: '🟦'},
    {type: '5x5', label: '5x5',  icon: '🟨'},
    {type: '6x6', label: '6x6',  icon: '🟪'},
    {type: '7x7', label: '7x7',  icon: '🟧'},
    {type: 'Pyraminx', label: 'Pyraminx',  icon: '🔺'},
    {type: 'Megaminx', label: 'Megaminx',  icon: '⬟'},
    {type: 'Skewb', label: 'Skewb',  icon: '🔷'},
    {type: 'Square-1', label: 'Square-1',  icon: '◼️'},
];

export const CUBE_TYPES = DEFAULT_CUBE_TYPES;

export const DEFAULT_SESSION = 'Default';

export const PRESENT_MOVES = {
  standard: ['R', 'L', 'U', 'D', 'F', 'B'],
  wide: ['Rw', 'Lw', 'Uw', 'Dw', 'Fw', 'Bw'],
  slice: ['M', 'E', 'S'],
}

