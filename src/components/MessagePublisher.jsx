// src/components/MessagePublisher.jsx
import React, { useState } from 'react';
import { publishMessage } from '../services/pubsubService';

const MessagePublisher = () => {
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [error, setError] = useState('');

    // Function to handle message publishing
    const handlePublish = async (e) => {
        e.preventDefault();

        // Create message data object
        const messageData = {
            message: {
                booking_reference: "ABC123",
                customer_concern: message,
                customer_email: "customer1@example.com",
                customer_id: "CUST001"
            }
        };

        try {
            const response = await publishMessage(messageData);
            setResponseMessage('Message published successfully!');
            console.log('Response:', response);
        } catch (error) {
            setError('Failed to publish message.');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Publish Message</h1>
            <form onSubmit={handlePublish}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your concern"
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default MessagePublisher;
