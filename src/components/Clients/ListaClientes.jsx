import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ClienteLinhaTd from './ClienteLinhaTd';

function ListaClientes() {
    const [clients, setClients] = useState([]);
    const clientsUpdateTrigger = useSelector(state => state.clientsUpdate);

    const getClients = async () => {
        const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'));
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/client/all-clients`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            });
            setClients(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    // Atualiza quando o trigger é alterado
    useEffect(() => {
        getClients();
    }, [clientsUpdateTrigger]);

    return (
        <div>
            {clients.map(client => (
                <ClienteLinhaTd 
                    key={client.id}
                    {...client}
                    onUpdate={getClients}
                />
            ))}
        </div>
    );
}

export default ListaClientes; 