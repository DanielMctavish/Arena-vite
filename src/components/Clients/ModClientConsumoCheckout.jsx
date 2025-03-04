/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { ArrowBack, Close, Add, Remove } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ModClientConsumoCheckout({ setIsShowingCheckout, itemsCard, setItemsCard }) {
    const [currentClient, setCurrentClient] = useState({});
    const [method, setMethod] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const clientState = useSelector(state => state.client);
    const navigate = useNavigate();

    useEffect(() => { 
        setCurrentClient(clientState); 
    }, [clientState]);

    const removeItem = (product) => {
        const updatedItemsCard = itemsCard.map(item => {
            if (item.product.id === product.id) {
                return { ...item, quant: item.quant - 1 };
            }
            return item;
        }).filter(item => item.quant > 0);
        setItemsCard(updatedItemsCard);
    };

    const addItem = (product, available) => {
        const updatedItemsCard = itemsCard.map(item => {
            if (item.product.id === product.id) {
                if (item.quant >= available) {
                    alert("Quantidade máxima atingida para este produto");
                    return item;
                }
                return { ...item, quant: item.quant + 1 };
            }
            return item;
        });
        setItemsCard(updatedItemsCard);
    };

    const calculateTotal = () => {
        return itemsCard.reduce((total, item) => total + (item.product.value * item.quant), 0);
    };

    const handleConfirm = async () => {
        if (!method) {
            alert("Selecione um método de pagamento");
            return;
        }

        if (itemsCard.length === 0) {
            alert("Adicione produtos ao carrinho");
            return;
        }

        setIsProcessing(true);
        const localSession = JSON.parse(localStorage.getItem('arena-adm-login'));

        try {
            for (const item of itemsCard) {
                await axios.post(`${import.meta.env.VITE_APP_API_URL}/product/buy-product`, {
                    product_id: item.product.id,
                    client_id: currentClient.client_id,
                    quantity: item.quant,
                    value: item.product.value * item.quant,
                    method: method
                }, {
                    headers: {
                        'Authorization': `Bearer ${localSession.token}`
                    }
                });
            }

            clearCart();
            setIsShowingCheckout(false);
            navigate("/adm-clientes");
        } catch (error) {
            console.error("Erro ao processar compra:", error);
            alert("Erro ao processar compra. Tente novamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    const clearCart = () => {
        setItemsCard([]);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="w-[800px] bg-gradient-to-br from-[#1c2833] to-[#2c3e50] 
            rounded-xl shadow-2xl border border-white/10 text-white p-6 relative
            max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsShowingCheckout(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowBack />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold">Carrinho</h2>
                            <p className="text-gray-400">Cliente: {currentClient.nome}</p>
                        </div>
                    </div>
                </div>

                {/* Lista de Produtos */}
                <div className="flex-1 overflow-y-auto pr-2 
                scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="space-y-4">
                        {itemsCard.map((item, index) => (
                            <div key={index} 
                                className="bg-[#131a29] rounded-lg overflow-hidden flex items-center
                                border border-white/5 group">
                                <img 
                                    src={item.product.url_img} 
                                    alt={item.product.name} 
                                    className="w-24 h-24 object-cover" 
                                />
                                <div className="flex-1 p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-lg">{item.product.name}</h3>
                                        <span className="text-sm text-gray-400">
                                            R$ {item.product.value.toFixed(2)} cada
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => removeItem(item.product)}
                                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <Remove />
                                            </button>
                                            <span className="w-8 text-center">{item.quant}</span>
                                            <button 
                                                onClick={() => addItem(item.product, item.product.available)}
                                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <Add />
                                            </button>
                                        </div>

                                        <span className="text-xl font-bold text-purple-400 w-24 text-right">
                                            R$ {(item.product.value * item.quant).toFixed(2)}
                                        </span>

                                        <button 
                                            onClick={() => removeItem(item.product)}
                                            className="p-1 hover:bg-red-500/10 rounded-full transition-colors
                                            text-red-400 hover:text-red-300"
                                        >
                                            <Close />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer com Total e Ações */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                        <select 
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="bg-[#131a29] text-white px-4 py-2 rounded-lg
                            border border-white/10 focus:border-purple-500 transition-colors
                            outline-none w-48"
                        >
                            <option value="">Método de Pagamento</option>
                            <option value="CREDITO">Cartão de Crédito</option>
                            <option value="PIX">PIX</option>
                            <option value="DINHEIRO">Dinheiro</option>
                        </select>

                        <div className="text-right">
                            <p className="text-gray-400">Total</p>
                            <p className="text-2xl font-bold text-white">
                                R$ {calculateTotal().toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={clearCart}
                            className="flex-1 px-6 py-3 rounded-lg bg-red-500/10 text-red-400
                            hover:bg-red-500/20 transition-colors"
                            disabled={isProcessing}
                        >
                            Limpar Carrinho
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing || !method || itemsCard.length === 0}
                            className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white
                            hover:bg-green-700 transition-colors disabled:opacity-50
                            disabled:cursor-not-allowed"
                        >
                            {isProcessing ? "Processando..." : "Finalizar Compra"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModClientConsumoCheckout;
