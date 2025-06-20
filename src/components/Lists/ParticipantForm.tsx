import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Participant {
  uid: string;
  email: string;
  role: 'admin' | 'viewer';
}

interface ParticipantFormProps {
  listId: string;
  role: 'admin' | 'viewer'; // роль поточного користувача
}

export const ParticipantForm: React.FC<ParticipantFormProps> = ({ listId, role }) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'viewer'>('viewer');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [error, setError] = useState('');

  const fetchParticipants = async () => {
    const participantsRef = collection(db, 'todoLists', listId, 'participants');
    const snap = await getDocs(participantsRef);
    const fetched: Participant[] = snap.docs.map(doc => doc.data() as Participant);
    setParticipants(fetched);
  };

  const handleAdd = async () => {
    setError('');
    if (!email.trim()) {
      setError('Введіть email');
      return;
    }

    try {
      // Знайти користувача за email у "users"
      const userQuery = query(collection(db, 'users'), where('email', '==', email));
      const result = await getDocs(userQuery);

      if (result.empty) {
        setError('Користувача з такою поштою не знайдено.');
        return;
      }

      const userDoc = result.docs[0];
      const userData = userDoc.data();
      const uid = userData.uid;

      const participantRef = doc(db, 'todoLists', listId, 'participants', uid);
      const existing = await getDoc(participantRef);
      if (existing.exists()) {
        setError('Користувач уже є учасником списку.');
        return;
      }

      // Додати до підколекції
      const newParticipant: Participant = {
        uid,
        email,
        role: selectedRole
      };

      await setDoc(participantRef, newParticipant);
      setEmail('');
      setSelectedRole('viewer');
      fetchParticipants();
    } catch (err) {
      console.error(err);
      setError('Помилка при додаванні користувача');
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [listId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Учасники</h3>

      {role === 'admin' && (
        <div className="mb-4 space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">
            Роль
          </label>
          <select
            id="role-select"
            className="border p-2 w-full"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'viewer')}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>

          <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
            Додати
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}

      <ul className="divide-y">
        {participants.map((p) => (
          <li key={p.uid} className="flex justify-between py-1 text-sm">
            <span>{p.email}</span>
            <span className="text-gray-500">{p.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
