import React, { useState } from "react";
import { BiCheck, BiEdit } from "react-icons/bi";
import Avatar from "./Avatar";
import { useAuth } from "@/context/authContext";
import Icon from "./Icon";
import { FiPlus } from "react-icons/fi";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import {
  MdAddAPhoto,
  MdAddPhoto,
  MdDeleteForever,
  MdPhotoCamera,
} from "react-icons/md";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { profileColors } from "@/utils/profileColor";
import { toast } from "react-toastify";
import ToastMsg from "@/components/ToastMsg";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebase-config/firebaseConfig";
import { updateProfile } from "firebase/auth";

const LeftNav = () => {
  const authUser = auth.currentUser;
  const [editProfile, setEditProfile] = useState(false);
  const [nameEdited, setNameEdited] = useState(false);
  const { currentUser, logOut, setCurrentUser } = useAuth();
  console.log(currentUser);

  const handleUpdateProfile = async (type, value) => {
    //color name photo photo-remove
    let obj = { ...currentUser };
    switch (type) {
      case "name":
        obj.displayName = value;
        break;
      case "color":
        obj.color = value;
        break;
      case "photo":
        obj.photoURL = value;
        break;
      case "photo-remove":
        obj.photoURL = null;
        break;
      default:
        break;
    }

    try {
      toast.promise(
        async () => {
          //our logic
          const userDocRef = doc(db, "users", currentUser.uid);
          await updateDoc(userDocRef, obj);
          setCurrentUser(obj);
          if (type === "photo-remove") {
            await updateProfile(authUser, { photoURL: null });
          }
          if (type === "name") {
            await updateProfile(authUser, { displayName: value });
          }
        },
        {
          pending: "Updating Profile",
          success: "Profile Updated Successfully ooo-whoo!! 👌",
          error: "Profile Update Failed 🤯",
        },
        {
          autoClose: 5000,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onkeyup = (e) => {
    if (e.target.innerText.trim() !== currentUser.displayName) {
      setNameEdited(true);
    } else {
      setNameEdited(false);
    }
  };

  const onkeydown = (e) => {
    if (e.key === "Enter" && e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const editProfileContainer = () => {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <span>Edit Profile</span>
          <Icon
            size="small"
            className="absolute top-0 right-0 hover:bg-c2"
            icon={<IoClose size={20} />}
            onClick={() => setEditProfile(false)}
          />
        </div>

        <div className="flex flex-row justify-center group cursor-pointer relative">
          <Avatar size="xx-large" user={currentUser} />
          <div className="w-[100px] h-full rounded-full bg-black/[0.5] absolute justify-center items-center hidden group-hover:flex ">
            <label htmlFor="fileUpload">
              {currentUser.photoURL ? (
                <MdPhotoCamera size={24} />
              ) : (
                <MdAddAPhoto size={24} />
              )}
            </label>
            <input
              type="file"
              id="fileUpload"
              onChange={(e) => {}}
              style={{ display: "none" }}
            />
          </div>
          {currentUser.photoURL && (
            <div className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute bottom-0 right-28">
              <MdDeleteForever size={16} />
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-col items-center">
          <div className="flex items-center gap-2">
            {!nameEdited && <BiEdit className="text-c3" />}
            {nameEdited && (
              <BsFillCheckCircleFill
                className="text-c4 cursor-pointer"
                onClick={() => {
                  handleUpdateProfile(
                    "name",
                    document.getElementById("displayNameEdit").innerText
                  );
                }}
              />
            )}
            <div
              contentEditable
              className="bg-transparent outline-none border-none text-center"
              id="displayNameEdit"
              onKeyUp={onkeyup}
              onKeyDown={onkeydown}
            >
              {currentUser.displayName}
            </div>
          </div>
          <span className="text-sm text-c3">{currentUser.email}</span>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-5">
          {profileColors.map((color, index) => (
            <span
              key={index}
              className="w-10 h-10 rounded-full flex justify-center items-center cursor-pointer transition-transform hover:scale-125"
              style={{ backgroundColor: color }}
            >
              {color === currentUser.color && <BiCheck size={24} />}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={` ${
        editProfile ? "w-[350px] px-5" : "w-[80px] items-center"
      }  flex flex-col justify-between py-5 shrink-0 transition-all`}
    >
      {editProfile ? (
        editProfileContainer()
      ) : (
        <div
          className="relative group cursor-pointer"
          onClick={() => setEditProfile(true)}
        >
          <Avatar size="large" user={currentUser} />
          <div className="absolute top-0 left-0 w-full h-full bg-c1/[0.5] rounded-full justify-center items-center hidden group-hover:flex">
            <BiEdit size={14} />
          </div>
        </div>
      )}

      <div
        className={`flex gap-5 ${
          editProfile ? "flex-row" : "flex-col items-center"
        }   absolute bottom-5`}
      >
        <Icon
          size="large"
          className="bg-green-500 hover:bg-gray-600"
          icon={<FiPlus size={24} />}
          onClick={() => {}}
        />
        <Icon
          size="large"
          className="bg-red-500 hover:bg-gray-600"
          icon={<IoLogOutOutline size={24} />}
          onClick={() => logOut()}
        />
      </div>
    </div>
  );
};

export default LeftNav;
