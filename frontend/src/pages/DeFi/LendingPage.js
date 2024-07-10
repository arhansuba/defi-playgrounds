// frontend/src/components/LendingPage.js
import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useApi from '../hooks/useApi';

const LendingPage = () => {
  const { user, token } = useAuth();
  const { data, error, isLoading, fetchData } = useApi('/lendings', token);

  useEffect(() => {
    if (!user) {
      // Redirect to login page if user is not logged in
      window.location.href = '/login';
    }
  }, [user]);

  const [lendingForm, setLendingForm] = useState({
    bookId: '',
    lendDate: '',
    returnDate: '',
    borrowerId: '',
  });

  const handleLendBook = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchData('/lendings', 'POST', lendingForm);
      console.log('Book lent successfully:', response);
    } catch (error) {
      console.error('Error lending book:', error);
    }
  };

  const handleReturnBook = async (lendingId) => {
    try {
      const response = await fetchData(`/lendings/${lendingId}`, 'PATCH', { returned: true });
      console.log('Book returned successfully:', response);
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <div>
      <h1>Lending Page</h1>
      <form onSubmit={handleLendBook}>
        <label>
          Book ID:
          <input type="text" name="bookId" value={lendingForm.bookId} onChange={(event) => setLendingForm({ ...lendingForm, bookId: event.target.value })} />
        </label>
        <br />
        <label>
          Lend Date:
          <input type="date" name="lendDate" value={lendingForm.lendDate} onChange={(event) => setLendingForm({ ...lendingForm, lendDate: event.target.value })} />
        </label>
        <br />
        <label>
          Return Date:
          <input type="date" name="returnDate" value={lendingForm.returnDate} onChange={(event) => setLendingForm({ ...lendingForm, returnDate: event.target.value })} />
        </label>
        <br />
        <label>
          Borrower ID:
          <input type="text" name="borrowerId" value={lendingForm.borrowerId} onChange={(event) => setLendingForm({ ...lendingForm, borrowerId: event.target.value })} />
        </label>
        <br />
        <button type="submit">Lend Book</button>
      </form>
      <h2>Current Lendings</h2>
      <ul>
        {data && data.map((lending) => (
          <li key={lending.id}>
            Book ID: {lending.bookId}
            Lend Date: {lending.lendDate}
            Return Date: {lending.returnDate}
            Borrower ID: {lending.borrowerId}
            <button onClick={() => handleReturnBook(lending.id)}>Return Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LendingPage;