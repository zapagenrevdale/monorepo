"use client";

import { useEffect, useState } from 'react';

export default function Page() {
  const [host, setHost] = useState('');

  useEffect(() => {
    setHost(window.location.host);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6">
      <h1 className="text-7xl font-bold">My Docs</h1>
      <p>
        running at <code className="text-white bg-primary px-2 py-1">{host}</code>
      </p>
    </div>
  );
}
