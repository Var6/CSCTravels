import { Shield } from 'lucide-react'
import React from 'react'

const Floating = ({icon,text1,text2}:any) => {

  return (
    <div>
    <div className="flex items-center bg-white gap-3 z-5">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
         {icon}
        </div>
        <div>
            <p className="font-bold text-gray-900">{text1}</p>
            <p className="text-xs text-gray-600">{text2}</p>
        </div>
        </div>
    </div>
  )
}

export default Floating
