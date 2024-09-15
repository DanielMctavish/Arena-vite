import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AssideGamer from './GAMER-components/AssideGamer';
import backgroundPortal from "../../medias/backgrounds/elden-ring-godfrey.png";
import axios from 'axios';
import { ShoppingCart, Close } from "@mui/icons-material";

function GamerShop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const clientSessionData = JSON.parse(localStorage.getItem('arena-client-login'));
            
            if (!clientSessionData || !clientSessionData.body) {
                navigate("/gamer-login");
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/list-products`, {
                    params: { owner_id: clientSessionData.body.administrator_id },
                    headers: { 'Authorization': `Bearer ${clientSessionData.token}` }
                });
                setProducts(response.data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Falha ao carregar produtos. Por favor, tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [navigate]);

    const openFullscreenImage = (imageUrl) => {
        setFullscreenImage(imageUrl);
    };

    const closeFullscreenImage = () => {
        setFullscreenImage(null);
    };

    return (
        <div id='gamer-shop' className="bg-gradient-to-br from-purple-900 p-2 gap-2
        via-indigo-900 to-blue-900 w-full h-[100vh] flex relative border-[10px] border-[#7300F4]">
            <img src={backgroundPortal} alt="backgroundPortal"
                className='absolute top-0 left-0 w-full h-full object-cover opacity-30 blur-[4px]' />

            <AssideGamer />

            <section className='flex flex-col sm:w-[70%] w-full h-full 
            justify-start items-center relative bg-black/30
            rounded-[10px] backdrop-blur-lg gap-4 overflow-y-auto p-6'>

                <div className='w-full flex justify-between items-center mb-6'>
                    <h2 className="text-3xl font-bold text-white">Loja</h2>
                </div>

                {loading ? (
                    <div className="text-white">Carregando produtos...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : products.length === 0 ? (
                    <div className="text-white">Nenhum produto disponível no momento.</div>
                ) : (
                    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {products.map((product) => (
                            <div key={product.id} className='bg-white/10 text-white rounded-lg p-4 backdrop-filter backdrop-blur-md'>
                                <img 
                                    src={product.url_img || "https://via.placeholder.com/150"} 
                                    alt={product.name} 
                                    className="w-full h-40 object-cover rounded-md mb-2 cursor-pointer" 
                                    onClick={() => openFullscreenImage(product.url_img)}
                                />
                                <h3 className="text-xl font-bold">{product.name}</h3>
                                <p className="text-sm mb-2">Disponível: {product.available}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold">R$ {product.value.toFixed(2)}</span>
                                    <button className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center">
                                        <ShoppingCart className="mr-1" fontSize="small" />
                                        Comprar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {fullscreenImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <img src={fullscreenImage} alt="Fullscreen" className="max-w-full max-h-full" />
                        <button 
                            onClick={closeFullscreenImage}
                            className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition"
                        >
                            <Close />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GamerShop;