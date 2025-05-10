import React, { useState, useEffect } from "react";
import myFood from '../assets/food.jpg'; // adjust path as needed

// Define SafeUser type
interface SafeUser {
  id?: string;
  username: string;
  email?: string;
}

export default function BlogPage() {
  // State for modals
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // State for form values
  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [signupValues, setSignupValues] = useState({ username: '', email: '', password: '' });
  
  // State for auth status - properly typed
  const [user, setUser] = useState<SafeUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');

  // Handle login form input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginValues(prev => ({ ...prev, [name]: value }));
  };

  // Handle signup form input changes
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupValues(prev => ({ ...prev, [name]: value }));
  };

  // Function to open signup modal
  const handleSignupClick = () => {
    setIsSignupOpen(true);
    setAuthError('');
  };

  // Function to close signup modal
  const closeSignupModal = () => {
    setIsSignupOpen(false);
    setAuthError('');
  };

  // Function to open login modal
  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setAuthError('');
  };

  // Function to close login modal
  const closeLoginModal = () => {
    setIsLoginOpen(false);
    setAuthError('');
  };

  // Function to handle login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      // Mock successful login for development/testing
      const mockUser: SafeUser = {
        id: `user-${Date.now()}`,
        username: loginValues.email.split('@')[0],
        email: loginValues.email
      };
      
      const mockToken = "mock-token-" + Date.now();
      setToken(mockToken);
      setUser(mockUser);
      
      // Store in localStorage for persistence
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Close modal
      closeLoginModal();
      
      console.log('Login successful:', mockUser);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setAuthError(errorMsg);
      console.error('Login error:', error);
    }
  };

  // Function to handle signup submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      // Mock successful signup for development/testing
      const mockUser: SafeUser = {
        id: `user-${Date.now()}`,
        username: signupValues.username,
        email: signupValues.email
      };
      
      const mockToken = "mock-token-" + Date.now();
      setToken(mockToken);
      setUser(mockUser);
      
      // Store in localStorage for persistence
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Close modal
      closeSignupModal();
      
      console.log('Registration and login successful:', mockUser);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setAuthError(errorMsg);
      console.error('Registration error:', error);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('Logged out successfully');
  };

  // Effect to check for existing auth on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object' && 'id' in parsedUser) {
          setUser(parsedUser);
        } else {
          throw new Error('Invalid user data in localStorage');
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <div className="bg-white text-black">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 border-b">
        <div className="text-xl font-semibold">⚡ Untitled UI</div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Products</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Pricing</a>
          <a href="#" className="hover:underline">About us</a>
        </nav>
        <div className="flex space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.username}</span>
              <button 
                className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <button 
                className="text-sm hover:underline"
                onClick={handleLoginClick}
              >
                Log in
              </button>
              <button 
                className="bg-black text-white text-sm px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                onClick={handleSignupClick}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Log In</h2>
              <button 
                onClick={closeLoginModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {authError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {authError}
              </div>
            )}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={loginValues.email}
                  onChange={handleLoginChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="password"
                  name="password"
                  value={loginValues.password}
                  onChange={handleLoginChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required 
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-black hover:underline">
                  Forgot password?
                </a>
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sign-up Modal */}
      {isSignupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sign Up</h2>
              <button 
                onClick={closeSignupModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {authError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {authError}
              </div>
            )}
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input 
                  type="text" 
                  name="username"
                  value={signupValues.username}
                  onChange={handleSignupChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                  placeholder="johndoe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={signupValues.email}
                  onChange={handleSignupChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="password"
                  name="password" 
                  value={signupValues.password}
                  onChange={handleSignupChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
              >
                Create account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900 overflow-hidden">
        {/* Add hero background image */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <img 
          src={myFood} 
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        
        <div className="absolute bottom-12 left-12 max-w-xl text-white z-20">
          <p className="uppercase font-medium mb-2">Featured</p>
          <h1 className="text-4xl font-bold mb-4">Breaking Into Product Design: Advice from Untitled Founder, Frankie</h1>
          <p className="text-lg">Let's get one thing out of the way: you don't need a fancy Bachelor's Degree to get into Product Design. We sat down with Frankie Sullivan to talk about gatekeeping in product design and how anyone can get into this growing industry.</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-6 md:px-20">
        <h2 className="text-2xl font-semibold mb-6">Recent blog posts</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                {myFood ? (
                  <img
                    src={myFood}
                    alt="Post"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Image placeholder</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Post Title {i}</h3>
                <p className="text-sm text-gray-600 mb-2">Short description of the blog post content goes here.</p>
                <p className="text-xs text-gray-500">Author Name • 18 Jan 2022</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="px-6 py-2 bg-gray-900 text-white rounded-md">Loading more...</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6 md:px-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold mb-2">Let's get started on something great</h2>
          <p className="mb-4">Join over 4,000+ startups already growing with Untitled.</p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 border rounded-md">Chat to us</button>
            <button className="px-4 py-2 bg-white text-black rounded-md">Get started</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <ul className="space-y-1">
              <li>Overview</li>
              <li>Features</li>
              <li>Solutions</li>
              <li>Tutorials</li>
              <li>Pricing</li>
              <li>Releases</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>About us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>News</li>
              <li>Media kit</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul className="space-y-1">
              <li>Blog</li>
              <li>Newsletter</li>
              <li>Events</li>
              <li>Help centre</li>
              <li>Tutorials</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Use cases</h4>
            <ul className="space-y-1">
              <li>Startups</li>
              <li>Enterprise</li>
              <li>Government</li>
              <li>SaaS centre</li>
              <li>Marketplaces</li>
              <li>Ecommerce</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Social</h4>
            <ul className="space-y-1">
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>Facebook</li>
              <li>GitHub</li>
              <li>AngelList</li>
              <li>Dribbble</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-10">© 2077 Untitled UI. All rights reserved.</div>
      </footer>
    </div>
  );
}