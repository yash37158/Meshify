import React from 'react'
import {FaHeart} from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-gray-200 py-1 h-auto fixed bottom-0 w-full">
  <div className="container flex justify-center items-center">
    <span className="mr-2">Built in collaboration with</span>
    <FaHeart className="text-gray-500" />
    <span className="ml-2">by Yash Sharma</span>
  </div>
</footer>
  );
}

