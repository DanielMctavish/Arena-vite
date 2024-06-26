import axios from "axios";
import { Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ShoppingCart } from "@mui/icons-material"
import ModClientConsumoCheckout from "./ModClientConsumoCheckout";


function ModClientConsumo() {
    const [products, setProducts] = useState({})
    const [itemsCard, setItemsCard] = useState([])
    const [isShowingCheckout, setIsShowingCheckout] = useState(false)

    useEffect(() => {
        getAllProducts()
    }, [])

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
                console.log("resposta, produtos -> ", response.data)
                setProducts(response.data)
            })

        } catch (error) {
            console.log("error at try get products -> ", error.response)
        }
    }

    const handleAddItemsToCard = (product) => {
        const existingItemIndex = itemsCard.findIndex(item => item.product.id === product.id);

        if (existingItemIndex !== -1) {
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
    }

    if (isShowingCheckout) {
        return (
            <ModClientConsumoCheckout setIsShowingCheckout={setIsShowingCheckout} itemsCard={itemsCard} setItemsCard={setItemsCard} />
        )

    }

    return (
        <div className="w-[60%] h-[88%] flex flex-col p-1
        bg-gradient-to-t from-[#3C4557] to-[#192234]  text-white rounded-md 
        justify-center items-center gap-1 relative
        shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-100 cursor-pointer">
                <Close />
            </span>

            <section className="flex justify-center items-center w-[99%] h-[15%] rounded-md gap-1 overflow-y-auto bg-[#131a29]">
                <span>Cliente Consumo</span>
            </section>

            <section className="flex flex-col justify-start items-center w-[99%] h-[70%] rounded-md gap-1 overflow-y-auto">
                {
                    Array.isArray(products) &&
                    products.map((product, index) => (
                        <div key={index}
                            onClick={() => handleAddItemsToCard(product)}
                            className="flex justify-between items-center p-2 bg-[#192234] 
                        hover:bg-[#202b42] w-full rounded-md cursor-pointer">
                            <img src={product.url_img} alt="produto" className="w-[100px] h-[100px] object-cover rounded-md" />
                            <span>{product.name}</span>
                            <span className="font-bold">R$ {(product.value).toFixed(2)}</span>
                        </div>
                    ))
                }
            </section>

            <section className="flex justify-center items-center 
            w-[99%] h-[15%] rounded-md gap-1 overflow-y-auto bg-[#192234] p-2">
                <span>Cliente Consumo</span>

                <span onClick={() => setIsShowingCheckout(!isShowingCheckout)} className="flex justify-start items-center relative cursor-pointer">
                    <ShoppingCart sx={{ fontSize: "30px" }} />
                    <span className="absolute bg-white text-[#1d9518] shadow-md shadow-[#171313]
                    text-[14px] w-[14px] h-[14px] flex justify-center font-bold
                    items-center rounded-full bottom-0 right-0 p-2">
                        {itemsCard.length}
                    </span>
                </span>

            </section>

        </div>
    )
}

export default ModClientConsumo;