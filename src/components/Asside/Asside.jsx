import React from "react";
import { useNavigate } from "react-router-dom"
import { Computer, People, AssignmentInd, ShareLocation, CurrencyExchange, Gamepad } from '@mui/icons-material'
import boxIcon from "../../medias/icons/box-icon.png"

function Asside() {

    const navigate = useNavigate()

    return (
        <aside
            className='
      absolute
      p-9 
      text-[14px] 
      sm:flex
      flex-col
      hidden 
      justify-start 
      items-center 
      overflow-y-auto
      w-[24%]  
      h-[96vh] 
      bg-gradient-to-b 
      from-[#3E4759] 
      to-[#1D2433] 
      left-[2vh] 
      rounded-[10px] 
      border-[1px] 
      border-[#535E74]'>

            <div className="w-full p-1">
                <h2 className=' text-white text-[16px] text-left'>PAINEL DE CONTROLE</h2>
            </div>
            <hr className='w-full mt-6 bg-[#4F5B75] border-[#4F5B75]' />

            <section className='
                w-[100%]
                h-auto p-6
                flex
                justify-center 
                items-center
                text-white'>

                <section className='h-auto gap-6 flex flex-wrap justify-between items-center text-white'>

                    <div onClick={() => navigate("/adm-machines")} className='relative w-[100px] h-[100px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                        <Computer style={{ fontSize: '40pt', color: 'white' }} />
                        <span>Máquinas</span>
                    </div>

                    <div onClick={() => navigate("/adm-sessions")} className='relative w-[100px] h-[100px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                        <Gamepad style={{ fontSize: '40pt', color: 'white' }} />
                        <span>Sessões</span>
                    </div>

                    <div onClick={() => navigate("/adm-clientes")} className='relative w-[100px] h-[100px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                        <People style={{ fontSize: '40pt', color: 'white' }} />
                        <span>Clientes</span>
                    </div>

                    <div className='relative w-[100px] h-[100px] bg-[#303030] hover:bg-[#515151] 
                    rounded-[10px] border-[1px] border-[#646464] flex flex-col justify-center items-center cursor-pointer'>
                        <AssignmentInd style={{ fontSize: '40pt', color: 'white' }} />
                        <span>Colaborador</span>
                    </div>

                    <div onClick={() => navigate("/adm-locais")} className='relative w-[100px] h-[100px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                        <ShareLocation style={{ fontSize: '40pt', color: 'white' }} />
                        <span>Locais</span>
                    </div>

                    <div onClick={() => navigate("/financial")} className='relative w-[100px] h-[100px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                        <CurrencyExchange style={{ fontSize: '40pt', color: 'white' }} />
                        <span>Financeiro</span>
                    </div>

                    <div onClick={() => navigate("/adm-produtos")} className='relative w-[100px] h-[100px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                        <img src={boxIcon} alt="icone caixa aberta" className='w-[60px]' />
                        <span>Produtos</span>
                    </div>
                </section>


            </section>
        </aside>
    )
}

export default Asside;