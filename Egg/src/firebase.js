import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDqD3N5lgz3fkAOBA8f0BiFzAO40_9Zq3g",
  authDomain: "egg-tracker-fadb1.firebaseapp.com",
  databaseURL: "https://egg-tracker-fadb1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "egg-tracker-fadb1",
  storageBucket: "egg-tracker-fadb1.firebasestorage.app",
  messagingSenderId: "525179709605",
  appId: "1:525179709605:web:8968293d174d6cfe40054c",
  measurementId: "G-ZZMX4QWGRH"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)