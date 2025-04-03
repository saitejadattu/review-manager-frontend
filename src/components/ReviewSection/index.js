import React, { useEffect, useState } from 'react'
import Cookie from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const ReviewSection = ({ productId }) => {
    const [reviewList, setReviewList] = useState([]);
    const [reviewData, setReviewData] = useState({ commentText: '', rating: '' })
    const [openMenu, setOpenMenu] = useState(null)
    const [editPopup, setEditPopup] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [value, setValue] = useState({})
    const token = Cookie.get('jwtToken')
    const user = jwtDecode(token)

    useEffect(() => {
        const payload = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ productId })
        }
        const dataFecth = async () => {
            const response = await fetch("http://localhost:5000/review/all", payload)
            const data = await response.json()
            setReviewList(data.reviewList)
        }
        dataFecth()
    }, [token, productId, value]);

    console.log(reviewList)

    const handleReviewData = (e) => {
        const { name, value } = e.target
        setReviewData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSaveEdit = async () => {
        const payload = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviewId: selectedReview._id,
                commentText: selectedReview.commentText,
                rating: selectedReview.rating,
                productId: selectedReview.productId
            }),
        };

        try {
            const response = await fetch("http://localhost:5000/review/update", payload);
            const data = await response.json();
            setValue(data)
            setEditPopup(false);
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };


    const handleDelete = async (reviewId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this review?");
        if (!confirmDelete) return;
        try {
            console.log(reviewId)
            const payload = {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ reviewId })
            }
            const deletData = await fetch('http://localhost:5000/review/delete', payload)
            const response = await deletData.json()
            setValue(response)
        } catch (e) {
            console.log(e.message)
        }
    }

    const handleEdit = (review) => {
        setSelectedReview(review);
        setEditPopup(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({ ...reviewData, userId: user.email, productId })
            }
            const sendData = await fetch('http://localhost:5000/review/add', payload)
            const response = await sendData.json()
            setReviewData({ commentText: '', rating: '' })
            setValue(response)
        } catch (e) {
            console.log(e.message)
        }
    }

    const editReview = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl text-center font-semibold">Edit Review</h2>
                    <label className="block text-white-0 font-semibold">Comment</label>
                    <textarea
                        className="w-full border p-2 rounded-md"
                        value={selectedReview.commentText}
                        onChange={(e) => setSelectedReview({ ...selectedReview, commentText: e.target.value })}
                    />
                    <label className="block text-white-0 font-semibold">Rating</label>
                    <select
                        className="w-full border p-2 rounded-md"
                        value={selectedReview.rating}
                        onChange={(e) => setSelectedReview({ ...selectedReview, rating: e.target.value })}
                    >
                        <option value={1}>⭐</option>
                        <option value={2}>⭐⭐</option>
                        <option value={3}>⭐⭐⭐</option>
                        <option value={4}>⭐⭐⭐⭐</option>
                        <option value={5}>⭐⭐⭐⭐⭐</option>
                    </select>
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setEditPopup(false)} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
                        <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 text-white rounded-md">Save</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='max-w-4xl p-4 mx-auto bg-purple-200 shadow-lg rounded-sm mt-4'>
            <form onSubmit={handleSubmit}>
                <h1 className='font-serif text-center font-semibold'>Review Section</h1>
                <div>
                    <label className="block text-white-0 font-semibold">Enter your review</label>
                    <textarea name='commentText' onChange={handleReviewData} required className="w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={reviewData.commentText} placeholder="Enter text here..."></textarea>
                </div>
                <div>
                    <label className="block text-white-0 font-semibold">Rating</label>
                    <select name='rating' value={reviewData.rating} required onChange={handleReviewData} className='w-full px-4 py-2 mt-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400"'>
                        <option selected className="text-gray-400 font-semibold">Please provide a rating</option>
                        <option value={1}>⭐</option>
                        <option value={2}>⭐⭐</option>
                        <option value={3}>⭐⭐⭐</option>
                        <option value={4}>⭐⭐⭐⭐</option>
                        <option value={5}>⭐⭐⭐⭐⭐</option>
                    </select>
                </div>
                <button type='submit' className='w-full mt-6 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-700 transition'>Add Review</button>
            </form>
            <div>
                {reviewList.length === 0 ? (
                    <p className="text-gray-500 text-center">No reviews yet.</p>
                ) : (
                    <ul className="space-y-4 mt-2">
                        {reviewList?.map((review) => (
                            <li key={review._id} className="p-4 bg-white border rounded-md shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="text-gray-800"><strong>{review.userId}</strong></p>
                                    <p className="text-gray-600">{review.commentText}</p>
                                    <p className="text-yellow-500"> {'⭐'.repeat(review.rating)}</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(review.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    {review.userId === user.email && (
                                        <div className="relative">
                                            <button
                                                className="text-gray-500 hover:bg-gray-200 px-2 py-1 rounded-md"
                                                onMouseEnter={() => setOpenMenu(review._id)}
                                                onMouseLeave={() => setTimeout(() => setOpenMenu(null), 2000)}
                                            >
                                                ⋮
                                            </button>

                                            {openMenu === review._id && (
                                                <div
                                                    className="absolute right-0 mt-1 w-24 bg-white border shadow-md rounded-md"
                                                    onMouseEnter={() => setOpenMenu(review._id)}
                                                    onMouseLeave={() => setOpenMenu(null)}
                                                >
                                                    <button
                                                        className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                                        onClick={() => handleEdit(review)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        onClick={() => handleDelete(review._id)}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                        {editPopup && editReview()}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default ReviewSection