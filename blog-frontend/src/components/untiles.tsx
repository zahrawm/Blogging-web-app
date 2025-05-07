// Adjust the path as necessary
import React from "react";
import myFood from '../assets/food.jpg'; // adjust path as needed

export default function BlogPage() {
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
          <a href="#" className="hover:underline">A bout us</a>
        </nav>
        <div className="flex space-x-4">
          <button className="text-sm">Log in</button>
          <button className="bg-black text-white text-sm px-4 py-2 rounded-md">Sign up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        
        <div className="absolute bottom-12 left-12 max-w-xl text-white">
          <p className="uppercase font-medium mb-2">Featured</p>
          <h1 className="text-4xl font-bold mb-4">Breaking Into Product Design: Advice from Untitled Founder, Frankie</h1>
          <p className="text-lg">Let’s get one thing out of the way: you don’t need a fancy Bachelor’s Degree to get into Product Design. We sat down with Frankie Sullivan to talk about gatekeeping in product design and how anyone can get into this growing industry.</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 px-6 md:px-20">
        <h2 className="text-2xl font-semibold mb-6">Recent blog posts</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <img
                src={myFood}
                alt="Post"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Post Title {i + 1}</h3>
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
          <h2 className="text-2xl font-semibold mb-2">Let’s get started on something great</h2>
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


