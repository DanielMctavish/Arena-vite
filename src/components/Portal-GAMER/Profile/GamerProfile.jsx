import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Adicione esta linha
import AssideGamer from '../GAMER-components/AssideGamer';
import backgroundPortal from "../../../medias/backgrounds/elden-ring-godfrey.png";
import axios from 'axios';
import { Person, Email, CalendarToday, Edit } from "@mui/icons-material";

function GamerProfile() {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate(); // Adicione esta linha

    useEffect(() => {
        const fetchProfile = async () => {
            const clientSessionData = JSON.parse(localStorage.getItem('arena-client-login'));
            if (!clientSessionData || !clientSessionData.body) {
                // Redirect to login if no session data
                navigate("/gamer-login");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/client/find-by-email?email=${clientSessionData.body.email}`, {
                    headers: { 'Authorization': `Bearer ${clientSessionData.token}` }
                });
                setProfile(response.data.body);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [navigate]); // Adicione navigate como dependência do useEffect

    const handleEdit = () => {
        setIsEditing(!isEditing);
        // Implement edit functionality
    };

    return (
        <div id='gamer-profile' className="bg-gradient-to-br from-purple-900 p-2 gap-2
        via-indigo-900 to-blue-900 w-full h-[100vh] flex relative border-[10px] border-[#7300F4]">
            <img src={backgroundPortal} alt="backgroundPortal"
                className='absolute top-0 left-0 w-full h-full object-cover opacity-30 blur-[4px]' />

            <AssideGamer />

            <section className='flex flex-col sm:w-[70%] w-full h-full 
            justify-start items-center relative bg-black/30
            rounded-[10px] backdrop-blur-lg gap-4 overflow-y-auto p-6'>

                <div className='w-full flex justify-between items-center mb-6'>
                    <h2 className="text-3xl font-bold text-white">Perfil do Gamer</h2>
                    <button onClick={handleEdit} className="px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center">
                        <Edit className="mr-2" />
                        {isEditing ? "Salvar" : "Editar Perfil"}
                    </button>
                </div>

                {profile && (
                    <div className='w-full bg-white/10 text-white rounded-lg p-6 backdrop-filter backdrop-blur-md'>
                        <div className="flex items-center mb-4">
                            <img src={profile.avatar_url || "https://via.placeholder.com/100"} alt="Profile" className="w-24 h-24 rounded-full mr-4" />
                            <h3 className="text-2xl font-bold">{profile.nome}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                                <Person className="mr-2" />
                                <span>{profile.nome}</span>
                            </div>
                            <div className="flex items-center">
                                <Email className="mr-2" />
                                <span>{profile.email}</span>
                            </div>
                            <div className="flex items-center">
                                <CalendarToday className="mr-2" />
                                <span>Membro desde: {new Date(profile.createdAt).toLocaleDateString()}</span>
                            </div>
                            {/* Add more profile fields as needed */}
                        </div>
                    </div>
                )}

                {/* You can add more sections here, like gaming preferences, achievements, etc. */}

            </section>
        </div>
    );
}

export default GamerProfile;