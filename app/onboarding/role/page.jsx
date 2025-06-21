'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { clsx } from 'clsx';
import { useUser } from '@civic/auth/react';

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState(null);

  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');

  const [company, setCompany] = useState('');
  const [dept, setDept] = useState('');

  const { user } = useUser();
  const { name, picture, id } = user;
  console.log(user);

  const isValid =
    role &&
    ((role === 'student' && school && year) ||
      (role === 'working' && company && dept));

  const handleSubmit = () => {
    const userInfo = {
      name,
      picture,
      cividId: id,
      role,
      ...(role === 'student'
        ? { school, year }
        : { company, dept }),
    };

    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('onboardingComplete', 'true');
    router.push('/upload');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Welcome to Grasp 👋
        </h1>

        <div className="mb-4">
          <label className="block font-medium mb-2">What's your role?</label>
          <div className="flex gap-4">
            <button
              onClick={() => setRole('student')}
              className={clsx(
                'px-4 py-2 rounded-full border w-full',
                role === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              Student
            </button>
            <button
              onClick={() => setRole('working')}
              className={clsx(
                'px-4 py-2 rounded-full border w-full',
                role === 'working'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              Working
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {role === 'student' && (
            <>
              <input
                type="text"
                placeholder="School / College"
                className="w-full border rounded px-3 py-2"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
              <input
                type="text"
                placeholder="Year (e.g., 2nd year)"
                className="w-full border rounded px-3 py-2"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </>
          )}

          {role === 'working' && (
            <>
              <input
                type="text"
                placeholder="Company Name"
                className="w-full border rounded px-3 py-2"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <input
                type="text"
                placeholder="Department / Role"
                className="w-full border rounded px-3 py-2"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              />
            </>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-300"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

