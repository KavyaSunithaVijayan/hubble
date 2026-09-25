"use client";

import { Enquiry } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ConsultFields = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
};
type Status = "idle" | "success" | "error";

export default function ConsultForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultFields>();

  const [status, setStatus] = useState<Status>("idle");

  const EnquiryMutation = useMutation({
    mutationFn: (data: ConsultFields) => Enquiry(data),
    onSuccess: () => {
      reset();
      setStatus("success");
    },
    onError: () => {
      setStatus("error");
    },
  });
  const onSubmit = async (data: ConsultFields) => {
    setStatus("idle");
    EnquiryMutation.mutate(data);
  };

  const errorMsg =
    EnquiryMutation.error instanceof AxiosError
      ? (EnquiryMutation.error.response?.data?.error ??
        "Something went wrong. Please try again.")
      : "Network error. Please try again.";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F1D2E] p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#56D6C0]">
        Consult now
      </p>
      <h2 className="mt-2 text-3xl font-bold text-white">
        Tell us what you're building.
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input
              placeholder="Name *"
              className="w-full rounded-lg border border-white/10 bg-[#0B1626] px-4 py-3 text-sm text-white placeholder-[#6b7a8d] focus:border-[#56D6C0] focus:outline-none"
              {...register("name", { required: "Enter your name." })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              placeholder="Email *"
              className="w-full rounded-lg border border-white/10 bg-[#0B1626] px-4 py-3 text-sm text-white placeholder-[#6b7a8d] focus:border-[#56D6C0] focus:outline-none"
              {...register("email", {
                required: "Enter your email.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              placeholder="Phone *"
              className="w-full rounded-lg border border-white/10 bg-[#0B1626] px-4 py-3 text-sm text-white placeholder-[#6b7a8d] focus:border-[#56D6C0] focus:outline-none"
              {...register("phone", {
                required: "Enter your phone number.",
                pattern: {
                  value: /^[0-9+\-\s()]{7,15}$/,
                  message: "Enter a valid phone number.",
                },
              })}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          <input
            placeholder="Company"
            className="w-full rounded-lg border border-white/10 bg-[#0B1626] px-4 py-3 text-sm text-white placeholder-[#6b7a8d] focus:border-[#56D6C0] focus:outline-none"
            {...register("company")}
          />
        </div>

        <div>
          <textarea
            placeholder="Message *"
            rows={5}
            className={`w-full rounded-lg border border-white/10 bg-[#0B1626] px-4 py-3 text-sm text-white placeholder-[#6b7a8d] focus:border-[#56D6C0] focus:outline-none resize-y`}
            {...register("message", { required: "Tell us what you need." })}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-400">
              {errors.message.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={EnquiryMutation.isPending}
            className="rounded-lg bg-[#56D6C0] px-6 py-3 font-semibold text-[#07111F] transition-colors hover:bg-[#4bc7b2] disabled:opacity-60"
          >
            {EnquiryMutation.isPending ? "Sending..." : "Consult Now"}
          </button>

          <div role="status" aria-live="polite" className="mt-3 text-sm">
            {status === "success" && (
              <p className="rounded-md bg-emerald-500/10 px-3 py-2 text-emerald-400">
                Request sent. We'll reply to your email soon.
              </p>
            )}
            {status === "error" && (
              <p className="rounded-md bg-red-500/10 px-3 py-2 text-red-400">
                {errorMsg}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
