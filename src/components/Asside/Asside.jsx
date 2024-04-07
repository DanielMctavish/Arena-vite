import React from "react";
import { useNavigate } from "react-router-dom"
import { Computer, People, AssignmentInd, ShareLocation, CurrencyExchange } from '@mui/icons-material'
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
                h-auto
                gap-6
                p-3 
                flex
                flex-wrap
                justify-center 
                items-center
                text-white '>

                <div onClick={() => navigate("/adm-sessions")} className='relative w-[130px] h-[130px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                    <Computer style={{ fontSize: '70pt', color: 'white' }} />
                    <span>Sessões</span>
                </div>

                <div onClick={() => navigate("/adm-clientes")} className='relative w-[130px] h-[130px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                    <People style={{ fontSize: '70pt', color: 'white' }} />
                    <span>Clientes</span>
                </div>

                <div onClick={() => navigate("/adm-colaboradores")} className='relative w-[130px] h-[130px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                    <AssignmentInd style={{ fontSize: '70pt', color: 'white' }} />
                    <span>Add Colaborador</span>
                </div>



                <div onClick={() => navigate("/adm-locais")} className='relative w-[130px] h-[130px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                    <ShareLocation style={{ fontSize: '70pt', color: 'white' }} />
                    <span>Locais</span>
                </div>



                <div onClick={() => navigate("/adm-caixa")} className='relative w-[130px] h-[130px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                    <CurrencyExchange style={{ fontSize: '70pt', color: 'white' }} />
                    <span>Caixa</span>
                </div>



                <div onClick={() => navigate("/adm-produtos")} className='relative w-[130px] h-[130px] bg-[#202736] hover:bg-[#6478a0] 
                    rounded-[10px] border-[1px] border-[#7586A8] flex flex-col justify-center items-center cursor-pointer'>
                    <img src={boxIcon} alt="icone caixa aberta" className='' />
                    <span>Produtos</span>
                </div>


            </section>
        </aside>
    )
}

export default Asside;