"use client";

import Link from "next/link";
import countries from "@/lib/countries.json";
import { Listbox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { registerUser } from "@/utils/register";


export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+961");
  const [localNumber, setLocalNumber] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !localNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    const fullPhone = `${countryCode}${localNumber}`;
    await registerUser(name, email, password, fullPhone);
  };


  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setLocalNumber(value);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-100 to-blue-100 text-black">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-600">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <div className="flex gap-2">
            <div className="w-1/2">
              {/* Custom Country Code Dropdown */}
              <Listbox value={countryCode} onChange={setCountryCode}>
                <div className="relative w-full">
                  <Listbox.Button className="w-full px-4 py-2 text-left border border-gray-300 rounded bg-white">
                    {countries.find(c => c.dialcode === countryCode)?.name} ({countryCode})
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded shadow-lg">
                    {countries.map((country) => (
                      <Listbox.Option key={country.code} value={country.dialcode} as={Fragment}>
                        {({ active }) => (
                          <li
                            className={`px-4 py-2 cursor-pointer ${active ? 'bg-yellow-100' : ''
                              }`}
                          >
                            <div className="font-semibold text-sm">{country.name}</div>
                            <div className="text-xs text-gray-600">{country.dialcode}</div>
                            <hr className="mt-2 mb-1 border-gray-200" />
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            <input
              type="text"
              placeholder="Phone Number"
              className="w-1/2 px-4 py-2 border border-gray-300 rounded"
              value={localNumber}
              onChange={handleNumberChange}
              required
            />
          </div>
        </div>


        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
