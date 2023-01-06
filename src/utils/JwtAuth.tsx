import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import {
  selectToken,
  selectUserinfo,
  verifyTokenAsync,
} from "../store/slices/userinfoSlice";

export default function JwtAuth(props: any) {
  // 1.浏览器是否有token
  // 2.redux是否有userinfo
  // 3.userinfo的exp时间是否过期（exp*1000）
  // 4.axios——verify
  const navigate = useNavigate();
  // !!!CAUTION!!! useDispatch泛型给AppDispatch，dispatch异步方法会报错
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);
  if (!token) {
    navigate("/login");
    return;
  }
  axios.defaults.headers["authorization"] = token;
  async function verify() {
    try {
      const res = await dispatch(verifyTokenAsync());
    } catch (err) {
      navigate("/login");
    }
  }
  verify();
  return props.children;
}
