import React from 'react';
import Image from 'next/image';

const SuccessRegister = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24">
          <Image src="/undraw_certification_re_ifll.svg" alt="Success" width={100} height={100} />
        </div>
        <p className="text-xl font-bold text-gray-800">Success message!</p>
      </div>
    </div>
  );
};

export default SuccessRegister;
