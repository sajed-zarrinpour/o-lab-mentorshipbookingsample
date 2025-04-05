"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Mentor {
  id: number;
  name: string;
  expertise: string;
}

interface Booking {
  mentorId: number;
}

const MentorsPage = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [bookingStatus, setBookingStatus] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchMentors = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/mentors');
      const data = await response.json();
      setMentors(data);
    };

    const fetchBookings = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/bookings');
      const data = await response.json();
      const initialStatus: { [key: number]: string } = {};
      data.forEach((booking: Booking) => {
        initialStatus[booking.mentorId] = 'Booked';
      });
      setBookingStatus(initialStatus);
    };

    fetchMentors();
    fetchBookings();
  }, []);

  const handleBook = async (mentorId: number) => {
    const response = await fetch('http://127.0.0.1:8000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mentorId }),
    });

    if (response.ok) {
      setBookingStatus((prev) => ({ ...prev, [mentorId]: 'Booked' }));
    } else {
      setBookingStatus((prev) => ({ ...prev, [mentorId]: 'Failed' }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-4 text-left">
        <button
          onClick={() => router.push('/my-bookings')} // Navigate to /my-bookings
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          My Bookings
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center">Mentors</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Expertise</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor) => (
              <tr key={mentor.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-4">{mentor.name}</td>
                <td className="py-3 px-4">{mentor.expertise}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleBook(mentor.id)}
                    className={`py-1 px-3 rounded transition duration-200 ${
                      bookingStatus[mentor.id] === 'Booked'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : bookingStatus[mentor.id] === 'Failed'
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {bookingStatus[mentor.id] === 'Booked'
                      ? 'Booked!'
                      : bookingStatus[mentor.id] === 'Failed'
                      ? 'Failed'
                      : 'Book'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorsPage;
