

    import React from 'react'

    function Qwe() {
    return (
        <div className=' w-[100%] h-[100px] bg-stone-500 flex flex-col items-center justify-center gap-2'>
            <p className=' text-white'>Made by @Alistair jan</p>
            <p className='text-white text-[10px]'>Contact me</p>
            <div className='flex gap-4'>

                {/* facebook */}
                <a href="https://www.facebook.com/riatsila.loverternis"
                    className='inline-block text-white hover:text-blue-800'
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fab fa-facebook text-2xl"></i>
                </a>
                {/* instagram */}
                <a 
                    href="https://www.instagram.com/alistair_jn/" 
                    className='inline-block text-white hover:text-pink-800' 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >
                    <i className="fab fa-instagram text-2xl"></i>
                </a>
            </div>
        </div>
    )
    }

    export default Qwe