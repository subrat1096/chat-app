import Link from "next/link";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import { auth, db } from "@/firebase-config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ToastMsg from "@/components/ToastMsg";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import { profileColors } from "@/utils/profileColor";
import Loader from "@/components/Loader";

const register = () => {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  useEffect(() => {
    if (!isLoading && currentUser) {
      //it means user logged in
      router.push("/");
    }
  }, [currentUser, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password =
      e.target[2].value === e.target[3].value ? e.target[2].value : "";
    const colorIndex = Math.floor(Math.random() * profileColors.length);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        color: profileColors[colorIndex],
      });

      await setDoc(doc(db, "userChats", user.uid), {});

      await updateProfile(user, { displayName });
      console.log(user);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        color: profileColors[colorIndex],
      });

      await setDoc(doc(db, "userChats", user.uid), {});

      await updateProfile(user, { displayName });
      console.log(user);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <div className="flex h-[100vh] justify-center items-center bg-c1">
      <div className="flex items-center flex-col">
        {/* Heading  */}
        <div className="text-center">
          <div className="text-4xl font-bold">Create A New Account</div>
        </div>
        {/* Sub-Heading */}
        <div className="mt-3 text-c3">
          Connect and chat with anyone, anywhere.
        </div>

        {/* Login with google and facebook */}
        <div className="flex items-center gap-2 w-full mt-10 mb-5">
          {/* Google */}
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
            onClick={signInWithGoogle}
          >
            <div className="flex items-center justify-center gap-3 bg-c1 font-semibold w-full h-full rounded-md">
              <IoLogoGoogle size={24} />
              <span>Login With Google</span>
            </div>
          </div>
          {/* Facebook */}
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]"
            onClick={signInWithFacebook}
          >
            <div className="flex items-center justify-center gap-3 bg-c1 font-semibold w-full h-full rounded-md">
              <IoLogoFacebook size={24} />
              <span>Login With Facebook</span>
            </div>
          </div>
        </div>

        {/* "OR" section */}
        <div className="flex items-center gap-1">
          <span className="w-5 h-[1px] bg-c3"></span>
          <span className="text-c3 font-semibold">OR</span>
          <span className="w-5 h-[1px] bg-c3"></span>
        </div>

        {/* Register Form */}
        <form
          className="flex flex-col items-center gap-3 w-[500px] mt-5"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Display Name"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Confirm-Password"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
          />
          <button className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Sign Up
          </button>
        </form>

        {/* "Already have an account?" */}
        <div className="flex justify-center gap-1 text-c3 mt-5">
          <span>Already have an account?</span>
          <Link
            href="/login"
            className="font-semibold text-white underline underline-offset-2"
          >
            Login Here.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default register;
