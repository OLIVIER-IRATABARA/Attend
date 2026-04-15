import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ContHost() {
    const [firstclass, setfirstclass] = useState("");
    const [secondclass, setsecondclass] = useState("");
    const [thirdclass, setthirdclass] = useState("");
    
    const location = useLocation();
    const navigate = useNavigate();
    // Get the ID we passed from the Host component
    const eventId = location.state?.eventId; 

    const handleCosts = () => {
        if (!eventId) {
            alert("No event ID found. Please create an event first.");
            return;
        }

        const costData = {
            eventId, // Link to the event
            firstclass: Number(firstclass),
            secondclass: Number(secondclass),
            thirdclass: Number(thirdclass)
        };

        // Note the endpoint: /events/createcont
        axios.post("http://localhost:1010/events/createcont", costData)
            .then(res => {
                alert("Pricing saved successfully!");
                navigate("/home"); // Redirect to home/explore
            })
            .catch(err => {
                console.error("Costs not saved", err);
                alert("Error saving prices");
            });
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen'>
            <div className='text-center p-10 space-y-5 bg-blue-100 w-full max-w-3xl rounded-2xl'>
                <div className='text-3xl font-bold'>Set Ticket Prices</div>
                <p className='text-sm text-gray-600'>Linking to Event ID: {eventId}</p>
                
                <input type="number" placeholder='Cost of 1st class'
                    value={firstclass} onChange={(e) => setfirstclass(e.target.value)}
                    className='border border-blue-500 rounded p-2 w-full' />
                
                <input type="number" placeholder='Cost of 2nd class'
                    value={secondclass} onChange={(e) => setsecondclass(e.target.value)}
                    className='border border-blue-500 rounded p-2 w-full' />
                
                <input type="number" placeholder='Cost of 3rd class'
                    value={thirdclass} onChange={(e) => setthirdclass(e.target.value)}
                    className='border border-blue-500 rounded p-2 w-full' />
                
                <button className='bg-blue-600 text-white h-10 w-full rounded hover:bg-blue-700' 
                    onClick={handleCosts}>
                    Save Prices & Finish
                </button>
            </div>
        </div>
    );
}
