import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import boxIcon from "../../medias/icons/box-icon.png";
import { useDropzone } from "react-dropzone";
import { Close } from "@mui/icons-material";

function AddNewProduct({reload}) {
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState();
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const refSpanMessage = useRef()

    const handleSetName = (e) => {
        setProductName(e.target.value);
    };

    const handleSetQuantity = (e) => {
        setQuantity(e.target.value);
    };


    const handleSetPrice = (e) => {
        setPrice(e.target.value);
    };

    // DROPZONE CONFIG................................................................................

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 1) {
            refSpanMessage.current.innerHTML = "só é possível importar apenas uma imagem..."
            return null
        }

        setFiles(acceptedFiles)
    }, []);

    const dropzone = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg'],
            'image/jpg': ['.jpg'],
            'image/gif': ['.gif'],
        }
    });



    useEffect(() => {
        console.log('observando files -> ', files);
    }, [files]);

    const handleCloseCurrentWindow = () => {
        const currentProductWindow = document.querySelector(".mod-add-product");
        currentProductWindow.style.display = "none";
    };

    const { getRootProps, getInputProps, isDragActive } = dropzone;

    // CREATE PRODUCT.......................................................................

    const handleCreateProduct = async () => {
        setIsLoading(true)

        const getAdmSession = await JSON.parse(localStorage.getItem("arena-adm-login"))
        const config = {
            headers: {
                'Authorization': `Bearer ${getAdmSession.token}`
            }
        };

        const formData = new FormData()
        formData.append('product-arena-cover', files[0])

        try {
            // FIREBASE.....
            let currentUrlProductImage;
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/product/upload-product-cover-img`, formData)
                .then(response => {
                    console.log('response firebase ->', response.data);
                    currentUrlProductImage = response.data.currentImage
                })
            // ...............................................................................................................
            const currentAdministrator =
                await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${getAdmSession.email}`, config)

            await axios.post(`${import.meta.env.VITE_APP_API_URL}/product/create-product`, {
                owner_id: currentAdministrator.data.id,
                name: productName,
                value: parseFloat(price),
                available: parseInt(quantity),
                url_img: currentUrlProductImage
            }, config).then(response => {
                console.log('produto cadastrado com sucesso -> ', response.data);
                setIsLoading(false)
                setFiles([])
                setProductName()
                setQuantity()
                setPrice()
                reload()
            })

        } catch (error) {
            console.log('error ao tentar criar produto -> ', error.message);
            setIsLoading(false)
        }

    }

    if (isLoading) {
        return (
            <div className="w-[60%] h-[500px] bg-[#18212f] backdrop-blur-lg rounded-lg 
            flex flex-col justify-center items-center gap-4 relative 
            shadow-xl shadow-black/20 border border-purple-500/20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
                <span className="text-white text-lg">Criando novo produto...</span>
            </div>
        )
    }

    return (
        <div className="w-[80%] h-[500px] bg-[#18212f] backdrop-blur-lg rounded-lg 
        flex flex-col justify-center items-center gap-4 relative 
        shadow-xl shadow-black/20 border border-purple-500/20">
            {/* Botão Fechar */}
            <button 
                onClick={handleCloseCurrentWindow} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white 
                transition-colors p-2 hover:bg-white/5 rounded-full"
            >
                <Close />
            </button>

            {/* Título */}
            <h2 className="text-2xl font-bold text-white mb-4">Novo Produto</h2>

            <section className="flex w-full h-[82%] justify-center items-center gap-8 px-8">
                {/* Formulário */}
                <div className="flex h-[90%] flex-col gap-6 w-[40%]">
                    <div className="flex justify-center">
                        <img src={boxIcon} alt="icone caixa aberta" className="w-16 h-16 object-contain opacity-70" />
                    </div>
                    
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={productName}
                            onChange={handleSetName}
                            className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg 
                            border border-purple-500/20 focus:border-purple-500 
                            focus:outline-none transition-colors placeholder:text-gray-500"
                            placeholder="Nome do produto"
                        />
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleSetQuantity}
                            className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg 
                            border border-purple-500/20 focus:border-purple-500 
                            focus:outline-none transition-colors placeholder:text-gray-500"
                            placeholder="Quantidade"
                        />
                        <input
                            type="text"
                            value={price}
                            onChange={handleSetPrice}
                            className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg 
                            border border-purple-500/20 focus:border-purple-500 
                            focus:outline-none transition-colors placeholder:text-gray-500"
                            placeholder="R$ 0.00"
                        />
                    </div>
                </div>

                {/* Área de Upload */}
                <div className="w-[60%] h-[90%]">
                    <div
                        {...getRootProps({ className: "dropzone" })}
                        className="w-full h-full border-2 border-purple-500/20 border-dashed 
                        rounded-lg flex flex-col justify-center items-center relative 
                        bg-gray-800/30 group cursor-pointer hover:border-purple-500/40 
                        transition-colors"
                    >
                        <input {...getInputProps()} type="file" className="hidden" />
                        
                        {files[0] ? (
                            <div className="relative w-full h-full">
                                <img 
                                    src={URL.createObjectURL(files[0])} 
                                    alt={files[0].name} 
                                    className="absolute inset-0 w-full h-full object-cover rounded-lg" 
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                                transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm">Clique para trocar a imagem</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <span ref={refSpanMessage} className="text-gray-400">
                                    {isDragActive ? 
                                        'Solte a foto do produto aqui!' : 
                                        'Clique ou arraste uma imagem do computador'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Botão Cadastrar */}
            <button 
                onClick={handleCreateProduct}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold 
                py-3 px-8 rounded-lg transition-colors mb-6 
                shadow-lg shadow-purple-500/20"
            >
                Cadastrar Produto
            </button>
        </div>
    );
}

export default AddNewProduct;
