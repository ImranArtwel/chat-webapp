// eslint-disable-next-line react/prop-types
const User = ({ username }) => {
  // Determine the color based on the status
  // const getColor = (status) => {
  //   switch (status) {
  //     case "online":
  //       return "green";
  //     case "offline":
  //       return "yellow";
  //     default:
  //       return "gray"; // Default color for unknown status
  //   }
  // };

  const formatUsername = (username) => {
    // eslint-disable-next-line react/prop-types
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  return (
    // <div>
    //   {/* <img
    //     src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
    //     alt="Avatar"
    //     style={{
    //       width: "50px",
    //       height: "50px",
    //       borderRadius: "50%",
    //       display: "inline-block",
    //       margin: "0 5px",
    //     }}
    //   /> */}
    //   {/* <span
    //     style={{
    //       fontSize: "16px",
    //       padding: "10px",
    //       background: "rgba(0,0, 0, 0.1)",
    //     }}
    //   > */}
    <span style={{}}>{formatUsername(username)}</span>
    // {/* </div> */}

    // {/* <div
    //   style={{
    //     width: "12px",
    //     height: "12px",
    //     borderRadius: "50%",
    //     backgroundColor: getColor(status),
    //     display: "inline-block",
    //     margin: "0 5px",
    //   }}
    // ></div> */}
  );
};

export default User;
