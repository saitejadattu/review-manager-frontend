import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState({})
    const [showError, setShowError] = useState('')
    const navigate = useNavigate()

    const handleRoute = () => {
        navigate('/login')
    }

    const validateInputForm = (name, value) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^.{8,}$/;
        let errorMsg;
        if (name === 'username') {
            if (!value) {
                errorMsg = 'Username is required'
            }
        }
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


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
        validateInputForm(name, value)
        setErrorMessage((prevState) => ({
            ...prevState,
            [name]: validateInputForm(name, value)
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let validationErrors = {};
            Object.keys(formData).forEach((field) => {
                const error = validateInputForm(field, formData[field]);
                if (error) validationErrors[field] = error

            });
            setErrorMessage(validationErrors)
            if (Object.keys(validationErrors).length === 0) {
                const payload = {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
                const dataFecth = await fetch('https://review-manager-backend-1.onrender.com/user/register', payload)
                if (dataFecth.status === 200) {
                    await dataFecth.json()
                    setFormData({ email: '', password: '', name: '' })
                    setErrorMessage({})
                    navigate('/login')
                }
                else if (dataFecth.status === 409) {
                    const response = await dataFecth.json()
                    setShowError(response.message)
                    setFormData({ email: '', password: '', name: '' })
                    setTimeout(() => {
                        navigate('/login')
                    }, 2000)
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-md shadow-lg">
                <div className="flex justify-center items-center">
                    <img src='https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/fxeqgbugax4rdgtbggsh' className="w-40 h-30 rounded-full border-1" alt='register' />
                </div>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div>
                        <label className="block text-gray-600">Username</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your username"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        {errorMessage.username ? <p className="block text-red-600 mt-2">*{errorMessage.username}</p> : null}
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your Email"
                            value={formData.email}
                            onChange={handleChange}
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
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        {errorMessage.password ? <p className="block text-red-600 mt-2">*{errorMessage.password}</p> : null}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white mt-5 p-2 rounded hover:bg-blue-600"
                    >
                        Register
                    </button>
                    {showError ? <p className="block text-red-800 mt-2 text-center">*{showError}</p> : null}
                </form>
                <p className="mt-4 text-sm text-gray-600 text-center">
                    You have an account?{" "}
                    <button type="button" onClick={handleRoute} className="text-blue-600 hover:underline">
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
