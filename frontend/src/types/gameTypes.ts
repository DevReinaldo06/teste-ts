// Definições de Tipos para o jogo e usuários

export type TipoType = 'máquina' | 'guerreiro' | 'mago' | 'piro' | 'trovão' | 'besta-divina' | 'zumbi' | 'besta-guerreira' | 'dinossauro' | 'serpente-marinha';
export type NivelType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ElementoType = 'vento' | 'luz' | 'trevas' | 'fogo' | 'terra' | 'divino' | 'água';

export interface User {
  id: string;
  email: string;
  password?: string;
  isAdmin: boolean;
}

export interface Card {
  id: string;
  name: string;
  imagem: string; // URL da imagem oculta
  imagemRevelada: string; // URL da imagem revelada
  tipo: TipoType;
  nivel: NivelType;
  elemento: ElementoType;
  classe: string; 
}

export interface Guess {
  tipo: TipoType | null;
  nivel: NivelType | null;
  elemento: ElementoType | null;
}

export interface GuessResult {
  tipoCorrect: boolean;
  nivelCorrect: boolean;
  elementoCorrect: boolean;
  isFullyCorrect: boolean;
}

export enum AppPage {
  Login = 'login',
  Register = 'register', // Mantido para permitir futuras telas de registro separadas
  AdminLogin = 'adminLogin', // Mantido para futuras telas de login admin separadas
  MainGame = 'mainGame',
  AdminDashboard = 'adminDashboard', // O nome usado na navegação para a tela admin
    // Adicione 'Admin = 'admin',' se realmente for usá-lo, mas use AdminDashboard para evitar duplicação.
}

export enum AdminView {
  NewCard = 'newCard',
  Cards = 'cards',
  Users = 'users',
}

// Constantes
export const TIPO_OPTIONS: TipoType[] = ['máquina', 'guerreiro', 'mago', 'piro', 'trovão', 'besta-divina', 'zumbi', 'besta-guerreira', 'dinossauro', 'serpente-marinha'];
export const NIVEL_OPTIONS: NivelType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const ELEMENTO_OPTIONS: ElementoType[] = ['vento', 'luz', 'trevas', 'fogo', 'terra', 'divino', 'água'];
export const ADMIN_EMAIL = "admin@admin.com";
export const ADMIN_PASSWORD = "adminpassword";
export const PLACEHOLDER_IMG_URL = "https://placehold.co/400x400/000000/FFFFFF?text=Card+Desconhecido";
export const REVELADA_IMG_URL = "https://placehold.co/400x400/22C55E/FFFFFF?text=Card+Revelado";