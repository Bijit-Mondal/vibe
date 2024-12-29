import React from "react";
import Background from "../Background";
import InviteFriendsToast from "./InviteFriendsToast";
import Blur from "../Blur";
// import Reconnect from "./Reconnect";

function Popups() {
  return (
    <>
      <Background />
      <InviteFriendsToast />
      <Blur />
      {/* <Reconnect /> */}
    </>
  );
}

export default Popups;
