import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookie from 'js-cookie'

const Login = () => {
    const [loginDetails, setLoginData] = useState({ email: '', password: '' })
    const [errorMessage, setErrorMessage] = useState({})
    const [showError, setShowError] = useState('')
    const navigate = useNavigate()
    const jwtToken = Cookie.get('jwtToken')

    const handleRoute = () => {
        navigate('/register')
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let validationErrors = {};
            Object.keys(loginDetails).forEach((field) => {
                const error = validateInputForm(field, loginDetails[field]);
                if (error) validationErrors[field] = error

            });
            setErrorMessage(validationErrors)
            if (Object.keys(validationErrors).length === 0) {
                const payload = {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(loginDetails)
                }
                const dataFecth = await fetch('https://review-manager-backend.onrender.com/user/login', payload)
                if (dataFecth.status === 200) {
                    const response = await dataFecth.json()
                    Cookie.set('jwtToken', response.token, { expires: 1 })
                    setLoginData({ email: '', password: '' })
                    setErrorMessage({})
                    navigate('/')
                }
                else if (dataFecth.status === 400) {
                    const response = await dataFecth.json()
                    setShowError(response.message)
                    setLoginData({ email: '', password: '' })
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    };

    const validateInputForm = (name, value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^.{8,}$/;
        let errorMsg;
        if (name === 'email') {
            if (!value) {
                errorMsg = 'Email is required'
            }
            else if (!emailRegex.test(value)) {
                errorMsg = 'Please provide valid email'
            }
        }
        if (name === 'password') {
            if (!value) {
                errorMsg = 'Password is required'
            }
            else if (!passwordRegex.test(value)) {
                errorMsg = 'Passwords must have 8 chars'
            }
        }
        return errorMsg
    }

    const handleLoginData = (e) => {
        const { name, value } = e.target
        setLoginData((prevState) => ({
            ...prevState,
            [name]: value
        }))
        validateInputForm(name, value)
        setErrorMessage((prevState) => ({
            ...prevState,
            [name]: validateInputForm(name, value)
        }))
    }
    if (jwtToken) {
        return <Navigate to='/' />
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-md shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div>
                        <label className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={loginDetails.email}
                            onChange={handleLoginData}
                            className="w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        {errorMessage.email ? <p className="block text-red-600 mt-2">*{errorMessage.email}</p> : null}
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={loginDetails.password}
                            onChange={handleLoginData}
                            className="w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        {errorMessage.password ? <p className="block text-red-600 mt-2">*{errorMessage.password}</p> : null}
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-6 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                    {showError ? <p className="block text-red-600 mt-2">*{showError}</p> : null}
                </form>
                <p className="mt-4 text-sm text-gray-600 text-center">
                    Don't have an account?{" "}
                    <button type="button" onClick={handleRoute} className="text-blue-600 hover:underline">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;
