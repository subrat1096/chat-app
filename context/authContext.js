import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/firebase-config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
// import { getAuth, signOut } from "firebase/auth";

const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const authStateChanged = async (user) => {
    // setIsLoading(true);
    if (!user) {
      clear();
      return;
    }
    const userDoc = await getDoc(doc(db, "users", user.uid));
    setCurrentUser(userDoc.data());
    setIsLoading(false);
  };

  const clear = () => {
    setCurrentUser(null);
    setIsLoading(false);
  };

  const logOut = () => {
    signOut(auth).then(() => clear());
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);
  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser, isLoading, setIsLoading, logOut }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useAuth = () => useContext(UserContext);
export default UserProvider;
