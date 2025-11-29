import { useState, useEffect, useMemo } from 'react';

// CORREÇÃO: Importações NPM padrão para que o TypeScript encontre as declarações de tipo.
import {
  initializeApp,
  FirebaseApp,
  FirebaseOptions, // Adicionando tipo para FirebaseOptions
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

// Variáveis globais injetadas pelo ambiente Canvas (devem ser ignoradas no ambiente VS Code)
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;


// =========================================================================
// !!! AÇÃO NECESSÁRIA: PREENCHA ESTE OBJETO COM AS SUAS CREDENCIAIS DO PROJETO-TS !!!
// =========================================================================
const FIREBASE_CONFIG_LOCAL: FirebaseOptions = {
  apiKey: "SUA_API_KEY_AQUI", // Exemplo: "AIzaSy...seu_chave_aqui"
  authDomain: "SEU_AUTH_DOMAIN_AQUI", // Exemplo: "projeto-ts-XXXXX.firebaseapp.com"
  projectId: "SEU_PROJECT_ID_AQUI", // Exemplo: "projeto-ts-XXXXX"
  storageBucket: "SEU_STORAGE_BUCKET_AQUI", // Exemplo: "projeto-ts-XXXXX.appspot.com"
  messagingSenderId: "SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "SEU_APP_ID_AQUI",
  // Opcional: measurementId: "G-ABCDEFG",
};
// =========================================================================


// Lógica para determinar a configuração correta
const isLocalEnvironment = typeof __firebase_config === 'undefined';

const firebaseConfig = isLocalEnvironment
  ? FIREBASE_CONFIG_LOCAL as FirebaseOptions // Usa a configuração local no VS Code
  : JSON.parse(__firebase_config) as FirebaseOptions; // Usa a configuração injetada no ambiente Canvas

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


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
  const cardCollectionPath = useMemo(() => `/artifacts/${appId}/public/data/cards`, [appId]);
  const userCollectionPath = useMemo(() => `/artifacts/${appId}/public/data/users`, [appId]);

  useEffect(() => {
    let app: FirebaseApp;
    let firestore: Firestore;
    let authentication: Auth;

    // Adicionado uma verificação básica se a configuração está faltando (somente para ambiente local)
    if (isLocalEnvironment && !firebaseConfig.projectId) {
        console.error("ERRO CRÍTICO: firebaseConfig.projectId está faltando ou vazio. Preencha o objeto FIREBASE_CONFIG_LOCAL.");
        setError("Erro: Credenciais do Firebase incompletas. Verifique FIREBASE_CONFIG_LOCAL.");
        setIsLoading(false);
        return;
    }

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
            // Apenas atualiza o estado para ID e email se houver.
            setCurrentUser({ 
                id: user.uid, 
                email: user.email || 'anonymous', 
                password: '', 
                isAdmin: false 
            }); 
          }
        } else {
          setCurrentUser(null);
        }
        setIsAuthReady(true);
        setIsLoading(false);
      });

      // 3. Tentativa de Login Inicial
      const initialAuth = async () => {
        // Se estiver no ambiente Canvas E houver token
        if (!isLocalEnvironment && typeof __initial_auth_token !== 'undefined' && authentication) {
          try {
            // Tenta login com token customizado (preferencial no ambiente Canvas)
            await signInWithCustomToken(authentication, __initial_auth_token);
          } catch (e) {
            console.error("Erro ao fazer login com token customizado, caindo para anônimo:", e);
            await signInAnonymously(authentication);
          }
        } else if (authentication) {
          // Login anônimo (padrão para VS Code ou se não houver token customizado)
          await signInAnonymously(authentication);
        }
      };

      initialAuth();

      return () => unsubscribe(); // Cleanup do listener
    } catch (e) {
      console.error("Erro na inicialização do Firebase:", e);
      // O erro do projectId será capturado aqui se o usuário esquecer de preencher a config local
      setError(`Falha ao inicializar o Firebase. ${e instanceof Error ? e.message : String(e)}`);
      setIsLoading(false);
    }
  }, [userCollectionPath, appId]); // Adicionado appId como dependência para useMemo/useEffect

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