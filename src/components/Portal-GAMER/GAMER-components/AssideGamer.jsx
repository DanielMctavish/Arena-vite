import { MonetizationOn, Logout, ShoppingCart } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";

function AssideGamer() {

    const navigate = useNavigate()

    const handleLogoutClient = () => {
        localStorage.removeItem("arena-client-login");
        navigate("/");
    }

    return (
        <aside className='relative p-3 sm:flex hidden flex-col justify-start items-center w-[30%] h-full bg-gradient-to-b 
            from-[#3E4759] to-[#1D2433] rounded-[10px] border-[1px] border-[#535E74] gap-2'>

            <div onClick={() => navigate("/adm-sessions")} className='relative w-[90%] h-[130px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                <MonetizationOn style={{ fontSize: '70pt', color: 'white' }} />
                <span className="text-white">comprar crédito</span>
            </div>

            <div onClick={() => navigate("/adm-sessions")} className='relative w-[90%] h-[130px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                <ShoppingCart style={{ fontSize: '70pt', color: 'white' }} />
                <span className="text-white">comprar produto</span>
            </div>

            <div onClick={handleLogoutClient} className='relative w-[90%] h-[130px] bg-[#202736] hover:bg-[#b94444] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                <Logout style={{ fontSize: '70pt', color: 'white' }} />
                <span className="text-white">sair</span>
            </div>

        </aside>
    )
}

export default AssideGamer