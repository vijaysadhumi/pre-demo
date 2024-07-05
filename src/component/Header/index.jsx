import React from 'react';

const Header = () => {
  return (
    <header className="bg-black text-white p-4 flex items-center justify-between w-screen">
        <div className='flex items-center'>
      <img style={{filter: 'invert(1) brightness(100)'}} src="https://www.pngkey.com/png/full/864-8644116_toro-png-toro-logo-png.png" alt="Logo" className="h-8 w-8 mr-3" />
      <h1 className="text-2xl font-bold">Incident Genie</h1>
      </div>
      <div className='text-right'>
      <h2 className="font-semibold text-lg tracking-tight">Taurus Dynamo</h2>
            <p className="text-sm text-[#6b7280] leading-3"> Powered by Navatech Group</p>
      </div>

    </header>
  );
};

export default Header;
