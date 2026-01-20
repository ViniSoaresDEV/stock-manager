import { useState } from "react";
import "./Login.css";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { LuAperture } from "react-icons/lu";

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function validaLogin() {
    if (!usuario || !senha) {
      alert("Preencha o usuário e a senha");
      return;
    }

    const resposta = await fetch(
      "https://696fc18ba06046ce6187c5cc.mockapi.io/users",
    );
    const dados = await resposta.json();

    const usuarioEncontrado = dados.find((user) => {
      return user.user === usuario && user.password === senha;
    });

    if (usuarioEncontrado) {
      onLogin();
    } else {
      alert("Usuário ou senha incorretos.");
      console.log(dados.user);
    }
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
