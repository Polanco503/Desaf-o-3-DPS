// firebase.js
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

export const auth = getAuth();        // ya no es una función, es un objeto
export const firestore = getFirestore();
