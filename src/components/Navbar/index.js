import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookie from 'js-cookie'

const Navbar = () => {
    const navigate = useNavigate()
    const handleLogOut = () => {
        Cookie.remove('jwtToken')
        navigate('/login')

    }
    return (
        <div className="flex items-center bg-blue-40 p-4 shadow-md shadow-gray-500 flex justify-between items-cente">
            <Link to='/' >
                <img
                    src="https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/fxeqgbugax4rdgtbggsh"
                    alt="Logo"
                    className="w-20 h-20 rounded-full mr-3"
                />
            </Link>
            <button type='button' onClick={handleLogOut} className='bg-blue-900 border-0 p-2 text-white rounded-sm w-32'>Logout</button>
        </div>

    )
}

export default Navbar