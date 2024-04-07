import { useNavigate } from "react-router-dom"

function Screen01() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-6 w-full justify-center items-center h-[100vh] absolute bg-emerald-400">
            <h1>tela 01</h1>
            <button className="p-2 bg-zinc-400" onClick={() => navigate("/screen02")}>tela 02</button>
        </div>
    )
}

export default Screen01;