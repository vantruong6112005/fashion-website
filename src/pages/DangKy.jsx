import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";

export default function DangKy() {
  const navigate = useNavigate();

  return (
    <AuthModal
      open
      initialMode="register"
      onClose={() => navigate("/")}
    />
  );
}
