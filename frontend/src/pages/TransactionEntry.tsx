import React, { useState } from "react";

export default function TransactionEntry() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleParse = async () => {
    setLoading(true);
    const res = await fetch("/api/transactions/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    setParsed(data);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!parsed) return;
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });
    setConfirmed(true);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
      <input
        className="w-full p-2 border rounded mb-4"
        placeholder="e.g. Bought Samsung watch $250"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleParse} disabled={loading}>
        {loading ? "Parsing..." : "Parse"}
      </button>
      {parsed && (
        <div className="mt-6">
          <h3 className="font-semibold">Parsed Transaction:</h3>
          <pre className="bg-gray-100 p-2 rounded mb-2">{JSON.stringify(parsed, null, 2)}</pre>
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleConfirm}>
            Confirm & Save
          </button>
        </div>
      )}
      {confirmed && <div className="mt-4 text-green-700">Transaction saved!</div>}
    </div>
  );
}
