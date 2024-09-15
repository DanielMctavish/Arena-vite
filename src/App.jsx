import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Screen01 from './test-navigation/Screen01';
import Screen02 from './test-navigation/Screen02';
import AdmProfile from './components/profile/AdmProfile';
import Financial from './components/Portal-ADM/Financial/Financial';
import AdmSessions from './components/Sessions/AdmSessions';

import ArenaJafHome from './components/ArenaJafHome'
import RegisterAdm from './components/Portal-ADM/register/RegisterAdm'
import PortalAdm from './components/Portal-ADM/PortalAdm'
import PortalAdmClientes from './components/Clients/PortalAdmClients'
import PortalAdmColaboradores from './components/Portal-ADM/PortalAdmColaboradores'
import PortalAdmProdutos from './components/Products/PortalAdmProdutos'
import PortalGamerLogin from './components/Portal-GAMER/Login/PortalGamerLogin'
import PortalAdmLocais from './components/Location/PortalAdmLocais'
import PortalGamerDashboard from './components/Portal-GAMER/PortalGamerDashboard'
import PortalGamerFinanceiro from './components/Portal-GAMER/PortalGamerFinanceiro'
import PortalAdmLogin from "./components/Portal-ADM/PortalAdmLogin"
import GamerRegister from './components/Portal-GAMER/Register/GamerRegister';
import GamerProfile from './components/Portal-GAMER/Profile/GamerProfile';
import GamerShop from './components/Portal-GAMER/GamerShop';

function App() {

  return (
    <div className="App bg-zinc">
      <BrowserRouter>
        <Suspense fallback={<div className='text-zinc-600'>carregando...</div>}>
          <Routes>
            {/* teste de navegação */}
            <Route element={<Screen01 />} path="/screen01" exact />
            <Route element={<Screen02 />} path="/screen02" exact />

            <Route element={<ArenaJafHome />} path="/" exact />
            <Route element={<RegisterAdm />} path="/register-master" exact />
            <Route element={<PortalAdmLogin />} path="/adm-login" exact />
            <Route element={<PortalAdm />} path="/adm-machines" />
            <Route element={<AdmSessions />} path="/adm-sessions" />
            <Route element={<AdmProfile />} path="/adm-profile" exact />
            <Route element={<Financial />} path="/financial" />
            <Route element={<PortalAdmClientes />} path="/adm-clientes" />
            <Route element={<PortalAdmColaboradores />} path="/adm-colaboradores" />
            <Route element={<PortalAdmProdutos />} path="/adm-produtos" />
            <Route element={<PortalAdmLocais />} path="/adm-locais" />

            {/* PORTAL GAMER */}
            <Route element={<PortalGamerDashboard />} path="/gamer-dashboard" />
            <Route element={<PortalGamerFinanceiro />} path="/gamer-financeiro" />
            <Route element={<PortalGamerLogin />} path="/gamer-login" />
            <Route element={<GamerRegister />} path="/gamer-register" />
            <Route element={<GamerProfile />} path="/profile" />
            <Route element={<GamerShop />} path="/shop" /> {/* Nova rota para a loja */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
