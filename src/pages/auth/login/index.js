import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { MdArrowBack } from "react-icons/md";
import styles from "@/styles/pages/Login.module.scss";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import * as profileReducer from "@/stores/reducer/profile";
import * as useDb from "@/utils/firebaseDb";
import { auth } from "@/utils/firebase";
import { setCookie, getCookie } from "cookies-next";

const provider = new GoogleAuthProvider();

const Login = () => {
  const [uuid, setUuid] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [usersList, setUsersList] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.profile);
  const isLoginRedux = selector?.isLogin?.payload;

  useEffect(() => {
    const isLogin = getCookie("user");
    if (isLogin && isLoginRedux) {
      router.replace("/");
    }
    useDb.getData("users", (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setUsersList(data);
      }
    });
  }, [router]);

  const loginManual = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        useDb.sendData("users", {
          ...usersList,
          [user.uid]: {
            ...usersList[user.uid],
            ...{
              is_online: true,
            },
          },
        });

        setIsError(false);
        setCookie("user", JSON.stringify(user));
        dispatch(profileReducer.setProfile(JSON.stringify(user)));
        dispatch(profileReducer.setIsLogin(true));

        setIsSuccess(true);
        setTimeout(() => {
          router.replace("/");
        }, 800);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error?.code?.slice(5).split("-").join(" ");
        const errorMessage =
          errorCode?.charAt(0).toUpperCase() + errorCode?.slice(1);
        // const errorMessage = error?.message;

        setIsError(true);
        setIsSuccess(false);
        setErrorMsg(errorMessage);
      });
  };

  const loginGoogle = () => {
    setIsLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsLoading(false);
        setIsError(false);

        const user = result?.user;

        useDb.sendData("users", {
          ...usersList,
          [user.uid]: {
            ...usersList[user.uid],
            ...{
              is_online: true,
            },
          },
        });

        dispatch(profileReducer.setProfile(JSON.stringify(user)));
        dispatch(profileReducer.setIsLogin(true));

        setCookie("user", JSON.stringify(user));

        setIsSuccess(true);
        setTimeout(() => {
          router.replace("/");
        }, 700);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsSuccess(false);
        const errorCode = error?.code?.slice(5).split("-").join(" ");
        const errorMessage =
          errorCode?.charAt(0).toUpperCase() + errorCode?.slice(1);

        // const errorMessage = error?.message;
        const email = error?.customData?.email;
        const credential = GoogleAuthProvider?.credentialFromError(error);

        setIsError(true);
        setErrorMsg(errorMessage);
      });
  };

  return (
    <>
      <Head>
        <title>Login | eChat</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container">
          <div className={`flex justify-center ${styles.allForm}`}>
            <div className={styles.wrapper}>
              <div>
                <MdArrowBack
                  onClick={() => router.back()}
                  className="cursor-pointer"
                  style={{ width: "25px", height: "25px", color: "black" }}
                />
                <h3
                  className="text-center"
                  style={{
                    fontSize: "30px",
                    marginBottom: "20px",
                    color: "black",
                  }}
                >
                  Login
                </h3>
                <hr className="mb-5" />
              </div>

              {isSuccess && (
                <div className="alert alert-success shadow-lg">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Login successful! Please wait</span>
                  </div>
                </div>
              )}

              {isError && (
                <div className="alert alert-error shadow-lg">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              <div>
                <div className="mb-3 mt-5">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    placeholder="Type your email"
                    className="input input-bordered input-secondary w-full"
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setErrorMsg("Email cannot be empty");
                      } else {
                        setEmail(e.target.value);
                      }
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    placeholder="Type your password"
                    className="input input-bordered input-secondary w-full"
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        loginManual();
                      }
                    }}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className={`btn btn-primary mt-5 ${styles.loginButton}`}
                    onClick={loginManual}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Login"}
                  </button>
                  <p className="mt-3 mb-3 text-center text-black">
                    Or login with
                  </p>
                  <button
                    type="submit"
                    className={`btn ${styles.googleButton}`}
                    onClick={loginGoogle}
                    disabled={isLoading}
                  >
                    <FcGoogle className="me-2" />
                    Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
