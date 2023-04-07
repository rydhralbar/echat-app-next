/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Head from "next/head";
import EmojiPicker from "emoji-picker-react";
import styles from "@/styles/pages/Home.module.scss";
import {
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  TextField,
  Typography,
  ListItemText,
  Box,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import ListItemIcon from "@mui/material/ListItemIcon";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import VideocamIcon from "@mui/icons-material/Videocam";
import BlockIcon from "@mui/icons-material/Block";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import ImageIcon from "@mui/icons-material/Image";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckIcon from "@mui/icons-material/Check";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import StarIcon from "@mui/icons-material/Star";
import CallIcon from "@mui/icons-material/Call";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CollectionsIcon from "@mui/icons-material/Collections";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { Container } from "@mui/system";
import { MdArrowBack } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import * as useDb from "@/utils/firebaseDb";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { getCookie } from "cookies-next";

const rightData = [
  { name: "Change wallpaper", icon: <ImageIcon /> },
  { name: "Add to group", icon: <GroupAddIcon /> },
  { name: "Starred messages", icon: <StarIcon /> },
  { name: "Clear chat", icon: <DeleteIcon /> },
  { name: "Restore deleted chat", icon: <RestoreFromTrashIcon /> },
  { name: "Block chat", icon: <BlockIcon /> },
  { name: "Report user", icon: <ThumbDownIcon /> },
];

const bottomData = [
  { name: "Document", icon: <InsertDriveFileIcon /> },
  { name: "Audio", icon: <AudiotrackIcon /> },
  { name: "Location", icon: <MyLocationIcon /> },
  { name: "Gallery", icon: <CollectionsIcon /> },
  { name: "Contact", icon: <PermContactCalendarIcon /> },
];

const Home = () => {
  const [editName, setEditName] = useState("");
  const [editNameInput, setEditNameInput] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editBioInput, setEditBioInput] = useState(false);
  const [profile, setProfile] = useState(null);
  const [uuid, setUuid] = useState("");
  const [isClickedChat, setIsClickedChat] = useState(false);
  const [isClickedDots, setIsClickedDots] = useState(false);
  const [isClickedAttach, setIsClickedAttach] = useState(false);
  const [isClickedProfile, setIsClickedProfile] = useState(false);
  const [selectedChat, setSelectedChat] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [messageList, setMessageList] = useState({});
  const [messageKey, setMessageKey] = useState([]);
  const [messageFilter, setMessageFilter] = useState([]);
  const [usersList, setUsersList] = useState({});
  const [usersKey, setUsersKey] = useState([]);
  const [isClickedEmoji, setIsClickedEmoji] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [userData, setUserData] = useState({});

  const router = useRouter();
  const selector = useSelector((state) => state.profile);

  useEffect(() => {
    const checkCookie = getCookie("user");
    const checkRedux = selector?.isLogin?.payload;

    if (checkCookie === undefined || !checkRedux) {
      router.replace("/auth");
    } else {
      const user = JSON.parse(getCookie("user"));
      const uuidProfile = JSON.parse(getCookie("user")).uid;

      setUuid(uuidProfile);
      setProfile(user);

      useDb.getData("users", (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const dataWithoutUser = Object.keys(data).filter(
            (item) => item !== uuid
          );
          setUsersList(data);
          setUsersKey(dataWithoutUser);

          const dataUser = usersList[uuid];

          setUserData(dataUser);
        }
      });

      useDb.getData(`messages/users`, (snapshot) => {
        const data = snapshot.val();

        if (data) {
          setMessageList(data);
          setMessageKey(Object.keys(data));
        }
      });
    }
  }, []);

  useEffect(() => {
    // const uuidProfile = JSON.parse(getCookie("user")).uid;
    useDb.getData("users", (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const dataWithoutUser = Object.keys(data).filter(
          (item) => item !== uuid
        );
        setUsersList(data);
        setUsersKey(dataWithoutUser);

        const dataUser = usersList[uuid];

        setUserData(dataUser);
      }
    });
  }, [usersList]);

  const sendMessage = () => {
    useDb.sendData("messages", {
      [`users`]: {
        ...messageList,
        [new Date().getTime()]: {
          text: keyword,
          image: "",
          timestamp: new Date().getTime(),
          user_id: uuid,
          sender: uuid,
          target_id: selectedChat,
        },
      },
    });

    useDb.getData(`messages/users`, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const filterChat = Object.keys(data).map((item) => data[item]);

        setMessageFilter(
          filterChat.filter(
            (item) => item.target_id === selectedChat || item.target_id === uuid
          )
        );
      }
    });

    setIsClickedEmoji(false);
    setKeyword("");
  };

  const editProfilePhoto = () => {};

  const editProfileName = () => {
    if (Object.keys(usersList)?.length > 0 && editName !== "") {
      const changeName = {
        ...usersList[uuid],
        ...{
          name: editName,
        },
      };
      useDb.sendData(`users/${uuid}`, changeName);

      setEditNameInput(false);
    }
  };

  const editProfileBio = () => {
    if (Object.keys(usersList)?.length > 0 && editBio !== "") {
      const changeBio = {
        ...usersList[uuid],
        ...{
          bio: editBio,
        },
      };
      useDb.sendData(`users/${uuid}`, changeBio);

      setEditBioInput(false);
    }
  };

  const rightDrawer = () => (
    <div style={{ width: 250 }}>
      {rightData.map((item, key) => (
        <ListItem
          button
          key={key}
          onClick={() => {
            alertButton();
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </div>
  );

  const bottomDrawer = () => (
    <div style={{ width: 250 }}>
      {bottomData.map((item, key) => (
        <ListItem
          button
          key={key}
          onClick={() => {
            alertButton();
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </div>
  );

  const alertButton = () => {
    Swal.fire({
      icon: "warning",
      title: "Oops",
      text: "Features not yet developed!",
      confirmButtonText: "OK",
      confirmButtonColor: "#B30000",
    });
  };

  return (
    <>
      <Head>
        <title>eChat</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Grid container height="100vh">
          <Grid item lg={4} className={styles.leftSide}>
            <Container className={styles.leftWrapper}>
              <Container className={styles.navProfile}>
                <Avatar
                  alt={profile?.displayName}
                  src={profile?.photoURL}
                  // src={`${
                  //   selector?.profile?.payload?.photoURL
                  //     ? selector?.profile?.payload?.photoURL
                  //     : "/static/images/avatar/1.jpg"
                  // }`}
                  sx={{ marginRight: "15px", cursor: "pointer" }}
                  onClick={() => setIsClickedProfile(true)}
                />
                {isClickedProfile && (
                  <Drawer
                    open={open}
                    anchor={"left"}
                    onClose={() => setIsClickedProfile(false)}
                    sx={{
                      "& .MuiDrawer-paperAnchorLeft": {
                        width: "33.5%",
                        background:
                          "linear-gradient(#B30000 12%, rgb(229, 229, 229) 10%)",
                      },
                    }}
                  >
                    <div>
                      <div className="flex">
                        <MdArrowBack
                          style={{
                            width: "60px",
                            height: "25px",
                            marginTop: "23px",
                            cursor: "pointer",
                            color: "white",
                          }}
                          onClick={() => setIsClickedProfile(false)}
                        />
                        <h5
                          style={{
                            fontSize: "23px",
                            marginTop: "20px",
                            marginLeft: "5px",
                            color: "white",
                          }}
                        >
                          Profile
                        </h5>
                      </div>
                      <div className="flex justify-center">
                        <div>
                          <div className="flex justify-center mt-24">
                            <Avatar
                              alt={userData?.name}
                              src={userData?.photo}
                              // src={`${
                              //   selector?.profile?.payload?.photoURL
                              //     ? selector?.profile?.payload?.photoURL
                              //     : "/static/images/avatar/1.jpg"
                              // }`}
                              sx={{
                                width: "100px",
                                height: "100px",
                                "& .css-1pqm26d-MuiAvatar-img": {
                                  height: "100%",
                                },
                                marginBottom: "20px",
                              }}
                            />
                            <EditIcon
                              sx={{ marginTop: "75px", cursor: "pointer" }}
                            />
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text text-black">
                                Your name
                              </span>
                            </label>
                            <input
                              type="text"
                              // placeholder={profile?.displayName}
                              className="input input-bordered input-secondary w-full max-w-xs text-gray-500"
                              style={{ width: "290px" }}
                              disabled={!editNameInput}
                              defaultValue={userData?.name}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                            {!editNameInput && (
                              <EditIcon
                                sx={{
                                  margin: "auto",
                                  marginLeft: "17px",
                                  cursor: "pointer",
                                }}
                                onClick={() => setEditNameInput(true)}
                              />
                            )}
                            {editNameInput && (
                              <CheckIcon
                                sx={{
                                  margin: "auto",
                                  marginLeft: "17px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  editProfileName();
                                }}
                              />
                            )}
                          </div>
                          <div className="mt-5">
                            <label className="label">
                              <span className="label-text text-black">
                                Your bio
                              </span>
                            </label>
                            <input
                              type="text"
                              // placeholder={profile?.displayName}
                              className="input input-bordered input-secondary w-full max-w-xs text-gray-500"
                              style={{ width: "290px" }}
                              disabled={!editBioInput}
                              defaultValue={userData?.bio}
                              onChange={(e) => setEditBio(e.target.value)}
                            />
                            {!editBioInput && (
                              <EditIcon
                                sx={{
                                  margin: "auto",
                                  marginLeft: "17px",
                                  cursor: "pointer",
                                }}
                                onClick={() => setEditBioInput(true)}
                              />
                            )}
                            {editBioInput && (
                              <CheckIcon
                                sx={{
                                  margin: "auto",
                                  marginLeft: "17px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  editProfileBio();
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Drawer>
                )}
                <Typography variant="h2" className={styles.textLogo}>
                  eChat
                </Typography>
                <LogoutIcon
                  style={{
                    margin: "auto",
                    marginLeft: "57%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    router.push("/auth/logout");
                  }}
                />
                {/* <BsThreeDotsVertical onClick={() => setIsClickedDots(true)} /> */}
              </Container>
              <TextField
                id="outlined-basic"
                placeholder="Search or start new chat"
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src="/images/search.svg" alt="search" />
                    </InputAdornment>
                  ),
                }}
                className={styles.textfield}
              />

              <List className={styles.listChats}>
                {usersKey.map((item, key) => (
                  <ListItem
                    alignItems="flex-start"
                    sx={{ paddingLeft: "0px" }}
                    button
                    selected={selectedChat === usersList[item]?.user_id}
                    key={key}
                    onClick={() => {
                      setIsClickedChat(true);
                      setSelectedChat(usersList[item]?.user_id);

                      const filterChat = messageKey?.map(
                        (item) => messageList[item]
                      );

                      const selected_id = usersList[item]?.user_id;

                      setMessageFilter(
                        filterChat?.filter(
                          (item) =>
                            item?.target_id === selected_id ||
                            item?.target_id === uuid
                        )
                      );
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={usersList[item]?.name}
                        src={usersList[item]?.photo}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={usersList[item]?.name}
                      sx={{
                        "& .css-10hburv-MuiTypography-root": {
                          color: "black",
                        },
                      }}
                      secondary={
                        <Typography
                          sx={{
                            display: "inline",
                            color: "#808080",
                          }}
                          component="span"
                          variant="body2"
                        >
                          {usersList[item]?.bio}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Container>
          </Grid>
          <Grid item-lg={8}>
            {!isClickedChat && (
              <Typography className={styles.rightSideSlogan}>
                Please select a chat to start messaging
              </Typography>
            )}

            {isClickedChat && (
              <React.Fragment>
                <Box
                  sx={{
                    backgroundColor: "#B30000",
                    px: 1.8,
                    py: 1.5,
                    width: "53.33rem",
                    display: "flex",
                  }}
                >
                  <Box display="flex" gap={2}>
                    <MdArrowBack
                      className={styles.arrowBack}
                      onClick={() => setIsClickedChat(false)}
                    />
                    <Avatar
                      alt={usersList[selectedChat]?.name}
                      src={usersList[selectedChat]?.photo}
                      sx={{ width: "50px", height: "50px" }}
                    />

                    <div>
                      <Typography color="white">
                        {usersList[selectedChat]?.name}
                      </Typography>
                      <Typography
                        sx={{
                          display: "inline",
                          color: `${
                            usersList[selectedChat]?.is_online
                              ? "#33ff33"
                              : "#808080"
                          }`,
                        }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {usersList[selectedChat].is_online
                          ? "Online"
                          : "Offline"}
                      </Typography>
                    </div>
                    {!isMute ? (
                      <NotificationsIcon
                        className={styles.notifIcon}
                        onClick={() => setIsMute(true)}
                      />
                    ) : (
                      <NotificationsOffIcon
                        className={styles.notifIcon}
                        onClick={() => setIsMute(false)}
                      />
                    )}

                    <CallIcon
                      className={styles.callIcon}
                      onClick={() => alertButton()}
                    />
                    <VideocamIcon
                      className={styles.vidcallIcon}
                      onClick={() => alertButton()}
                    />
                    <BsThreeDotsVertical
                      className={styles.threeDotsRightSide}
                      onClick={() => setIsClickedDots(true)}
                    />
                    {isClickedDots && (
                      <Drawer
                        open={open}
                        anchor={"right"}
                        onClose={() => setIsClickedDots(false)}
                      >
                        {rightDrawer()}
                      </Drawer>
                    )}
                  </Box>
                </Box>

                <Box>
                  <Box
                    sx={{
                      height: "75vh",
                      overflowY: "auto",
                    }}
                  >
                    {messageFilter?.map((item, key) => {
                      if (
                        item.sender === uuid &&
                        item.target_id === selectedChat
                      ) {
                        return (
                          <div className="chat chat-end mt-2 mb-2" key={key}>
                            <div className="chat-bubble">{item?.text}</div>
                          </div>
                        );
                      } else if (
                        item?.sender === selectedChat &&
                        item?.target_id === uuid
                      ) {
                        return (
                          <div className="chat chat-start mt-4 mb-2" key={key}>
                            <div className="chat-bubble">{item?.text}</div>
                          </div>
                        );
                      }
                    })}
                  </Box>
                </Box>
                <Box className={styles.sendfield}>
                  {isClickedEmoji && (
                    <Box position="fixed" zIndex={99999} bottom="10vh">
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          setKeyword(`${keyword} ${e.emoji}`);
                        }}
                      />
                    </Box>
                  )}
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    value={keyword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          sx={{ cursor: "pointer" }}
                          position="start"
                        >
                          <EmojiEmotionsIcon
                            onClick={() => setIsClickedEmoji(!isClickedEmoji)}
                          />
                          <KeyboardVoiceIcon
                            className="ml-5 mr-3"
                            onClick={() => {
                              alertButton();
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment
                          sx={{ cursor: "pointer" }}
                          position="start"
                        >
                          <AttachFileIcon
                            className="mr-6"
                            onClick={() => setIsClickedAttach(true)}
                          />
                          {isClickedAttach && (
                            <Drawer
                              open={open}
                              anchor={"bottom"}
                              onClose={() => setIsClickedAttach(false)}
                              sx={{
                                "& .MuiDrawer-paperAnchorBottom": {
                                  width: "67vw",
                                  marginLeft: "33.35%",
                                },
                                "& .MuiListItem-button": {
                                  width: "67vw",
                                },
                              }}
                            >
                              {bottomDrawer()}
                            </Drawer>
                          )}
                          <CameraAltIcon
                            className="mr-6"
                            onClick={() => {
                              alertButton();
                            }}
                          />
                          <SendRoundedIcon onClick={sendMessage} />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Type your message..."
                  />
                </Box>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </main>
    </>
  );
};

export default Home;
