import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "../components/lib/apiClient";
import { useAuth } from "../providers/AuthProvider";
import "./root.css";

export const Home = () => {
  const [isCreateRoom, setIsCreateRoom] = useState(false);
  const [rooms, setRooms] = useState([]);

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      room: "",
    },
  });

  const navigate = useNavigate();

  const { isLoggedIn, user } = useAuth();

  const room = watch("room");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in");
      return;
    }
    const fetchRooms = async () => {
      const response = await api.get("/chat");
      if (response.status === 200) {
        setRooms(response.data);
      }
    };
    fetchRooms();
    // eslint-disble-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, navigate]);

  const onSubmit = async () => {
    if (!isCreateRoom) {
      navigate({
        pathname: "/chat",
        search: `?room=${room}`,
      });
    } else {
      const response = await api.post("/chat", {
        userId: user._id,
        name: room,
      });
      if (response.status === 201) {
        navigate({
          pathname: "/chat",
          search: `?room=${room}`,
        });
      }
    }
  };

  return (
    <div className="container">
      <header className="join-header">
        <h1>
          <i className="fas fa-smile"></i> Reedly Chat
        </h1>
      </header>
      <main className="main">
        <form onSubmit={handleSubmit(onSubmit)}>
          {isCreateRoom ? (
            <div className="form-control">
              <label>Room</label>
              <input
                type="text"
                placeholder="Enter room name..."
                {...register("room", { required: "Room is required" })}
                value={room}
                aria-invalid={errors.username ? "true" : "false"}
              />
              {errors.username?.type === "required" && (
                <p role="alert" className="error-alert">
                  {errors.username?.message}
                </p>
              )}
            </div>
          ) : (
            <div className="form-control">
              <label>Room</label>
              <select
                name="room"
                id="room"
                {...register("room", { required: true })}
              >
                <option value="" disabled>
                  Select Option
                </option>
                {rooms.map((room) => (
                  <option value={room.name} key={room._id}>
                    {room.name}
                  </option>
                ))}
              </select>
              {errors.room?.type === "required" && (
                <p role="alert" className="error-alert">
                  Please select a room
                </p>
              )}
            </div>
          )}

          <button type="submit" className="btn">
            {isCreateRoom ? "Create room" : "Join Chat"}
          </button>
          <div>
            <div className="signup-container">
              <hr className="signup-line" />
              <p className="signup-text">or</p>
              <hr className="signup-line" />
            </div>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setIsCreateRoom(!isCreateRoom);
              }}
            >
              {isCreateRoom ? "Join Chat" : "Create Room"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
