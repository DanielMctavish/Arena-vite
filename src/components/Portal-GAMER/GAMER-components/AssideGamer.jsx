import { MonetizationOn, Logout, ShoppingCart, Dashboard, Person, Menu, Close } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AssideGamer() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogoutClient = () => {
        localStorage.removeItem("arena-client-login");
        navigate("/");
    }

    const menuItems = [
        { icon: Dashboard, text: "Dashboard", path: "/gamer-dashboard" },
        { icon: MonetizationOn, text: "Comprar Crédito", path: "/gamer-financeiro" },
        { icon: ShoppingCart, text: "Loja", path: "/shop" },
        { icon: Person, text: "Perfil", path: "/profile" },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const MenuItem = ({ item, isMobile }) => (
        <div 
            onClick={() => {
                navigate(item.path);
                if (isMobile) setIsMenuOpen(false);
            }}
            className={`relative w-full py-4 px-2 flex items-center cursor-pointer transition-all duration-300 ease-in-out
                ${location.pathname === item.path ? 'bg-purple-700 text-white' : 'bg-white/10 text-white hover:bg-purple-600'}`}
        >
            <item.icon style={{ fontSize: '24pt', marginRight: '10px' }} />
            <span className="text-lg">{item.text}</span>
        </div>
    );

    return (
        <>
            {/* Mobile menu button */}
            <button 
                onClick={toggleMenu}
                className="sm:hidden fixed top-0 left-0 z-50 bg-[#282828] text-white p-3 rounded-[2px]"
            >
                {isMenuOpen ? <Close /> : <Menu />}
            </button>

            {/* Mobile menu */}
            <div className={`sm:hidden fixed inset-y-0 left-0 w-64 bg-black z-40 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full pt-16">
                    {menuItems.map((item, index) => (
                        <MenuItem key={index} item={item} isMobile={true} />
                    ))}
                    <div 
                        onClick={handleLogoutClient}
                        className='w-full py-4 px-2 mt-auto bg-red-600 hover:bg-red-700 
                            flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out'
                    >
                        <Logout style={{ fontSize: '24pt', marginRight: '10px', color: 'white' }} />
                        <span className="text-lg text-white">Sair</span>
                    </div>
                </div>
            </div>

            {/* Desktop menu */}
            <aside className='relative p-3 hidden sm:flex flex-col justify-start items-center w-[30%] h-full bg-black/50 
            rounded-[10px] border-[1px] border-purple-500 gap-4'>
                {menuItems.map((item, index) => (
                    <MenuItem key={index} item={item} isMobile={false} />
                ))}

                <div 
                    onClick={handleLogoutClient} 
                    className='relative w-full py-4 px-2 mt-auto bg-red-600 hover:bg-red-700 
                        flex items-center cursor-pointer transition-all duration-300 ease-in-out'
                >
                    <Logout style={{ fontSize: '24pt', marginRight: '10px', color: 'white' }} />
                    <span className="text-lg text-white">Sair</span>
                </div>
            </aside>
        </>
    );
}

export default AssideGamer;