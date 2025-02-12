import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { api } from "../components/lib/apiClient";

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  setCurrentUser: () => {},
});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const token = sessionStorage.getItem("accessToken");
  const currentUserId = sessionStorage.getItem("currentUserId");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // const fetchToken = async () => {
    //   try {
    //     const response = await api.get("/auth/token");
    //     sessionStorage.setItem("accessToken", response.data.token);
    //     setIsLoggedIn(true);
    //     setUser(response.data.user);
    //   } catch {
    //     sessionStorage.setItem("accessToken", null);
    //   }
    // };
    const fetchUser = async () => {
      if (!isLoggedIn && currentUserId && !user) {
        const response = await api.get(`/auth/user/${currentUserId}`);
        setUser(response.data);
        sessionStorage.setItem("currentUserId", response.data._id);
        setIsLoggedIn(true);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if ([403, 401].includes(error.response.status)) {
          try {
            const response = await api.post("/auth/refresh");
            sessionStorage.setItem("accessToken", response.data.token);
            setIsLoggedIn(true);
            setUser(response.data.user);

            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            originalRequest._retry = true;
            return api(originalRequest);
          } catch {
            sessionStorage.setItem("accessToken", null);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(authInterceptor);
    };
  }, []);

  const setCurrentUser = (passedUser) => {
    setUser(passedUser);
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return authContext;
};
