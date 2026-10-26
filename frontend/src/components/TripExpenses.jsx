import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { createExpense, getTripExpenses, deleteExpense } from '../services/api';

function TripExpenses() {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(location.state?.trip || null);
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState('You');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserName = currentUser.name || currentUser.email || 'You';

  const fetchExpensesData = async () => {
    try {
      const res = await getTripExpenses(tripId);
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError('Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesData();
  }, [tripId]);

  // Dropdown options ke liye yeh ensure karein:
const allMembers = trip ? [currentUserName, ...(trip.members || []).map(m => typeof m === 'string' ? m : m.email || m.name)] : [currentUserName];
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      await createExpense({
        tripId,
        title,
        amount: Number(amount),
        category,
        paidBy: paidBy // Send selected user/member
      });
      setTitle('');
      setAmount('');
      setPaidBy(currentUserName);
      setError('');
      fetchExpensesData();
    } catch (err) {
      console.error("Error adding expense:", err);
      setError('Failed to add expense.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      fetchExpensesData();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError('Failed to delete expense.');
    }
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMembersCount = trip && trip.members ? trip.members.length + 1 : 1;
  const splitAmountPerPerson = totalMembersCount > 0 ? (totalSpent / totalMembersCount).toFixed(2) : totalSpent;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', padding: '6px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        &larr; Back to Trips
      </button>

      <h2 style={{ textAlign: 'center', color: '#333' }}>
        Expenses for {trip ? trip.title : 'Trip'}
      </h2>
      
      <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '15px', background: '#e9ecef', padding: '10px', borderRadius: '6px' }}>
        <span>Budget: <strong>₹{trip?.budget || 0}</strong></span> | 
        <span style={{ marginLeft: '10px', color: totalSpent > (trip?.budget || 0) ? 'red' : 'green', fontWeight: 'bold' }}>
          Total Spent: ₹{totalSpent}
        </span> | 
        <span style={{ marginLeft: '10px', color: '#007bff', fontWeight: 'bold' }}>
          Split ({totalMembersCount} Members): ₹{splitAmountPerPerson} / person
        </span>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '30px' }}>
        <h4 style={{ margin: '0 0 15px 0' }}>Add New Expense</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Expense Title</label>
            <input 
              type="text" 
              placeholder="e.g., Dinner, Taxi" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Amount (₹)</label>
            <input 
              type="number" 
              placeholder="1200" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              required 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Hotel">Hotel</option>
              <option value="Activities">Activities</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Paid By</label>
            <select 
              value={paidBy} 
              onChange={(e) => setPaidBy(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {allMembers.map((member, idx) => (
                <option key={idx} value={member}>{member}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Add Expense & Split
        </button>
      </form>

      {/* Logged Expenses List */}
      <h3>Logged Expenses</h3>
      {loading ? (
        <p>Loading expenses...</p>
      ) : expenses.length === 0 ? (
        <p style={{ color: '#666' }}>No expenses logged for this trip yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {expenses.map((exp) => {
            const itemShare = totalMembersCount > 0 ? (exp.amount / totalMembersCount).toFixed(2) : exp.amount;
            return (
              <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', background: '#fff' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{exp.title}</h4>
                  <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
                    Category: {exp.category} | Paid By: <strong style={{ color: '#333' }}>{exp.paidBy || 'You'}</strong> | Split: ₹{itemShare} / person
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>₹{exp.amount}</span>
                  <button 
                    onClick={() => handleDeleteExpense(exp._id)} 
                    style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TripExpenses;