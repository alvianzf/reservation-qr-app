import React from "react";
import { Link } from "react-router-dom";
import { ScanLine, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-black mb-4">
          Moments Unlocked
        </h1>
        <p className="text-black-400 max-w-2xl mx-auto">
        Your perfect party begins with the perfect guest list.
        <br />
          <i className="text-sm">
            A party becomes unforgettable when it’s filled with love, laughter,
            and the right people.
          </i>
          <br /><span className="text-sm text-gray-700">- Blissful Makers</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link
          to="/scanner"
          className="block p-6 bg-silver rounded-lg border  hover:bg-gray-700 transition duration-200 transform hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-300 p-3 rounded-lg">
              <ScanLine className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">Scan QR Code</h2>
              <p className="text-gray-600">Verify guest details instantly</p>
            </div>
          </div>
        </Link>

        {user?.isAdmin ? (
          <Link
            to="/admin"
            className="block p-6 bg-silver rounded-lg border hover:bg-gray-700 transition duration-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-300 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Guest List</h2>
                <p className="text-gray-600">Manage event attendees</p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 opacity-50">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-300 p-3 rounded-lg">
                <Users className="h-6 w-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Guest List</h2>
                <p className="text-black-400">Admin access required</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {!user && (
        <div className="text-center mt-8">
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>Admin Login</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
