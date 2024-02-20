import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import ArenaJafHome from './components/ArenaJafHome';
import RegisterAdm from './components/Portal-ADM/register/RegisterAdm';

import PortalAdm from './components/Portal-ADM/PortalAdm';
import PortalAdmCaixa from './components/Portal-ADM/PortalAdmCaixa';
import PortalAdmClientes from './components/Portal-ADM/PortalAdmClientes';
import PortalAdmColaboradores from './components/Portal-ADM/PortalAdmColaboradores';
import PortalAdmProdutos from './components/Portal-ADM/PRODUCTS/PortalAdmProdutos';
import PortalGamerLogin from './components/Portal-GAMER/Login/PortalGamerLogin';
import PortalAdmLocais from './components/Portal-ADM/PortalAdmLocais';
import PortalGamerDashboard from './components/Portal-GAMER/PortalGamerDashboard';
import PortalGamerFinanceiro from './components/Portal-GAMER/PortalGamerFinanceiro';
import PortalAdmLogin from "./components/Portal-ADM/PortalAdmLogin"


import GamerRegister from './components/Portal-GAMER/Register/GamerRegister';


function App() {

  return (
    <div className="App bg-zinc">
      <BrowserRouter>
        <Routes>
          <Route Component={ArenaJafHome} path="/" exact /> 
          <Route Component={RegisterAdm} path="/register-master" exact /> 

          <Route Component={() => (<PortalAdmLogin />)} path="/adm-login" exact />

          <Route
            path="/adm-sessions"
            exact
            element={<PortalAdm />}
          />

          <Route
            path="/adm-caixa"
            exact
            element={<PortalAdmCaixa />}
          />
          <Route
            path="/adm-clientes"
            exact
            element={<PortalAdmClientes />}
          />
          <Route
            path="/adm-colaboradores"
            exact
            element={<PortalAdmColaboradores />}
          />
          <Route
            path="/adm-produtos"
            exact
            element={<PortalAdmProdutos />}
          />
          <Route
            path="/adm-locais"
            exact
            element={<PortalAdmLocais />}
          />

          {/* PORTAL GAMER */}
          <Route
            path="/gamer-dashboard"
            exact
            element={<PortalGamerDashboard />}
          />
          <Route
            path="/gamer-financeiro"
            exact
            element={<PortalGamerFinanceiro />}
          />
          <Route
            path="/gamer-login"
            exact
            element={<PortalGamerLogin />}
          />

          <Route
            path="/gamer-register"
            exact
            element={<GamerRegister />}
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
