import React from 'react'

interface FloatingProps {
  icon: React.ReactNode;
  text1: string;
  text2: string;
}

const Floating = ({ icon, text1, text2 }: FloatingProps) => {
  return (
    <div className="flex items-center bg-white gap-3 w-full">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{text1}</p>
        <p className="text-xs text-gray-600 truncate">{text2}</p>
      </div>
    </div>
  )
}

export default Floating
