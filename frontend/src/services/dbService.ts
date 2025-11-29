import {
    Firestore,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore'; // <-- Importação Correta do pacote npm
  
  import { Card, User } from '../types/gameTypes';
  
  // --- CARD CRUD OPERATIONS ---
  
  export const addCard = async (db: Firestore, cardCollectionPath: string, card: Omit<Card, 'id'>) => {
    if (!db) throw new Error("Database not initialized.");
    await addDoc(collection(db, cardCollectionPath), card);
  };
  
  export const updateCard = async (db: Firestore, cardCollectionPath: string, card: Card) => {
    if (!db) throw new Error("Database not initialized.");
    const docRef = doc(db, cardCollectionPath, card.id);
    await setDoc(docRef, card);
  };
  
  export const deleteCard = async (db: Firestore, cardCollectionPath: string, id: string) => {
    if (!db) throw new Error("Database not initialized.");
    await deleteDoc(doc(db, cardCollectionPath, id));
  };
  
  // --- USER CRUD & AUTH SIMULATION OPERATIONS ---
  
  /**
   * Tenta encontrar um usuário no Firestore pelo email e senha (simulação de login).
   * @returns O User se encontrado, ou null.
   */
  export const findUserByCredentials = async (db: Firestore, userCollectionPath: string, email: string, password: string): Promise<User | null> => {
      if (!db) return null;
      const usersRef = collection(db, userCollectionPath);
      const q = query(usersRef, where("email", "==", email), where("password", "==", password));
      const snapshot = await getDocs(q);
  
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        return {
          id: snapshot.docs[0].id,
          email: userData.email,
          password: userData.password,
          isAdmin: userData.isAdmin || false,
        } as User;
      }
      return null;
  };
  
  /**
   * Cadastra um novo usuário.
   * @returns true se o cadastro foi bem-sucedido.
   */
  export const registerUser = async (db: Firestore, userCollectionPath: string, email: string, password: string): Promise<boolean> => {
    if (!db) throw new Error("Database not initialized.");
    const usersRef = collection(db, userCollectionPath);
    
    // Verifica se o e-mail já existe
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);
  
    if (!snapshot.empty) {
      return false; // E-mail já existe
    }
  
    // Adiciona o novo usuário
    await addDoc(usersRef, {
      email,
      password, 
      isAdmin: false,
    });
    return true;
  };
  
  
  /**
   * Atualiza o email e senha de um usuário existente.
   */
  export const updateUserProfile = async (db: Firestore, userCollectionPath: string, user: User) => {
      if (!db) throw new Error("Database not initialized.");
      const userRef = doc(db, userCollectionPath, user.id);
      await updateDoc(userRef, {
        email: user.email,
        password: user.password,
      });
  };
  
  /**
   * Deleta um usuário.
   */
  export const deleteUser = async (db: Firestore, userCollectionPath: string, id: string) => {
      if (!db) throw new Error("Database not initialized.");
      await deleteDoc(doc(db, userCollectionPath, id));
  };