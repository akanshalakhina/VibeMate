import React from "react";

export default function TestComponent() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Test Component</h1>
      <p>Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Increment
      </button>
    </div>
  );
}
