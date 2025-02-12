import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "../components/lib/apiClient";
import "./root.css";

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const username = watch("username");
  const email = watch("email");
  const password = watch("password");

  const onSubmit = async (data) => {
    const { username, email, password } = data;
    const response = await api.post("/auth/register", {
      username: username,
      email: email,
      password: password,
    });
    if (response.status === 201) {
      navigate("/sign-in");
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
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter email..."
              {...register("email", { required: "Email is required" })}
              value={email}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email?.type === "required" && (
              <p role="alert" className="error-alert">
                {errors.email?.message}
              </p>
            )}
          </div>
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
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
            Create Account
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
              onClick={() => navigate("/sign-in")}
            >
              Log In
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
