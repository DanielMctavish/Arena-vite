import { useNavigate } from "react-router-dom"

function Screen02() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-6 justify-center items-center w-full h-[100vh] absolute bg-emerald-400">
            <h2>tela 02</h2>
            <button className="p-2 bg-zinc-400" onClick={() => navigate("/screen01")}>tela 01</button>
        </div>
    )
}

export default Screen02;