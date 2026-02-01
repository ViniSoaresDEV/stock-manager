import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import './Login.css';
import { FiEye } from 'react-icons/fi';
import { FiEyeOff } from 'react-icons/fi';
import { LuAperture } from 'react-icons/lu';

function Login({ onLogin, adm }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  async function validaLogin() {
    if (!usuario || !senha) {
      alert('Preencha o usuário e a senha');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('user', usuario.toLocaleLowerCase())
        .eq('password', senha)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          alert('Usuário ou senha incorretos.');
          return;
        }

        throw error;
      }

      if (data) {
        adm(data.user);
        onLogin();
      }
    } catch (erro) {
      console.log('Erro no login: ', erro.message);
      alert('Erro de conexão ou sistema.');
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
              onKeyDown={(e) => e.key === 'Enter' && validaLogin()}
            />
          </div>
          <div className="login-input-box">
            <span>Senha</span>
            <input
              type="password"
              className="login-input"
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && validaLogin()}
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
