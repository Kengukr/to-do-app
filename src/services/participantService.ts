import { doc, updateDoc, arrayUnion, getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const addParticipantToList = async (
  listId: string,
  email: string,
  role: 'admin' | 'viewer'
) => {
    // Check if the user exists in the 'users' collection
  const usersSnap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
  const userDoc = usersSnap.docs[0];
  const userId = userDoc?.id;

  const listRef = doc(db, 'lists', listId);
  await updateDoc(listRef, {
    participants: arrayUnion({
      email,
      role,
      userId: userId ?? null,
    })
  });
  
};