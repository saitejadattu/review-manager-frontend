import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewSection from "../ReviewSection";
import Cookie from 'js-cookie'
import Navbar from "../Navbar";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const jwtToken = Cookie.get('jwtToken')

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading...</div>;
    }

    if (!product) {
        return <div className="text-center mt-10 text-xl">Product not found.</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 bg-purple-50 shadow-lg rounded-lg mt-4">
                <img src={product.image} alt={product.title} className="w-64 h-64 object-contain mx-auto" />
                <h1 className="text-2xl font-bold mt-4 text-center">{product.title}</h1>
                <p className="text-gray-600 text-center mt-2">${product.price}</p>
                <p className="mt-4 text-gray-700 text-center">{product.description}</p>
            </div>
            <ReviewSection productId={id} token={jwtToken} />
        </div>
    );
};

export default ProductDetail;