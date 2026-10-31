import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Lost & Found Items</h1>
      
      {loading ? (
        <div className="text-center">Loading items...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <span className={`px-2 py-1 rounded text-sm ${
                    item.type === 'LOST' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div>📍 {item.location}</div>
                  <div>📅 {new Date(item.createdAt).toLocaleDateString()}</div>
                  <div>👤 Posted by {item.user?.fullName}</div>
                  <div className={`inline-block px-2 py-1 rounded text-xs ${
                    item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;