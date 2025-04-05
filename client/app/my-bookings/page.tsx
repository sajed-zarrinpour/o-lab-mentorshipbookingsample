"use client";
import { useEffect, useState } from 'react';

interface Mentor {
  id: number;
  name: string;
  expertise: string;
}

interface Booking {
  mentorId: number;
}

const MyBookingsPage = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [combinedData, setCombinedData] = useState<{ rowNumber: number; mentorName: string; expertise: string }[]>([]);

  useEffect(() => {
    const fetchMentors = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/mentors');
      const data = await response.json();
      setMentors(data);
    };

    const fetchBookings = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/bookings');
      const data = await response.json();
      setBookings(data);
    };

    fetchMentors();
    fetchBookings();
  }, []);

  useEffect(() => {
    // Combine bookings with mentor details
    const combined = bookings.map((booking, index) => {
      const mentor = mentors.find((m) => m.id === booking.mentorId);
      return {
        rowNumber: index + 1, // Row number starts from 1
        mentorName: mentor ? mentor.name : 'Unknown Mentor',
        expertise: mentor ? mentor.expertise : 'Unknown Expertise',
      };
    });
    setCombinedData(combined);
  }, [bookings, mentors]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Mentor Name</th>
              <th className="py-3 px-4 text-left">Expertise</th>
            </tr>
          </thead>
          <tbody>
            {combinedData.map((data) => (
              <tr key={data.rowNumber} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{data.rowNumber}</td>
                <td className="py-3 px-4">{data.mentorName}</td>
                <td className="py-3 px-4">{data.expertise}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookingsPage;
