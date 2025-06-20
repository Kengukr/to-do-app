import { db } from '../config/firebase';
import {
  collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where, Timestamp
} from 'firebase/firestore';
import { TodoList } from '../types';

const listsRef = collection(db, 'lists');

export const createList = async (name: string, ownerId: string) => {
  const docRef = await addDoc(listsRef, {
    name,
    ownerId,
    createdAt: Timestamp.now(),
    participants: [],
  });
  return docRef.id;
};

export const updateList = async (id: string, name: string) => {
  const ref = doc(db, 'lists', id);
  await updateDoc(ref, { name });
};

export const deleteList = async (id: string) => {
  await deleteDoc(doc(db, 'lists', id));
};

export const getUserLists = async (userId: string) => {
  const q = query(listsRef, where('ownerId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TodoList));
};