import React, { useState, useEffect } from 'react';

export default function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('my-todo-tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [regData, setRegData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    localStorage.setItem('my-todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!regData.name || !regData.email || !regData.password || !regData.confirmPassword) {
      setErrorMsg('All fields are required');
      return;
    }
    if (regData.password !== regData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regData.name,
          email: regData.email,
          password: regData.password
        })
      });
      
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error); 
      } else {
        setUser({ name: regData.name, email: regData.email });
        setView('todos');
        setRegData({ name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      setErrorMsg('Server error. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginData.email || !loginData.password) {
      setErrorMsg('Email and Password are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error); 
      } else {
        setUser({ name: data.name, email: loginData.email, id: data.user_id });
        setView('todos');
        setLoginData({ email: '', password: '' });
      }
    } catch (err) {
      setErrorMsg('Server error. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  const toggleCompletion = (taskId) => {
    setTasks(tasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;
    setTasks([{ id: Date.now(), text: newTaskText, completed: false, dueDate: newTaskDueDate }, ...tasks]);
    setNewTaskText('');
    setNewTaskDueDate('');
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const productivity = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const openTasksCount = tasks.filter((task) => !task.completed).length;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'open') return !task.completed;
    if (filter === 'done') return task.completed;
    return true;
  });

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (view === 'register') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
        <div className={`shadow-2xl rounded-3xl p-8 w-full max-w-md border transition-colors duration-300 ${darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/80 backdrop-blur-xl border-white text-gray-800'}`}>
          <div className="flex justify-end mb-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:opacity-80 transition-all">
              {darkMode ? (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
              )}
            </button>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Create Account</h2>
            <p className={`mt-2 text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Join us to manage your tasks efficiently</p>
          </div>
          {errorMsg && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 dark:bg-red-950/40 py-2 px-4 rounded-xl border border-red-100 dark:border-red-900">{errorMsg}</p>}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="relative">
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <input type="text" placeholder="Full Name" className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500' : 'bg-white border-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-400'}`} value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} disabled={isLoading} />
            </div>
            <div className="relative">
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <input type="email" placeholder="Email Address" className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500' : 'bg-white border-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-400'}`} value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} disabled={isLoading} />
            </div>
            <div className="relative">
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <input type="password" placeholder="Password" className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500' : 'bg-white border-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-400'}`} value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} disabled={isLoading} />
            </div>
            <div className="relative">
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              <input type="password" placeholder="Confirm Password" className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500' : 'bg-white border-gray-100 text-gray-800 focus:ring-2 focus:ring-indigo-400'}`} value={regData.confirmPassword} onChange={e => setRegData({...regData, confirmPassword: e.target.value})} disabled={isLoading} />
            </div>
            <button type="submit" disabled={isLoading} className="mt-4 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>
          <p className={`mt-8 text-center text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Already have an account? <button onClick={() => {setView('login'); setErrorMsg('');}} className="text-indigo-500 font-bold hover:underline transition-colors">Log in</button>
          </p>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'}`}>
        <div className={`shadow-2xl rounded-3xl p-8 w-full max-w-md border relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/80 backdrop-blur-xl border-white text-gray-800'}`}>
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          <div className="flex justify-end mb-2">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:opacity-80 transition-all">
              {darkMode ? (
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
              )}
            </button>
          </div>

          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transform rotate-3 ${darkMode ? 'bg-slate-800' : 'bg-indigo-50'}`}>
              <svg className="w-8 h-8 text-indigo-500 transform -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h2 className="text-3xl font-extrabold">Welcome</h2>
            <p className={`mt-2 text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Please enter your details to sign in</p>
          </div>

          {errorMsg && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 dark:bg-red-950/40 py-2 px-4 rounded-xl border border-red-100 dark:border-red-900">{errorMsg}</p>}
          
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="relative group">
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <input type="email" placeholder="Email Address" className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition-all font-medium ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500' : 'bg-white border-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-400'}`} value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} disabled={isLoading} />
            </div>
            
            <div className="relative group">
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              <input type="password" placeholder="Password" className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none transition-all font-medium ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500' : 'bg-white border-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-400'}`} value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} disabled={isLoading} />
            </div>

            <button type="submit" disabled={isLoading} className="mt-2 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          
          <p className={`mt-8 text-center text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Don't have an account? <button onClick={() => {setView('register'); setErrorMsg('');}} className="text-indigo-500 font-bold hover:underline transition-colors">Sign up</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 font-sans relative transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      <div className={`shadow-2xl rounded-3xl p-8 w-full max-w-2xl border flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/80 backdrop-blur-xl border-white text-gray-800'}`}>
        
        <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 tracking-tight mb-1">
              My Tasks
            </h1>
            <p className={`text-sm font-medium flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {today}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-full border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-gray-50 border-gray-100 text-slate-700'}`}>
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
              )}
            </button>
            {user && (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`font-semibold text-sm pr-1 ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{user.name}</span>
                </div>
                <button onClick={handleLogout} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all focus:outline-none" title="Log out">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <input 
              type="text" 
              value={newTaskText} 
              onChange={(e) => setNewTaskText(e.target.value)} 
              placeholder="What needs to be done?" 
              className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl outline-none transition-all text-base shadow-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500' : 'bg-gray-50/50 border-gray-200 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-400'}`} 
            />
          </div>
          <input 
            type="date" 
            value={newTaskDueDate} 
            onChange={(e) => setNewTaskDueDate(e.target.value)} 
            className={`px-3 py-3.5 border rounded-2xl outline-none text-sm transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500' : 'bg-gray-50/50 border-gray-200 text-gray-600 focus:bg-white focus:ring-2 focus:ring-indigo-400'}`}
          />
          <button type="submit" className="px-6 py-3.5 bg-indigo-500 text-white rounded-2xl hover:bg-indigo-600 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center font-bold">
            Add
          </button>
        </form>

        <div className="relative mb-5">
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search tasks..." 
            className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${darkMode ? 'bg-slate-800/60 border-slate-700/80 text-white placeholder-slate-500 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 focus:border-indigo-400'}`}
          />
        </div>

        {tasks.length > 0 && (
          <div className="flex items-center justify-between mb-4 px-2">
            <span className={`text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              {openTasksCount} open {openTasksCount === 1 ? 'task' : 'tasks'}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setFilter('all')} 
                type="button"
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-indigo-500 text-white shadow-md' : darkMode ? 'text-slate-400 bg-slate-800 hover:bg-slate-700' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}>
                All
              </button>
              <button 
                onClick={() => setFilter('open')} 
                type="button"
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${filter === 'open' ? 'bg-indigo-500 text-white shadow-md' : darkMode ? 'text-slate-400 bg-slate-800 hover:bg-slate-700' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}>
                Open
              </button>
              <button 
                onClick={() => setFilter('done')} 
                type="button"
                className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${filter === 'done' ? 'bg-indigo-500 text-white shadow-md' : darkMode ? 'text-slate-400 bg-slate-800 hover:bg-slate-700' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}>
                Done
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 max-h-[45vh] overflow-y-auto pr-2 mb-6 custom-scrollbar">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${task.completed ? (darkMode ? 'bg-slate-800/40 border-transparent opacity-50' : 'bg-gray-50/50 border-transparent opacity-60') : (darkMode ? 'bg-slate-800/80 border-slate-700 shadow-sm' : 'bg-white border-gray-100 shadow-sm hover:shadow-md')}`}>
              <label className="flex items-center gap-4 cursor-pointer flex-1">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={task.completed} onChange={() => toggleCompletion(task.id)} className={`peer appearance-none w-6 h-6 border-2 rounded-full checked:bg-indigo-500 checked:border-indigo-500 cursor-pointer transition-colors ${darkMode ? 'border-slate-600' : 'border-gray-300'}`} />
                  <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div className="flex flex-col">
                  <span className={`text-lg font-medium transition-all ${task.completed ? 'line-through text-gray-400' : darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{task.text}</span>
                  {task.dueDate && (
                    <span className={`text-xs font-semibold flex items-center gap-1 mt-0.5 ${task.completed ? 'text-gray-400' : darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Due: {task.dueDate}
                    </span>
                  )}
                </div>
              </label>
              <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100" title="Delete task">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-slate-800' : 'bg-indigo-50'}`}>
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              </div>
              <p className={`font-bold text-xl mb-1 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>No tasks yet</p>
              <p className={`font-medium ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Add a task above to get started</p>
            </div>
          )}

          {tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="text-center py-8">
              <p className={`font-medium text-base ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>No tasks found matching your search.</p>
            </div>
          )}
          
          {tasks.length > 0 && tasks.every((task) => task.completed) && (
            <div className={`text-center py-5 rounded-2xl border mt-2 ${darkMode ? 'bg-green-950/30 border-green-900/50' : 'bg-green-50 border-green-100'}`}>
              <p className="text-green-500 font-bold text-lg flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                All caught up! Great job!
              </p>
            </div>
          )}
        </div>

        {tasks.length > 0 && (
          <button onClick={() => setShowSummary(true)} className="mt-auto w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:opacity-90 hover:shadow-xl transition-all active:scale-[0.98] tracking-wide">
            FINISH DAY & VIEW REPORT
          </button>
        )}
      </div>

      {showSummary && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all scale-100 flex flex-col items-center text-center ${darkMode ? 'bg-slate-900 text-slate-100 border border-slate-800' : 'bg-white text-gray-800'}`}>
            <h2 className="text-3xl font-bold mb-2">Daily Summary</h2>
            <p className={`mb-8 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Here is your productivity report</p>
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className={darkMode ? 'text-slate-800' : 'text-gray-100'} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                <path className={`${productivity === 100 ? 'text-green-500' : 'text-indigo-500'}`} strokeDasharray={`${productivity}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold">{productivity}%</span>
              </div>
            </div>
            <p className={`text-lg font-medium mb-8 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              You completed <span className="font-bold text-indigo-500">{completedTasks}</span> out of <span className="font-bold">{totalTasks}</span> tasks.
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowSummary(false)} className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-colors ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Close</button>
              <button onClick={() => {setTasks([]); setShowSummary(false);}} className="flex-1 py-3 px-4 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors shadow-md">Start New Day</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}