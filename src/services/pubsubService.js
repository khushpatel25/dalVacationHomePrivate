import axios from "axios";

const API_URL = import.meta.env.VITE_PUBSUB_API_URL;

// Function to publish a message
export const publishMessage = async (messageData) => {
  try {
    const response = await axios.post(`${API_URL}`, messageData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error publishing message:", error);
    throw error;
  }
};
