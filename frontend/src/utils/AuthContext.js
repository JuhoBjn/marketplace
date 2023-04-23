import { createContext } from "react";

export const AuthContext = createContext({
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  token: "",
  signup: function () {},
  login: function () {},
  logout: function () {},
});
