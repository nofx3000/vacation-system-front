import { Navigate } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function JwtAuth(props: any) {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  axios.defaults.headers["authorization"] = token;
  async function verify() {
    try {
      const res = await axios.get("/users/verify1");
      console.log(res);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  }
  verify();
  return props.children;
}
