import { useToast } from "@/hooks/use-toast";
import { privateFetch } from "@/hooks/useFetch";
import React, { useState } from "react";
import { Trans } from "@lingui/react/macro";

export default function SendCashbackPage() {
  const fetch = privateFetch();
  const { toast } = useToast();
  const [uid, setUid] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/cashback/${uid}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });
      const data = await res.json();
      if (data.message === "User not found") {
        setError("User not found. Please check the user ID.");
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
        setShowConfirmation(false);
      } else {
        setSuccess(true);
        setUid("");
        setAmount("");
        toast({
          title: "Cashback sent successfully!",
          description: "The cashback has been sent to the user.",
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError("User not found. Please check the user ID.");
      } else {
        setError(error.response?.data?.message || "An error occurred");
      }
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        {showConfirmation ? (
          <div className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="p-8">
              <h2 className="mb-4 text-lg font-semibold">
                <Trans>Confirm Cashback</Trans>
              </h2>
              <p className="mb-4 text-gray-600">
                <Trans>
                  Are you sure you want to send ${amount} to user ID: {uid}?
                </Trans>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-gray-900 py-3 text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:bg-gray-400"
                >
                  {loading ? "Sending..." : "Confirm"}
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-gray-300 py-3 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl bg-white shadow-lg">
            <div className="p-8">
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Trans>User ID</Trans>
                </label>
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 transition-colors focus:border-gray-700 focus:outline-none"
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Trans>Cashback Amount</Trans>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 pl-8 transition-colors focus:border-gray-700 focus:outline-none"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                  <Trans>{error}</Trans>
                </div>
              )}

              {success && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-500">
                  <Trans>Cashback sent successfully!</Trans>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gray-900 py-3 text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 disabled:bg-gray-400"
              >
                {loading ? <Trans>Sending...</Trans> : <Trans>Send Cashback</Trans>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
