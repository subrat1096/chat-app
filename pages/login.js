import Link from "next/link";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import { auth, db } from "@/firebase-config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ToastMsg from "@/components/ToastMsg";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { doc, setDoc } from "firebase/firestore";
import { profileColors } from "@/utils/profileColor";

const login = () => {
  const { currentUser, isLoading } = useAuth();
  const [email, setEmail] = useState("");

  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const colorIndex = Math.floor(Math.random() * profileColors.length);

  useEffect(() => {
    if (!isLoading && currentUser) {
      //it means user logged in
      router.push("/");
    }
  }, [currentUser, isLoading]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("sign in successful");
    } catch (error) {
      console.log(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      console.log(user);

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        color: profileColors[colorIndex],
      });

      await setDoc(doc(db, "userChats", user.uid), {});

      await updateProfile(user, { displayName });

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

  const resetPassword = () => {
    try {
      toast.promise(
        async () => {
          //our logic
          await sendPasswordResetEmail(auth, email);
        },
        {
          pending: "Generating reset link",
          success:
            "Reset password link had sent to your registered email id. 👌",
          error: "You may have entered wrong email id. 🤯",
        },
        {
          autoClose: 5000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return isLoading || (!isLoading && currentUser) ? (
    <Loader />
  ) : (
    <div className="flex h-[100vh] justify-center items-center bg-c1">
      {/* Login Section */}
      <ToastMsg />
      <div className="flex items-center flex-col">
        {/* Heading */}
        <div className="text-center">
          <div className="text-4xl font-bold">Login To Your Account</div>
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

        {/* Login with email */}
        <form
          className="flex flex-col items-center gap-3 w-[500px] mt-5"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
          />
          <div className="text-right w-full text-c3" onClick={resetPassword}>
            <span className="cursor-pointer">Forgot Password?</span>
          </div>
          <button className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Login To Your Account
          </button>
        </form>

        {/* "Don't have an account?" */}
        <div className="flex justify-center gap-1 text-c3 mt-5">
          <span>Not a member yet?</span>
          <Link
            href="/register"
            className="font-semibold text-white underline underline-offset-2"
          >
            Register Now.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default login;
