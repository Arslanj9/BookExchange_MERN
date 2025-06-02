// import { useState, useEffect } from 'react';

// function BookList() {
//   const [books, setBooks] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await fetch('/api/books');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setBooks(data);
//       } catch (error) {
//         setError(error.message);
//       }
//     };

//     fetchBooks();
//   }, []);

//   if (error) return <div>Error: {error}</div>;
//   if (!books.length) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>Books</h2>
//       <ul>
//         {books.map(book => (
//           <li key={book._id}>{book.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default BookList;