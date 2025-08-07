import React from 'react'
import {FaHeart} from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="footer items-center p-4 bg-base-200 text-base-content">
      <div className="items-center grid-flow-col">
        <span>Built with</span>
        <FaHeart className="text-error mx-1" />
        <span>by Yash Sharma</span>
      </div>
    </footer>
  );
}

