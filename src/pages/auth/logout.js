/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import * as profile from "@/stores/reducer/profile";
import { useEffect } from "react";
import * as useDb from "@/utils/firebaseDb";
import { deleteCookie } from "cookies-next";

const Logout = () => {
  const [usersList, setUsersList] = useState({});

  const dispatch = useDispatch();
  const router = useRouter();

  const selector = useSelector((state) => state?.profile);

  // console.log("profile", JSON.parse(selector?.profile?.payload));

  // console.log("userList", usersList[uidUser]);

  useEffect(() => {
    useDb.getData("users", (snapshot) => {
      const data = snapshot.val();
      // console.log(data);

      if (data) {
        setUsersList(data);
      }
    });
  }, []);

  useEffect(() => {
    const uidUser = JSON.parse(selector?.profile?.payload).uid;
    if (Object.keys(usersList)?.length > 0) {
      const logoutUser = {
        ...usersList[uidUser],
        ...{
          is_online: false,
        },
      };
      useDb.sendData(`users/${uidUser}`, logoutUser);
    }
  }, [usersList]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(profile.setProfile(null));
      dispatch(profile.setIsLogin(false));
      deleteCookie("user");
      router.replace("/auth");
    }, 1500);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <div>
        <div>
          <img
            src="/images/echat-logo.png"
            alt="echat"
            style={{ width: "95px", margin: "auto", marginBottom: "50px" }}
          />
        </div>
        <div>
          <progress className="progress w-56"></progress>
        </div>
      </div>
    </div>
  );
};

export default Logout;
