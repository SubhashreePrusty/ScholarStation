import React, { useState, useEffect } from 'react';
import { FaTrash, FaFilter } from 'react-icons/fa';

const DeleteNote = () => {
    const [notes, setNotes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [branches, setBranches] = useState([]);
    const [filter, setFilter] = useState({ category: 'All', branch: 'All' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNotes();
        fetchCategories();
        fetchBranches();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await fetch('http://localhost:5000/notes');
            if (!response.ok) throw new Error("Failed to fetch notes.");
            const data = await response.json();
            setNotes(data);
        } catch (err) {
            setError("Failed to fetch notes.");
            console.error(err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/categories');
            if (!response.ok) throw new Error("Failed to fetch categories.");
            const data = await response.json();
            // Add a check to ensure categories are fetched correctly
            if (Array.isArray(data) && data.length > 0) {
                setCategories(['All', ...data]);
            } else {
                setCategories(['All']); // Default value if data is empty
            }
        } catch (err) {
            // Handle the error gracefully
            setCategories(['All']); // Fallback to default value
            setError("");
            console.error(err);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await fetch('http://localhost:5000/branches');
            if (!response.ok) throw new Error("");
            const data = await response.json();
            setBranches(['All', ...data]);
        } catch (err) {
            setBranches(['All']); // Fallback to default value
            console.error("Failed to fetch branches:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!id) return;
        try {
            const response = await fetch(`http://localhost:5000/notes/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error("Error deleting note.");
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            setError("Error deleting note.");
            console.error(err);
        }
    };

    const filteredNotes = notes.filter(note =>
        (filter.category === 'All' || note.category === filter.category) &&
        (filter.branch === 'All' || note.branch === filter.branch)
    );

    return (
        <div className="bg-gray-900 min-h-screen text-black flex flex-col items-center p-4">
            <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg text-black">
                <div className="flex items-center mb-4">
                    <FaFilter className="text-lg mr-2 text-white" />
                    <h2 className="text-2xl font-bold text-white">Delete Notes</h2>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex gap-4 mb-4">
                    <select name="category" value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} className="p-2 rounded-lg bg-gray-700 border border-gray-600">
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select name="branch" value={filter.branch} onChange={(e) => setFilter({ ...filter, branch: e.target.value })} className="p-2 rounded-lg bg-gray-700 border border-gray-600">
                        {branches.map((branch) => (
                            <option key={branch} value={branch}>{branch}</option>
                        ))}
                    </select>
                </div>
                {filteredNotes.map(note => (
                    <div key={note.id} className="flex text-white justify-between items-center w-full p-4 bg-gray-700 border border-gray-600 rounded-lg mb-2">
                        <div>
                            <h3 className="text-lg font-semibold">{note.subject}</h3>
                            <p className="text-gray-400">{note.author}</p>
                        </div>
                        <button onClick={() => handleDelete(note.id)} className="text-red-500 hover:text-red-700">
                            <FaTrash /> Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeleteNote;
