import { useState, useEffect, useMemo } from 'react';

// CORREÇÃO: Importações NPM padrão para que o TypeScript encontre as declarações de tipo.
import {
  initializeApp,
  FirebaseApp
} from 'firebase/app';
import {
  getAuth,
  Auth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setLogLevel,
} from 'firebase/firestore';

import { User } from '../types/gameTypes';

// Variáveis globais injetadas pelo ambiente Canvas
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {};


/**
 * Hook para inicializar o Firebase e gerenciar o estado de autenticação.
 */
export const useFirebase = () => {
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Caminhos das coleções públicas
  const cardCollectionPath = useMemo(() => `/artifacts/${appId}/public/data/cards`, []);
  const userCollectionPath = useMemo(() => `/artifacts/${appId}/public/data/users`, []);

  useEffect(() => {
    let app: FirebaseApp;
    let firestore: Firestore;
    let authentication: Auth;

    try {
      // 1. Inicializa App e Serviços
      app = initializeApp(firebaseConfig);
      firestore = getFirestore(app);
      authentication = getAuth(app);
      
      // Ativa o log de debug do Firestore
      setLogLevel('debug'); 
      
      setDb(firestore);
      setAuth(authentication);

      // 2. Listener de Autenticação (Monitora mudanças de estado)
      const unsubscribe = onAuthStateChanged(authentication, async (user) => {
        if (user) {
          // Tenta buscar o perfil do usuário no Firestore
          const userDocRef = doc(firestore, userCollectionPath, user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setCurrentUser({
              id: user.uid,
              email: userData.email,
              password: userData.password,
              isAdmin: userData.isAdmin || false,
            });
          } else {
            // Usuário autenticado (e.g., anonimamente) mas sem perfil no Firestore
            setCurrentUser(null); 
          }
        } else {
          setCurrentUser(null);
        }
        setIsAuthReady(true);
        setIsLoading(false);
      });

      // 3. Tentativa de Login Inicial
      const initialAuth = async () => {
        if (typeof __initial_auth_token !== 'undefined' && authentication) {
          try {
            // Tenta login com token customizado (preferencial)
            await signInWithCustomToken(authentication, __initial_auth_token);
          } catch (e) {
            console.error("Erro ao fazer login com token customizado, caindo para anônimo:", e);
            await signInAnonymously(authentication);
          }
        } else if (authentication) {
          // Login anônimo se não houver token customizado
          await signInAnonymously(authentication);
        }
      };

      initialAuth();

      return () => unsubscribe(); // Cleanup do listener
    } catch (e) {
      console.error("Erro na inicialização do Firebase:", e);
      setError("Falha ao inicializar o Firebase. Verifique a configuração.");
      setIsLoading(false);
    }
  }, [userCollectionPath]);

  return { 
    db, 
    auth, 
    currentUser, 
    isLoading, 
    error, 
    setCurrentUser, 
    isAuthReady,
    cardCollectionPath, 
    userCollectionPath 
  };
};

export type FirebaseHookResult = ReturnType<typeof useFirebase>;