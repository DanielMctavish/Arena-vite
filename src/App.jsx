import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

const ArenaJafHome = React.lazy(() => import('./components/ArenaJafHome'));
const RegisterAdm = React.lazy(() => import('./components/Portal-ADM/register/RegisterAdm'));
const PortalAdm = React.lazy(() => import('./components/Portal-ADM/PortalAdm'));
const PortalAdmCaixa = React.lazy(() => import('./components/Portal-ADM/PortalAdmCaixa'));
const PortalAdmClientes = React.lazy(() => import('./components/Portal-ADM/PortalAdmClientes'));
const PortalAdmColaboradores = React.lazy(() => import('./components/Portal-ADM/PortalAdmColaboradores'));
const PortalAdmProdutos = React.lazy(() => import('./components/Portal-ADM/PRODUCTS/PortalAdmProdutos'));
const PortalGamerLogin = React.lazy(() => import('./components/Portal-GAMER/Login/PortalGamerLogin'));
const PortalAdmLocais = React.lazy(() => import('./components/Portal-ADM/PortalAdmLocais'));
const PortalGamerDashboard = React.lazy(() => import('./components/Portal-GAMER/PortalGamerDashboard'));
const PortalGamerFinanceiro = React.lazy(() => import('./components/Portal-GAMER/PortalGamerFinanceiro'));
const PortalAdmLogin = React.lazy(() => import("./components/Portal-ADM/PortalAdmLogin"));
const GamerRegister = React.lazy(() => import('./components/Portal-GAMER/Register/GamerRegister'));

function App() {
  return (
    <div className="App bg-zinc">
      <BrowserRouter>
        <Suspense fallback={<div className='text-zinc-600'>carregando...</div>}>
          <Routes>
            <Route element={<ArenaJafHome />} path="/" exact />
            <Route element={<RegisterAdm />} path="/register-master" exact />
            <Route element={<PortalAdmLogin />} path="/adm-login" exact />
            <Route element={<PortalAdm />} path="/adm-sessions" />
            <Route element={<PortalAdmCaixa />} path="/adm-caixa" />
            <Route element={<PortalAdmClientes />} path="/adm-clientes" />
            <Route element={<PortalAdmColaboradores />} path="/adm-colaboradores" />
            <Route element={<PortalAdmProdutos />} path="/adm-produtos" />
            <Route element={<PortalAdmLocais />} path="/adm-locais" />
            <Route element={<PortalGamerDashboard />} path="/gamer-dashboard" />
            <Route element={<PortalGamerFinanceiro />} path="/gamer-financeiro" />
            <Route element={<PortalGamerLogin />} path="/gamer-login" />
            <Route element={<GamerRegister />} path="/gamer-register" />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
