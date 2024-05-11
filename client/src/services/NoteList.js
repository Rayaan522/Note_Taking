import React, { useState, useEffect } from 'react';

const NoteList = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Fetch saved notes associated with the user
    fetchNotes();
  }, []); // Run this effect only once, when the component mounts

  const fetchNotes = async () => {
  
    console.log(userId,"userId")
    try {
      const response = await fetch('http://localhost:3000/notelist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes); // Assuming the response contains an array of notes
      } else {
        console.error('Error fetching notes');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <h2>Note List</h2>
      <ul>
        {notes.map(note => (
          <li key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
