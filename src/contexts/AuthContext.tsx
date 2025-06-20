import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface CustomUser {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'viewer'; 
}

interface AuthContextType {
  currentUser: CustomUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: 'admin' | 'viewer') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'viewer' = 'viewer' // за замовчуванням viewer
  ) => {
    try {
      console.log('Attempting registration for:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        uid: userCredential.user.uid,
        role,
        createdAt: new Date().toISOString()
      });

      console.log('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        const userData: CustomUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          name: data.name,
          role: data.role || 'viewer' 
        };
        setCurrentUser(userData);
      } else {
        const fallbackUserData: CustomUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          name: userCredential.user.email!.split('@')[0],
          role: 'viewer'
        };
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          ...fallbackUserData,
          createdAt: new Date().toISOString()
        });
        setCurrentUser(fallbackUserData);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists()) {
            const data = userDoc.data();
            const userData: CustomUser = {
              uid: user.uid,
              email: user.email!,
              name: data.name,
              role: data.role || 'viewer'
            };
            setCurrentUser(userData);
          } else {
            const fallbackUserData: CustomUser = {
              uid: user.uid,
              email: user.email!,
              name: user.email!.split('@')[0],
              role: 'viewer'
            };
            await setDoc(doc(db, 'users', user.uid), {
              ...fallbackUserData,
              createdAt: new Date().toISOString()
            });
            setCurrentUser(fallbackUserData);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth state error:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
