export type AppState = 
  | 'INTRO' 
  | 'CHARACTER_SELECT' 
  | 'MAZE_TRANSITION' 
  | 'QUIZ' 
  | 'EXPLANATION' 
  | 'GAME_OVER';

export interface DropZone {
  id: string;
  x: number; // Percentage
  y: number; // Percentage
  label: string;
}

export interface Question {
  id: string;
  type: 'MAP' | 'MULTIPLE_CHOICE';
  text: string;
  // For Map type
  mapZones?: DropZone[];
  correctZoneIds?: string[];
  // For MC type
  options?: string[];
  correctOptionIndex?: number;
  // Common
  explanation: string;
}

export interface Player {
  avatar: 'boy' | 'girl';
  name: string;
}

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
}
