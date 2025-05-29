import React, { useState, useEffect } from "react";
import myFood from '../assets/food.jpg'; // adjust path as needed

// Define SafeUser type
interface SafeUser {
  id?: string;
  username: string;
  email?: string;
}

// Define BlogPost type
interface BlogPost {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  content: string;
  image: string;
}

export default function BlogPage() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [signupValues, setSignupValues] = useState({ username: '', email: '', password: '' });
  
  const [user, setUser] = useState<SafeUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');

  // Sample blog posts data
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Breaking Into Product Design: Advice from Untitled Founder, Frankie",
      description: "Let's get one thing out of the way: you don't need a fancy Bachelor's Degree to get into Product Design.",
      author: "Frankie Sullivan",
      date: "18 Jan 2022",
      content: `
        <p>Let's get one thing out of the way: you don't need a fancy Bachelor's Degree to get into Product Design. We sat down with Frankie Sullivan to talk about gatekeeping in product design and how anyone can get into this growing industry.</p>
        
        <h2>The journey begins</h2>
        <p>Frankie didn't start out as a designer. "I was working in customer service for years," she tells us. "I learned so much about what users actually want and need from that experience. It was the perfect foundation for product design."</p>
        
        <p>After teaching herself the basics of design through online resources and building a portfolio of speculative projects, Frankie landed her first design role at a small startup.</p>
        
        <h2>Breaking barriers</h2>
        <p>"The industry has this idea that you need formal training or specific credentials, but that's just not true," Frankie explains. "What companies really need are people who understand users and can solve problems creatively."</p>
        
        <p>She recommends starting with free resources online and building projects that showcase your thinking process, not just your visual design skills.</p>
        
        <h2>Building Untitled</h2>
        <p>After several years working in-house at various companies, Frankie founded Untitled, a design agency focused on helping startups create accessible, user-friendly products.</p>
        
        <p>"We wanted to create a company that practices what it preaches about inclusion," she says. "That means hiring designers from non-traditional backgrounds and creating opportunities for newcomers."</p>
        
        <h2>Advice for newcomers</h2>
        <p>"Focus on the fundamentals of good design: solving real problems for real people," Frankie advises. "Tools and trends will change, but understanding how to approach design problems is timeless."</p>
        
        <p>She also emphasizes the importance of building a community. "Find other designers, even beginners like yourself. Share feedback, celebrate wins, and support each other through challenges."</p>
      `,
      image: myFood
    },
    {
      id: 2,
      title: "The Future of UI: Trends to Watch in 2025",
      description: "A look at emerging design patterns and technologies shaping the future of user interfaces.",
      author: "Alex Chen",
      date: "22 Feb 2022",
      content: `
        <p>As we move further into the decade, several key trends are emerging in UI design that promise to reshape how users interact with digital products.</p>
        
        <h2>Adaptive Interfaces</h2>
        <p>Interfaces that automatically adjust to user behavior and preferences are becoming more sophisticated. These systems learn from interactions and modify layouts, content, and functionality to better serve individual needs.</p>
        
        <h2>Voice and Gesture</h2>
        <p>While touch and click have dominated for years, voice commands and gesture controls are rapidly gaining ground, especially in home and automotive applications. Designers are now creating interfaces that seamlessly blend these modalities.</p>
        
        <h2>Ethical Design</h2>
        <p>With growing awareness of digital wellbeing, designers are prioritizing interfaces that respect user attention and mental health. This includes features that encourage mindful usage and reduce addictive patterns.</p>
        
        <h2>Where We're Headed</h2>
        <p>The most exciting developments lie at the intersection of these trends. Imagine interfaces that adapt not just to preferences but to emotional states, using subtle cues to determine when to offer more or less assistance.</p>
      `,
      image: myFood
    },
    {
      id: 3,
      title: "Designing for Accessibility: Beyond Compliance",
      description: "How making your products accessible improves the experience for everyone.",
      author: "Jordan Lee",
      date: "5 Mar 2022",
      content: `
        <p>Accessibility in design isn't just about meeting legal requirements—it's about creating better products for all users.</p>
        
        <h2>Universal Benefits</h2>
        <p>Features originally designed for users with disabilities often become mainstream conveniences. Consider autocomplete, voice interfaces, and high-contrast modes—all developed with accessibility in mind but now widely appreciated.</p>
        
        <h2>Getting Started</h2>
        <p>Begin by addressing the basics: sufficient color contrast, keyboard navigation, alternative text for images, and semantic HTML. These fundamental changes can dramatically improve usability for many users.</p>
        
        <h2>Testing Is Crucial</h2>
        <p>Automated tests can catch some issues, but nothing replaces testing with actual users who have disabilities. Their feedback will reveal problems no algorithm can detect.</p>
        
        <h2>The Business Case</h2>
        <p>Beyond ethics, accessible design makes business sense. It expands your market, reduces legal risks, and often results in cleaner, more maintainable code.</p>
      `,
      image: myFood
    }
  ]);

  for (let i = 4; i <= 9; i++) {
    blogPosts.push({
      id: i,
      title: `Post Title ${i}`,
      description: "Short description of the blog post content goes here.",
      author: "Author Name",
      date: "18 Jan 2022",
      content: `<p>This is the full content for blog post ${i}. It contains multiple paragraphs of detailed information about the topic.</p>
      <p>Second paragraph with more information about this interesting topic.</p>
      <h2>Important Subheading</h2>
      <p>More detailed content exploring the main points of this blog post.</p>
      <p>Final thoughts and conclusions about the topic discussed in this post.</p>`,
      image: myFood
    });
  }
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupClick = () => {
    setIsSignupOpen(true);
    setAuthError('');
  };
  
  const closeSignupModal = () => {
    setIsSignupOpen(false);
    setAuthError('');
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setAuthError('');
  };

  const closeLoginModal = () => {
    setIsLoginOpen(false);
    setAuthError('');
  };

  // Function to handle post selection
  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    // Scroll to top when viewing a post
    window.scrollTo(0, 0);
  };

  // Function to go back to posts list
  const handleBackToPosts = () => {
    setSelectedPost(null);
  };

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

      {selectedPost ? (
        // Blog Post Detail View
        <div className="py-8 px-6 md:px-20">
          <button 
            onClick={handleBackToPosts} 
            className="mb-6 flex items-center text-gray-600 hover:text-black"
          >
            <span className="mr-2">←</span> Back to all posts
          </button>
          
          <div className="max-w-4xl mx-auto">
            <img 
              src={selectedPost.image} 
              alt={selectedPost.title} 
              className="w-full h-80 object-cover rounded-lg mb-6"
            />
            
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-4">{selectedPost.title}</h1>
              <div className="flex items-center text-gray-600 mb-6">
                <span>{selectedPost.author}</span>
                <span className="mx-2">•</span>
                <span>{selectedPost.date}</span>
              </div>
            </div>
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
            
            {/* Comment section could be added here */}
            <div className="mt-10 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4">Comments</h3>
              {user ? (
                <div>
                  <textarea 
                    className="w-full p-3 border rounded-md" 
                    rows={4} 
                    placeholder="Leave a comment..."
                  ></textarea>
                  <button className="mt-2 px-4 py-2 bg-black text-white rounded-md">
                    Post Comment
                  </button>
                </div>
              ) : (
                <p>
                  <button 
                    className="text-black font-medium hover:underline"
                    onClick={handleLoginClick}
                  >
                    Log in
                  </button> to leave a comment.
                </p>
              )}
              
              <div className="mt-6">
                <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
              </div>
            </div>
            
            {/* Related posts section */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Related posts</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {blogPosts
                  .filter(post => post.id !== selectedPost.id)
                  .slice(0, 2)
                  .map(post => (
                    <div 
                      key={post.id} 
                      className="cursor-pointer border rounded-lg overflow-hidden shadow-sm"
                      onClick={() => handlePostClick(post)}
                    >
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-1">{post.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{post.description}</p>
                        <p className="text-xs text-gray-500">{post.author} • {post.date}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative h-96 bg-gray-900 overflow-hidden">
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
              <button 
                className="mt-4 px-6 py-2 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => handlePostClick(blogPosts[0])}
              >
                Read More
              </button>
            </div>
          </section>

          {/* Blog Posts */}
          <section className="py-12 px-6 md:px-20">
           `` <h2 className="text-2xl font-semibold mb-6">Recent blog posts</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {blogPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white border rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="w-full h-48 bg-gray-200">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{post.description}</p>
                    <p className="text-xs text-gray-500">{post.author} • {post.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <button className="px-6 py-2 bg-gray-900 text-white rounded-md">Loading more...</button>
            </div>
          </section>
        </>
      )}

     
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