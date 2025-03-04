import axios from "axios";
import { Close, ShoppingCart, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ModClientConsumoCheckout from "./ModClientConsumoCheckout";
import { useSelector } from "react-redux";

function ModClientConsumo() {
    const clientState = useSelector(state => state.client)
    const [products, setProducts] = useState([])
    const [itemsCard, setItemsCard] = useState([])
    const [isShowingCheckout, setIsShowingCheckout] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        getAllProducts()
    }, [clientState])

    const getAllProducts = async () => {
        const currentSession = JSON.parse(localStorage.getItem('arena-adm-login'))

        try {
            const currentAdm = await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${currentSession.email}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            })

            await axios.get(`${import.meta.env.VITE_APP_API_URL}/product/list-products?owner_id=${currentAdm.data.id}`, {
                headers: {
                    'Authorization': `Bearer ${currentSession.token}`
                }
            }).then(response => {
                setProducts(response.data)
            })

        } catch (error) {
            console.log("error at try get products -> ", error.response)
        }
    }

    const handleAddItemsToCard = (product) => {
        if (product.available <= 0) {
            alert("Produto sem estoque disponível")
            return;
        }

        const existingItemIndex = itemsCard.findIndex(item => item.product.id === product.id);

        if (existingItemIndex !== -1) {
            if (itemsCard[existingItemIndex].quant >= product.available) {
                alert("Quantidade máxima atingida para este produto")
                return;
            }
            const updatedItemsCard = itemsCard.map((item, index) => {
                if (index === existingItemIndex) {
                    return { ...item, quant: item.quant + 1 };
                }
                return item;
            });
            setItemsCard(updatedItemsCard);
        } else {
            setItemsCard(prevItems => [...prevItems, { product: product, quant: 1 }]);
        }
    };

    const handleCloseCurrentWindow = () => {
        const currentClientWindow = document.querySelector(".mod-consumo-client");
        currentClientWindow.style.display = "none";
        setItemsCard([]);
    }

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isShowingCheckout) {
        return (
            <ModClientConsumoCheckout 
                setIsShowingCheckout={setIsShowingCheckout} 
                itemsCard={itemsCard} 
                setItemsCard={setItemsCard} 
            />
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="w-[800px] bg-gradient-to-br from-[#1c2833] to-[#2c3e50] 
            rounded-xl shadow-2xl border border-white/10 text-white p-6 relative
            max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Loja</h2>
                        <p className="text-gray-400">Cliente: {clientState.nome}</p>
                    </div>
                    <button 
                        onClick={handleCloseCurrentWindow}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                {/* Barra de Pesquisa */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Buscar produtos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#131a29] text-white px-4 py-3 rounded-lg
                        border border-white/10 focus:border-purple-500 transition-colors
                        outline-none pl-12"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Lista de Produtos */}
                <div className="flex-1 overflow-y-auto pr-2 
                scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="grid grid-cols-1 gap-4">
                        {filteredProducts.map((product) => (
                            <div key={product.id}
                                onClick={() => handleAddItemsToCard(product)}
                                className="bg-[#131a29] rounded-lg overflow-hidden flex items-center
                                hover:bg-[#1a2333] transition-colors cursor-pointer group
                                border border-white/5 hover:border-purple-500/20">
                                <img 
                                    src={product.url_img} 
                                    alt={product.name} 
                                    className="w-24 h-24 object-cover group-hover:scale-105 transition-transform" 
                                />
                                <div className="flex-1 p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-lg">{product.name}</h3>
                                        <span className={`text-sm ${
                                            product.available > 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {product.available} disponíveis
                                        </span>
                                    </div>
                                    <span className="text-2xl font-bold text-purple-400">
                                        R$ {product.value.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer com Carrinho */}
                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-gray-400">
                        {filteredProducts.length} produtos encontrados
                    </span>
                    <button
                        onClick={() => setIsShowingCheckout(true)}
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg
                        flex items-center gap-3 transition-colors relative group"
                    >
                        <ShoppingCart />
                        <span>Ver Carrinho</span>
                        {itemsCard.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white
                            w-6 h-6 rounded-full flex items-center justify-center text-sm
                            group-hover:scale-110 transition-transform">
                                {itemsCard.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModClientConsumo;