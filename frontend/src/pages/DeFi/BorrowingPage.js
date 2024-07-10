// frontend/src/components/BorrowingPage.js
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';

const BorrowingPage = () => {
  const { user, token } = useAuth();
  const { data, error, isLoading, fetchData } = useApi('/borrowings', token);

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
    }
  }, [user]);

  const [borrowingForm, setBorrowingForm] = useState({
    bookId: '',
    borrowDate: '',
    returnDate: '',
  });

  const handleBorrowBook = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData('/borrowings', 'POST', borrowingForm);
      console.log('Book borrowed successfully:', response);
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturnBook = async (borrowingId) => {
    try {
      const response = await fetchData(`/borrowings/${borrowingId}`, 'PATCH', { returned: true });
      console.log('Book returned successfully:', response);
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <div>
      <h1>Borrowing Page</h1>
      <form onSubmit={handleBorrowBook}>
        <label>
          Book ID:
          <input type="text" name="bookId" value={borrowingForm.bookId} onChange={(event) => setBorrowingForm({ ...borrowingForm, bookId: event.target.value })} />
        </label>
        <br />
        <label>
          Borrow Date:
          <input type="date" name="borrowDate" value={borrowingForm.borrowDate} onChange={(event) => setBorrowingForm({ ...borrowingForm, borrowDate: event.target.value })} />
        </label>
        <br />
        <label>
          Return Date:
          <input type="date" name="returnDate" value={borrowingForm.returnDate} onChange={(event) => setBorrowingForm({ ...borrowingForm, returnDate: event.target.value })} />
        </label>
        <br />
        <button type="submit">Borrow Book</button>
      </form>
      <h2>Current Borrowings</h2>
      <ul>
        {data && data.map((borrowing) => (
          <li key={borrowing.id}>
            Book ID: {borrowing.bookId}
            Borrow Date: {borrowing.borrowDate}
            Return Date: {borrowing.returnDate}
            <button onClick={() => handleReturnBook(borrowing.id)}>Return Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BorrowingPage;