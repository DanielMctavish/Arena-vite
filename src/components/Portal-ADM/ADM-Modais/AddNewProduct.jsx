import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import boxIcon from "../../../medias/icons/box-icon.png";
import { useDropzone } from "react-dropzone";
import { Close } from "@mui/icons-material";

function AddNewProduct() {
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState();
    const [files, setFiles] = useState([]);

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
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/upload-product-cover-img`, formData)
                .then(response => {
                    console.log('response firebase ->', response.data);
                    currentUrlProductImage = response.data.currentImage
                })
            // ...............................................................................................................
            const currentAdministrator =
                await axios.get(`${import.meta.env.VITE_APP_API_URL}/adm/admin-info-email?email=${getAdmSession.email}`, config)

            await axios.post(`${import.meta.env.VITE_APP_API_URL}/adm/create-product`, {
                owner_id: currentAdministrator.data.id,
                name: productName,
                value: parseFloat(price),
                availabe: parseInt(quantity),
                url_img: currentUrlProductImage
            }, config).then(response => {
                console.log('produto cadastrado com sucesso -> ', response.data);
            })
            
        } catch (error) {
            console.log('error ao tentar criar produto -> ', error.message);

        }

    }

    return (
        <div className="w-[60%] h-[400px] flex flex-col
        bg-[#3C4557] text-white rounded-md 
        justify-center items-center gap-3 relative
        shadow-lg shadow-[#0f0f0f4d]">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-100 cursor-pointer">
                <Close />
            </span>

            <section className="flex w-[100%] h-[82%] justify-center items-center gap-3">
                <div className="flex h-[90%] flex-col gap-3 justify-between items-center">
                    <img src={boxIcon} alt="icone caixa aberta" className="w-[70px] h-[70px] rounded-[4px] object-cover" />
                    <input
                        type="text"
                        value={productName}
                        onChange={handleSetName}
                        className="bg-transparent border-white border-[1px] p-2 placeholder:text-white"
                        placeholder="Nome do produto"
                    />
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleSetQuantity}
                        className="bg-transparent border-white border-[1px] p-2 placeholder:text-white"
                        placeholder="Quantidade"
                    />
                    <input
                        type="text"
                        value={price}
                        onChange={handleSetPrice}
                        className="bg-transparent border-white border-[1px] p-2 placeholder:text-white"
                        placeholder="R$ 0.00"
                    />
                </div>
                {/* DRAG AND DROP AREA */}
                <div
                    {...getRootProps({ className: "dropzone" })}
                    className="flex w-[60%] h-[90%] border-[2px] border-white 
                border-dashed justify-center items-center 
                rounded-md relative overflow-hidden">
                    {
                        isDragActive ?
                            <span ref={refSpanMessage}>solte a foto do produto aqui!</span> :
                            <span ref={refSpanMessage}>clique ou arraste do computador</span>
                    }
                    <input {...getInputProps()} type="file" className="hidden" />
                    {
                        files[0] ?
                            (<img src={URL.createObjectURL(files[0])} alt={files[0].name} className="absolute flex h-[100%] object-cover z-[99]" />) : ""
                    }
                </div>
            </section>

            <button onClick={handleCreateProduct}>cadastrar produto</button>

        </div>
    );
}

export default AddNewProduct;
