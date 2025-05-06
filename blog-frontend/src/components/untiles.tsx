import { useState } from 'react';
import { ArrowRight, MessageCircle, ChevronDown } from 'lucide-react';

// Type definitions
type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  imageSrc: string;
  author: {
    name: string;
    imageSrc: string;
  };
  date: string;
};

// Main component
export default function UntitledUI() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Migrating to Linear 101",
      excerpt: "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
      imageSrc: "/api/placeholder/400/300",
      author: {
        name: "Jonathan Willis",
        imageSrc: "/api/placeholder/32/32"
      },
      date: "19 Jan 2022"
    },
    {
      id: 2,
      title: "Building your API Stack",
      excerpt: "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
      imageSrc: "/api/placeholder/400/300",
      author: {
        name: "Lana Steiner",
        imageSrc: "/api/placeholder/32/32"
      },
      date: "18 Jan 2022"
    },
    {
      id: 3,
      title: "Bill Walsh leadership lessons",
      excerpt: "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
      imageSrc: "/api/placeholder/400/300",
      author: {
        name: "Eva Wilkins",
        imageSrc: "/api/placeholder/32/32"
      },
      date: "18 Jan 2022"
    },
    {
      id: 4,
      title: "PM mental models",
      excerpt: "Mental models are simple expressions of complex processes or relationships.",
      imageSrc: "/api/placeholder/400/300",
      author: {
        name: "Eva Wilkins",
        imageSrc: "/api/placeholder/32/32"
      },
      date: "18 Jan 2022"
    },
    {
      id: 5,
      title: "What is Wireframing?",
      excerpt: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
      imageSrc: "/api/placeholder/400/300",
      author: {
        name: "Lana Steiner",
        imageSrc: "/api/placeholder/32/32"
      },
      date: "18 Jan 2022"
    },
    {
      id: 6,
      title: "How collaboration makes us better designers",
      excerpt: "Collaboration can make our teams stronger, and our individual designs better.",
      imageSrc: "/api/placeholder/400/300",
      author: {
        name: "Jonathan Willis",
        imageSrc: "/api/placeholder/32/32"
      },
      date: "18 Jan 2022"
    },
    {
      id: 7,
      title: "How collaboration makes us better designers",
      excerpt: "Collaboration can make our teams stronger, and our individual designs better.",
      imageSrc: "/api/placeholder/400/300",
      author: {
        name: "Eva Wilkins",
        imageSrc: "/api/placeholder/32/32"
      },
      date: "18 Jan 2022"
    },
    {
      id: 8,
      title: "Our top 10 Javascript frameworks to use",
      excerpt: "JavaScript frameworks make development easy with extensive features and functionalities.",
      imageSrc: "/api/placeholder/400/300",
      author: {
        name: "Lana Steiner",
        imageSrc: "/api/placeholder/32/32"
      },
      date: "18 Jan 2022"
    },
    {
      id: 9,
      title: "Podcast: Creating a better CX Community",
      excerpt: "Creating a customer experience doesn't need to be complicated, but how do you get started?",
      imageSrc: "/api/placeholder/400/300",
      author: {
        name: "Jonathan Willis",
        imageSrc: "/api/placeholder/32/32"
      },
      date: "19 Jan 2022"
    }
  ];

  // Navigation items
  const navItems = ['Products', 'Blog', 'Pricing', 'About us'];

  // Footer links
  const footerLinks = {
    product: ['Overview', 'Features', 'Solutions', 'Tutorials', 'Pricing', 'Releases'],
    company: ['About us', 'Careers', 'Press', 'News', 'Media kit', 'Contact'],
    resources: ['Newsletter', 'Events', 'Help center', 'Tutorials', 'Support'],
    useCase: ['Startups', 'Enterprise', 'Government', 'SaaS center', 'Marketplaces', 'Ecommerce'],
    social: ['Twitter', 'LinkedIn', 'Facebook', 'GitHub', 'AngelList', 'Dribbble'],
    legal: ['Terms', 'Privacy', 'Cookies', 'Licenses', 'Settings', 'Contact']
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="ml-2 font-bold text-lg">Untitled UI</span>
            </div>
            <nav className="hidden md:flex ml-8">
              {navItems.map((item, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className={`mx-3 text-sm ${item === 'Blog' ? 'flex items-center' : ''}`}
                >
                  {item}
                  {item === 'Blog' && <ChevronDown className="ml-1 h-4 w-4" />}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <a href="#" className="mr-4 text-sm">Log in</a>
            <a href="#" className="bg-black text-white text-sm px-4 py-2 rounded-md">Sign up</a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative mb-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <div className="relative">
                <img 
                  src="/api/placeholder/1200/400" 
                  alt="Product Design Advice" 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-end p-8">
                  <div className="max-w-2xl text-white">
                    <p className="text-sm font-medium mb-2">Featured</p>
                    <h1 className="text-4xl font-bold mb-4">Breaking Into Product Design: Advice from Untitled Founder, Frankie</h1>
                    <p className="text-sm">Let's get one thing out of the way: you don't need a fancy Bachelor's Degree to get into Product Design. We sat down with Frankie Schintu to talk about gate-keeping in product design and how anyone can get into this growing industry.</p>
                  </div>
                  <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog posts section */}
        <section className="mb-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-xl font-semibold mb-6">Recent blog posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl overflow-hidden border border-gray-100">
                  <img 
                    src={post.imageSrc} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                    <div className="flex items-center">
                      <img 
                        src={post.author.imageSrc} 
                        alt={post.author.name} 
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-xs text-gray-500">{post.author.name} • {post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm">
                Loading more...
              </button>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="bg-black text-white py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Let's get started on something great</h2>
              <p className="text-gray-400">Join over 4,000+ startups already growing with Untitled.</p>
            </div>
            <div className="flex justify-center gap-4">
              <button className="border border-white px-4 py-2 rounded-md flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat to us
              </button>
              <button className="bg-white text-black px-4 py-2 rounded-md">
                Get started
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul>
                {footerLinks.product.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      {link}
                      {link === 'Solutions' && <span className="ml-2 bg-gray-700 text-white text-xs px-1 rounded">New</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul>
                {footerLinks.company.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a href="#" className="text-gray-400 hover:text-white text-sm">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul>
                {footerLinks.resources.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a href="#" className="text-gray-400 hover:text-white text-sm">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Use cases</h3>
              <ul>
                {footerLinks.useCase.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a href="#" className="text-gray-400 hover:text-white text-sm">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Social</h3>
              <ul>
                {footerLinks.social.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a href="#" className="text-gray-400 hover:text-white text-sm">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul>
                {footerLinks.legal.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a href="#" className="text-gray-400 hover:text-white text-sm">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">U</span>
              </div>
              <span className="ml-2 font-bold text-lg">Untitled UI</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2077 Untitled UI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}