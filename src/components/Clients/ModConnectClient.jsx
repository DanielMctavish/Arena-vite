import { Close } from "@mui/icons-material";


function ModConnectClient() {
    
    const handleCloseCurrentWindow = () => {
        const currentClientWindow = document.querySelector(".mod-connect-client");
        currentClientWindow.style.display = "none";
    }

    return (
        <div className="w-[60%] h-[88%] flex flex-col
            bg-gradient-to-t from-[#3C4557] to-[#192234]  text-white rounded-md 
            justify-center items-center gap-6 relative
            shadow-lg shadow-[#0f0f0f4d] overflow-y-auto">

            <span onClick={handleCloseCurrentWindow} className="absolute top-1 right-1 text-zinc-100 cursor-pointer">
                <Close />
            </span>

            <span>Client Connect</span>

        </div>
    )
}

export default ModConnectClient;