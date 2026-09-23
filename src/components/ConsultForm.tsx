"use client";

import { useState } from "react";

export default function ConsultForm() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <input
        name="name"
        placeholder="Name"
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="phone"
        placeholder="Phone"
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="company"
        placeholder="Company (optional)"
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        name="message"
        placeholder="Message"
        required
        className="w-full border rounded px-3 py-2"
        rows={4}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-black text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Consult Now"}
      </button>

      {status === "success" && (
        <p className="text-green-600 text-sm">
          Thanks! We'll be in touch soon.
        </p>
      )}
      {status === "error" && <p className="text-red-600 text-sm">{errorMsg}</p>}
    </form>
  );
}
