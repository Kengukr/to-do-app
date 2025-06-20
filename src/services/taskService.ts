import {
  collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where, Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Task } from '../types';

const tasksRef = collection(db, 'tasks');

export const createTask = async (listId: string, title: string, description: string, createdBy: string) => {
  const docRef = await addDoc(tasksRef, {
    listId,
    title,
    description,
    completed: false,
    createdBy,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateTask = async (id: string, data: Partial<Task>) => {
  const ref = doc(db, 'tasks', id);
  await updateDoc(ref, data);
};

export const deleteTask = async (id: string) => {
  await deleteDoc(doc(db, 'tasks', id));
};

export const getTasksByList = async (listId: string): Promise<Task[]> => {
  const q = query(tasksRef, where('listId', '==', listId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};