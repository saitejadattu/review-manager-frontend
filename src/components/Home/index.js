import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const ProductCards = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    useEffect(() => {
        fetch("https://fakestoreapi.com/products")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data)
                setLoading(false);
            })
            .catch((error) => console.error("Error fetching products:", error));
    }, []);
    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>
    };

    return (
        <div>
            <Navbar />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {products?.map((product) => (
                    <div
                        key={product.id}
                        className="bg-purple-50 shadow-lg rounded-sm p-4 flex flex-col items-center hover:shadow-xl transition duration-300"
                        onClick={() => navigate(`/product/${product.id}`)}
                    >
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-40 h-40 object-contain mb-3"
                        />
                        <h2 className="text-lg font-semibold truncate w-40">{product.title}</h2>
                        <p className="text-gray-600 mt-1">${product.price}</p>
                        <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition">
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default ProductCards;