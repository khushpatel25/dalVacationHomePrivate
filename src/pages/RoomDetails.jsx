import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import userStore from '@/lib/store/userStore';
import Loader from '@/components/Loader';
import UpdateRoomModal from '@/components/modals/UpdateRoomModal';
import CreateReservationModal from '@/components/modals/CreateReservationModal';
import axiosInstance from '@/lib/axiosInstance';
import { Button } from '@/components/ui/button';

const RoomDetails = () => {

    const { roomId } = useParams();
    const [room, setRoom] = useState();
    const [feedback, setFeedback] = useState([]);
    const [resId, setResId] = useState([]);

    const { userRole, userId } = userStore();

    const fetchReservations = async () => {
        try {
            const res = await axiosInstance.get(import.meta.env.VITE_FETCH_RESERVATION_BY_ROOM_ID_URL + `?roomId=${roomId}`);
            const parsedBody = JSON.parse(res.data.body);

            const filterReservations = parsedBody.reservations.filter((res => {
                return res.userId === userId
            }))

            const moreFilter = filterReservations.map(res => {
                return [res.reservationId]
            })

            setResId(moreFilter);

        } catch (error) {
            if (error.message !== "Reservation not found") {
                console.error("Error while fetching reservations", error)
                toast.error(error.message);
            }
        }
    }

    const fetchRoomDetails = async () => {
        try {
            const response = await axiosInstance.get(import.meta.env.VITE_FETCH_ROOM_DETAILS_URL + `?roomId=${roomId}`);
            setRoom(JSON.parse(response.data.body));
        } catch (error) {
            console.error("Error while fetching roomDetails: ", error);
            toast.error(error.message)
        }
    };

    useEffect(() => {
        fetchRoomDetails();
    }, [roomId, userId]);

    useEffect(() => {
        fetchReservations();
    }, [])

    if (!room) return <Loader />;

    return (
        <div className="p-4">
            {userRole === "regular" && (
                <>
                    {resId?.length > 0 && (
                        resId?.map((res) => (
                            <div key={res} className="mt-4 p-4 bg-green-100 text-green-700 mb-3">
                                You've successfully reserved this room. Your reservation ID is: {res}
                            </div>
                        ))
                    )}
                </>
            )}

            <div className='flex justify-end'>
                {userRole === "regular" && (
                    <CreateReservationModal roomId={roomId} setReservationId={setResId} reservation={resId} />
                )}
                {userRole === "admin0" && (
                    <UpdateRoomModal room={room} onRoomUpdated={() => fetchRoomDetails()} />
                )}
            </div>
            <div className="flex justify-center">
                    <span className=" bg-white text-3xl font-bold text-center shadow-lg rounded-lg overflow-hidden mb-6 px-10 py-2">{room.roomNumber}</span>  
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                    <p className="text-2xl font-bold mb-4">Description:</p>
                    <p className="text-gray-600">{room.description}</p>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Details:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <span className="text-gray-700">Tariff:</span>
                        <span className="ml-2 font-bold">${room.tariff}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-700">Capacity:</span>
                        <span className="ml-2 font-bold">{room.capacity} persons</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-700">Amenities:</span>
                        <div className="ml-2 text-gray-800">
                            {room.amenities.map((amenity, index) => (
                                <span className='font-bold' key={index}>{amenity}, </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-700">RoomType:</span>
                        <span className="ml-2 font-bold">{room.roomType}</span>
                    </div>
                </div>
            </div>
            {(resId.length > 0) && (
                <div className='flex justify-end mb-4'>
                    <Button variant='destructive'>Add Feedback</Button>
                </div>
            )}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Feedback</h2>
                {feedback.length > 0 ? (
                    feedback.map((item, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                            <p className="text-gray-700 mb-2">{item.feedbackText}</p>
                            <p className="text-gray-500 text-sm">Polarity: {item.sentiment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700">No feedback available.</p>
                )}
            </div>
        </div>
    );
};

export default RoomDetails