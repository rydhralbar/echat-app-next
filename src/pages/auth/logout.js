import React, { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import * as profile from "@/stores/reducer/profile";
import { useEffect } from "react";
import * as useDb from "@/utils/firebaseDb";

const Logout = () => {
  const [usersList, setUsersList] = useState({});

  // const dispatch = useDispatch();
  const router = useRouter();

  // useEffect(() => {
  //   useDb.getData("users", (snapshot) => {
  //     const data = snapshot.val();

  //     if (data) {
  //       setUsersList(data);
  //     }
  //   });

  //   useDb.sendData("users", {
  //     ...usersList,
  //     [user.uid]: {
  //       ...usersList[user.uid],
  //       ...{
  //         is_online: false,
  //       },
  //     },
  //   });
  // }, []);

  useState(() => {
    setTimeout(() => {
      // dispatch(profile.setProfile(null));
      // dispatch(profile.setToken(null));
      localStorage.removeItem("user");
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
