import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const RoomCard = ({ room }) => {
    return (
        <div className="overflow-hidden shadow-lg bg-white rounded-xl">
            <div className="p-4">
                <div className='flex justify-between'>
                    <h2 className="font-bold text-xl text-gray-900 mb-2">{room.roomNumber}</h2>
                    <h2 className="font-bold text-xl text-gray-900 mb-2">{room.roomType}</h2>
                </div>
                <p className="text-gray-700 text-base">Tariff: ${room.tariff}</p>
                <p className="text-gray-700 text-base">Capacity: {room.capacity} persons</p>
                <p className="text-gray-700 text-base">Amenities: {room.amenities.join(', ')}</p>
                <Link
                    to={`/rooms/${room.roomId}`}
                    className="text-blue-500 hover:text-blue-800 mt-2 inline-block"
                >
                    <Button>
                        View Details
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default RoomCard;
