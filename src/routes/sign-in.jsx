import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "../components/lib/apiClient";
import { useAuth } from "../providers/AuthProvider";
import "./root.css";

export const SignIn = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setCurrentUser } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const username = watch("username");
  const password = watch("password");

  const onSubmit = async (data) => {
    const { username, password } = data;
    const response = await api.post("/auth/login", {
      username: username,
      password: password,
    });
    if (response.status === 200) {
      sessionStorage.setItem("accessToken", response.data.token);
      sessionStorage.setItem("currentUserId", response.data.user._id);
      setCurrentUser(response.data.user);

      navigate("/");
    }
  };

  return (
    <div className="container">
      <header className="join-header">
        <h1>
          <i className="fas fa-smile"></i> Simple Chat
        </h1>
      </header>
      <main className="main">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username..."
              {...register("username", { required: "Username is required" })}
              value={username}
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username?.type === "required" && (
              <p role="alert" className="error-alert">
                {errors.username?.message}
              </p>
            )}
          </div>
          <div className="form-control">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              {...register("password", { required: "Password is required" })}
              value={password}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password?.type === "required" && (
              <p role="alert" className="error-alert">
                {errors.password?.message}
              </p>
            )}
          </div>

          <button type="submit" className="btn">
            Log In
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
              onClick={() => navigate("/sign-up")}
            >
              Create Account
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
