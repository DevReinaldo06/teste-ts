import { useState, useEffect } from 'react';

// CORREÇÃO: Importações diretas do pacote 'firebase/firestore'
import {
  getFirestore,
  Firestore,
  onSnapshot,
  collection,
  query,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'; // <--- Alterado para importação padrão do NPM

import { Card, User, PLACEHOLDER_IMG_URL, REVELADA_IMG_URL } from '../types/gameTypes';

/**
 * Hook para monitorar coleções de Cards e Usuários em tempo real.
 */
export const useCollections = (db: Firestore | null, cardCollectionPath: string, userCollectionPath: string) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const getCardDataFromSnapshot = (doc: QueryDocumentSnapshot<DocumentData>): Card => ({
    id: doc.id,
    name: doc.data().name || 'Desconhecido',
    imagem: doc.data().imagem || PLACEHOLDER_IMG_URL,
    imagemRevelada: doc.data().imagemRevelada || REVELADA_IMG_URL,
    tipo: doc.data().tipo,
    nivel: doc.data().nivel,
    elemento: doc.data().elemento,
    classe: doc.data().classe || 'N/A',
  });

  const getUserDataFromSnapshot = (doc: QueryDocumentSnapshot<DocumentData>): User => ({
    id: doc.id,
    email: doc.data().email || 'email@invalido.com',
    password: doc.data().password,
    isAdmin: doc.data().isAdmin || false,
  });

  useEffect(() => {
    if (!db) return;

    // Listener para Cards
    const cardsQuery = query(collection(db, cardCollectionPath));
    const unsubscribeCards = onSnapshot(cardsQuery, (snapshot) => {
      const newCards = snapshot.docs.map(getCardDataFromSnapshot);
      setCards(newCards);
    }, (e) => console.error("Erro ao carregar cards:", e));

    // Listener para Usuários
    const usersQuery = query(collection(db, userCollectionPath));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const newUsers = snapshot.docs.map(getUserDataFromSnapshot);
      setUsers(newUsers);
    }, (e) => console.error("Erro ao carregar usuários:", e));

    return () => {
      unsubscribeCards();
      unsubscribeUsers();
    };
  }, [db, cardCollectionPath, userCollectionPath]);

  return { cards, users };
};