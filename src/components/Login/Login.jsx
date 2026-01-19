import { useState } from "react";
import "./Login.css";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  function validaLogin() {
    if (!usuario || !senha) {
      alert("Preencha o usuário e a senha");
      return;
    }

    if (usuario !== "adm" || senha !== "123") {
      alert("Usuário ou senha incorretos");
      return;
    }

    onLogin();
  }

  return (
    <div className="container">
      <div className="login-box">
        <h1 className="login-title">Login - Bellano Móveis</h1>
        <div className="input-container">
          <div className="login-input-box">
            <span>Usuário</span>
            <input
              type="text"
              className="login-input"
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>
          <div className="login-input-box">
            <span>Senha</span>
            <input
              type="password"
              className="login-input"
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button className="login-btn" onClick={validaLogin}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
