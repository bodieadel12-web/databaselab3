import React, { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  
  const [authorName, setAuthorName] = useState('');
  const [authorCountry, setAuthorCountry] = useState('');
  const [authorImage, setAuthorImage] = useState('');
  const [editingAuthorId, setEditingAuthorId] = useState(null);
  const [authorError, setAuthorError] = useState('');
  const [authorSuccess, setAuthorSuccess] = useState('');
  
  const [bookTitle, setBookTitle] = useState('');
  const [bookPrice, setBookPrice] = useState('');
  const [bookAuthorId, setBookAuthorId] = useState('');
  const [bookImage, setBookImage] = useState('');
  const [editingBookId, setEditingBookId] = useState(null);
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState('');

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const fetchData = async () => {
    if (!user || !user.id) return;
    try {
      const resAuthors = await fetch(`http://localhost:5000/authors?user_id=${user.id}`);
      const dataAuthors = await resAuthors.json();
      if (resAuthors.ok) setAuthors(dataAuthors);

      const resBooks = await fetch(`http://localhost:5000/books?user_id=${user.id}`);
      const dataBooks = await resBooks.json();
      if (resBooks.ok) setBooks(dataBooks);
    } catch (err) {
      console.error('Failed to connect to backend');
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const isValidEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const isOnlyNumbers = (str) => {
    return /^\d+$/.test(str.trim());
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'register') {
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setAuthError('All fields are required');
        return;
      }
      if (!isValidEmail(email)) {
        setAuthError('Please enter a valid email address (e.g. name@example.com)');
        return;
      }
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match');
        return;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setAuthError('All fields are required');
        return;
      }
    }

    setIsLoading(true);
    const endpoint = authMode === 'login' ? 'login' : 'register';
    
    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authMode === 'login' ? { email, password } : { name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
      } else {
        if (authMode === 'login') {
          const matchedName = data.name || (email.includes('@') ? email.split('@')[0] : email);
          const userData = { name: matchedName, email, id: data.user_id };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          const loginRes = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const loginData = await loginRes.json();
          if (loginRes.ok) {
            const matchedName = loginData.name || name || (email.includes('@') ? email.split('@')[0] : email);
            const userData = { name: matchedName, email, id: loginData.user_id };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      }
    } catch (err) {
      setAuthError('Server error. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setAuthors([]);
    setBooks([]);
    setAuthorError('');
    setAuthorSuccess('');
    setBookError('');
    setBookSuccess('');
    setAuthorName('');
    setAuthorCountry('');
    setAuthorImage('');
    setBookTitle('');
    setBookPrice('');
    setBookAuthorId('');
    setBookImage('');
    setEditingAuthorId(null);
    setEditingBookId(null);
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    setAuthorError('');
    setAuthorSuccess('');

    if (!authorName.trim()) {
      setAuthorError('Please enter the author name.');
      return;
    }
    if (isOnlyNumbers(authorName)) {
      setAuthorError('Author name cannot consist of numbers only.');
      return;
    }
    if (!authorCountry.trim()) {
      setAuthorError('Please enter the country.');
      return;
    }
    if (isOnlyNumbers(authorCountry)) {
      setAuthorError('Country name cannot consist of numbers only.');
      return;
    }

    try {
      const url = editingAuthorId 
        ? `http://localhost:5000/authors/${editingAuthorId}`
        : 'http://localhost:5000/authors';
      const method = editingAuthorId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: authorName, country: authorCountry, image_url: authorImage, user_id: user.id })
      });
      const data = await response.json();

      if (!response.ok) {
        setAuthorError(data.error || 'Failed to save author.');
      } else {
        setAuthorSuccess(editingAuthorId ? 'Author updated successfully!' : 'Author added successfully!');
        setAuthorName('');
        setAuthorCountry('');
        setAuthorImage('');
        setEditingAuthorId(null);
        fetchData();
      }
    } catch (err) {
      setAuthorError('Server error while saving author.');
    }
  };

  const handleEditAuthor = (author) => {
    setEditingAuthorId(author.author_id);
    setAuthorName(author.name);
    setAuthorCountry(author.country);
    setAuthorImage(author.image_url || '');
    setAuthorError('');
    setAuthorSuccess('');
  };

  const handleDeleteAuthor = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/authors/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) alert(data.error || 'Failed to delete author.');
      else fetchData();
    } catch (err) {
      alert('Server error during author deletion.');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setBookError('');
    setBookSuccess('');

    if (!bookTitle.trim()) {
      setBookError('Please enter the book title.');
      return;
    }
    if (isOnlyNumbers(bookTitle)) {
      setBookError('Book title cannot consist of numbers only.');
      return;
    }
    if (bookPrice === '' || isNaN(bookPrice) || parseFloat(bookPrice) < 0) {
      setBookError('Please enter a valid positive price.');
      return;
    }
    if (!bookAuthorId) {
      setBookError('Please select an author for the book.');
      return;
    }

    try {
      const url = editingBookId 
        ? `http://localhost:5000/books/${editingBookId}`
        : 'http://localhost:5000/books';
      const method = editingBookId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: bookTitle, price: parseFloat(bookPrice) || 0, author_id: bookAuthorId, image_url: bookImage, user_id: user.id })
      });
      const data = await response.json();

      if (!response.ok) {
        setBookError(data.error || 'Failed to save book.');
      } else {
        setBookSuccess(editingBookId ? 'Book updated successfully!' : 'Book added successfully!');
        setBookTitle('');
        setBookPrice('');
        setBookAuthorId('');
        setBookImage('');
        setEditingBookId(null);
        fetchData();
      }
    } catch (err) {
      setBookError('Server error while saving book.');
    }
  };

  const handleEditBook = (book) => {
    setEditingBookId(book.book_id);
    setBookTitle(book.title);
    setBookPrice(book.price);
    setBookAuthorId(String(book.author_id));
    setBookImage(book.image_url || '');
    setBookError('');
    setBookSuccess('');
  };

  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/books/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) alert(data.error || 'Failed to delete book.');
      else fetchData();
    } catch (err) {
      alert('Server error during book deletion.');
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
        <div className={`shadow-2xl rounded-3xl p-8 w-full max-w-md border relative transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-white text-gray-800'}`}>
          
          <div className="flex justify-end mb-2">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707-.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd"></path></svg>
              )}
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
              {authMode === 'login' ? 'Welcome' : 'Create Account'}
            </h2>
            <p className={`mt-2 text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              {authMode === 'login' ? 'Please enter your details to sign in' : 'Please enter your details'}
            </p>
          </div>

          {authError && (
            <div className={`w-full py-3 px-4 mb-4 rounded-full border font-semibold text-sm text-center shadow-sm ${darkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-rose-50 border-rose-100 text-rose-500'}`}>
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} noValidate className="flex flex-col gap-4">
            {authMode === 'register' && (
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                disabled={isLoading}
                className={`w-full px-4 py-3.5 rounded-2xl border outline-none transition-all text-sm ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500' : 'border-gray-100 bg-white text-gray-800 focus:ring-2 focus:ring-indigo-400'}`} 
              />
            )}
            <input 
              type="text" 
              placeholder={authMode === 'login' ? 'Email or Username' : 'Email Address'} 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              disabled={isLoading}
              className={`w-full px-4 py-3.5 rounded-2xl border outline-none transition-all text-sm ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500' : 'border-gray-100 bg-white text-gray-800 focus:ring-2 focus:ring-indigo-400'}`} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              disabled={isLoading}
              className={`w-full px-4 py-3.5 rounded-2xl border outline-none transition-all text-sm ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500' : 'border-gray-100 bg-white text-gray-800 focus:ring-2 focus:ring-indigo-400'}`} 
            />
            {authMode === 'register' && (
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                disabled={isLoading}
                className={`w-full px-4 py-3.5 rounded-2xl border outline-none transition-all text-sm ${darkMode ? 'border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500' : 'border-gray-100 bg-white text-gray-800 focus:ring-2 focus:ring-indigo-400'}`} 
              />
            )}
            <button type="submit" disabled={isLoading} className="mt-4 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all disabled:opacity-70">
              {isLoading ? 'Processing...' : (authMode === 'login' ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-medium">
            {authMode === 'login' ? (
              <p className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Don't have an account? <button onClick={() => {setAuthMode('register'); setAuthError('');}} className={`font-bold hover:underline ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Sign up</button></p>
            ) : (
              <p className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Already have an account? <button onClick={() => {setAuthMode('login'); setAuthError('');}} className={`font-bold hover:underline ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Log in</button></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const displayName = user.name || (user.email.includes('@') ? user.email.split('@')[0] : user.email) || 'User';

  return (
    <div className={`min-h-screen p-8 font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className={`flex justify-between items-center p-6 rounded-3xl shadow-2xl border transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-xl border-white'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
              L
            </div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Library Management System</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className={`font-semibold text-sm pr-1 ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{displayName}</span>
            </div>
            <button onClick={handleLogout} className={`p-2.5 rounded-full transition-all focus:outline-none ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-slate-800' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`} title="Log out">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-full border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-gray-50 border-gray-100 text-slate-700'}`}>
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707-.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1 z" clipRule="evenodd"></path></svg>
              )}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleAddAuthor} className={`p-8 rounded-3xl shadow-2xl border space-y-5 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 border-white'}`}>
            <h2 className="text-xl font-bold">{editingAuthorId ? 'Edit Author' : 'Add New Author'}</h2>
            {authorError && <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs text-center">{authorError}</div>}
            {authorSuccess && <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs text-center">{authorSuccess}</div>}
            <div className="space-y-4">
              <input type="text" placeholder="Author Name" value={authorName} onChange={e => setAuthorName(e.target.value)} className={`w-full px-4 py-3.5 border rounded-2xl text-sm outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
              <input type="text" placeholder="Country" value={authorCountry} onChange={e => setAuthorCountry(e.target.value)} className={`w-full px-4 py-3.5 border rounded-2xl text-sm outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
              <input type="text" placeholder="Author Photo URL" value={authorImage} onChange={e => setAuthorImage(e.target.value)} className={`w-full px-4 py-3.5 border rounded-2xl text-sm outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
            </div>
            <div className="flex gap-3 items-center">
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-2xl text-sm font-bold shadow-lg transition-all">
                {editingAuthorId ? 'Update Author' : 'Add Author'}
              </button>
              {editingAuthorId && (
                <button type="button" onClick={() => { setEditingAuthorId(null); setAuthorName(''); setAuthorCountry(''); setAuthorImage(''); }} className={`px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-500/10 hover:bg-gray-500/30 text-gray-700'}`}>Cancel</button>
              )}
            </div>
          </form>

          <form onSubmit={handleAddBook} className={`p-8 rounded-3xl shadow-2xl border space-y-5 transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 border-white'}`}>
            <h2 className="text-xl font-bold">{editingBookId ? 'Edit Book' : 'Add New Book'}</h2>
            {bookError && <div className="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs text-center">{bookError}</div>}
            {bookSuccess && <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl text-xs text-center">{bookSuccess}</div>}
            <div className="space-y-4">
              <input type="text" placeholder="Book Title" value={bookTitle} onChange={e => setBookTitle(e.target.value)} className={`w-full px-4 py-3.5 border rounded-2xl text-sm outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
              <input 
                type="text" 
                inputMode="decimal" 
                placeholder="Price" 
                value={bookPrice} 
                onChange={e => {
                  const val = e.target.value;
                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    setBookPrice(val);
                  }
                }} 
                onKeyDown={e => {
                  if (['-', 'e', 'E', '+'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={`w-full px-4 py-3.5 border rounded-2xl text-sm outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} 
              />
              <input type="text" placeholder="Book Cover URL" value={bookImage} onChange={e => setBookImage(e.target.value)} className={`w-full px-4 py-3.5 border rounded-2xl text-sm outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
              <div className="space-y-2">
                <label className={`text-xs font-semibold uppercase ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>Select Author</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                  {authors.map(a => {
                    const isSelected = bookAuthorId === String(a.author_id);
                    return (
                      <button type="button" key={a.author_id} onClick={() => setBookAuthorId(isSelected ? '' : String(a.author_id))} className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${isSelected ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                        {a.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-2xl text-sm font-bold shadow-lg transition-all">
                {editingBookId ? 'Update Book' : 'Add Book'}
              </button>
              {editingBookId && (
                <button type="button" onClick={() => { setEditingBookId(null); setBookTitle(''); setBookPrice(''); setBookAuthorId(''); setBookImage(''); }} className={`px-5 py-3.5 rounded-2xl text-sm font-bold transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-gray-500/10 hover:bg-gray-500/30 text-gray-700'}`}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className={`p-8 rounded-3xl shadow-2xl border overflow-x-auto transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 border-white'}`}>
            <h2 className="text-xl font-bold mb-4">Authors Table</h2>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className={`uppercase text-xs border-b ${darkMode ? 'text-slate-400 border-slate-800' : 'text-gray-400 border-gray-100'}`}>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map(author => (
                  <tr key={author.author_id} className={`border-b ${darkMode ? 'border-slate-800/50' : 'border-gray-50'}`}>
                    <td className="py-4 px-4">
                      {author.image_url ? (
                        <img src={author.image_url} alt="" className="w-10 h-10 object-cover rounded-full shadow" />
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className={`py-4 px-4 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>{author.author_id}</td>
                    <td className="py-4 px-4 font-semibold">{author.name}</td>
                    <td className={`py-4 px-4 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>{author.country}</td>
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <button onClick={() => handleEditAuthor(author)} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-xl text-xs font-bold transition-all">Edit</button>
                      <button onClick={() => handleDeleteAuthor(author.author_id)} className="px-3.5 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`p-8 rounded-3xl shadow-2xl border overflow-x-auto transition-colors duration-300 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white/80 border-white'}`}>
            <h2 className="text-xl font-bold mb-4">Books Table</h2>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className={`uppercase text-xs border-b ${darkMode ? 'text-slate-400 border-slate-800' : 'text-gray-400 border-gray-100'}`}>
                  <th className="py-3 px-4">Cover</th>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Author ID</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.book_id} className={`border-b ${darkMode ? 'border-slate-800/50' : 'border-gray-50'}`}>
                    <td className="py-4 px-4">
                      {book.image_url ? (
                        <img src={book.image_url} alt="" className="w-8 h-12 object-cover rounded shadow" />
                      ) : (
                        <span className="text-xs text-gray-400">No Cover</span>
                      )}
                    </td>
                    <td className={`py-4 px-4 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>{book.book_id}</td>
                    <td className="py-4 px-4 font-semibold">{book.title}</td>
                    <td className="py-4 px-4 font-black text-emerald-500">{book.price}</td>
                    <td className={`py-4 px-4 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>{book.author_id}</td>
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <button onClick={() => handleEditBook(book)} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-xl text-xs font-bold transition-all">Edit</button>
                      <button onClick={() => handleDeleteBook(book.book_id)} className="px-3.5 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold transition-all">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}