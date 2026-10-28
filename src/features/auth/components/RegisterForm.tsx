"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { HttpError } from "@/features/common/http";
import { Input } from "@/features/common/components/Input";
import { Button } from "@/features/common/components/Button";

export function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register({ name, email, password });
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 409) {
          // 409: email ya existente, error adyacente junto al campo (Rúbrica)
          setErrors({ email: "An account with this email address already exists" });
        } else {
          setErrors({ general: err.message || "Failed to register account" });
        }
      } else {
        setErrors({ general: "Network error. Please try again later." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-bg-secondary border border-border-color rounded-lg p-6 sm:p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Create an account</h1>
        <p className="text-sm text-text-muted">
          Join ICPC Grind to contribute benchmark problems to the community.
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-accent-red/10 border border-accent-red/30 rounded text-xs text-accent-red">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Full name"
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ada Lovelace"
          error={errors.name}
          aria-required="true"
        />

        <Input
          label="Email address"
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="competitor@icpc.org"
          error={errors.email}
          aria-required="true"
        />

        <Input
          label="Password (min 6 characters)"
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.password}
          aria-required="true"
        />

        <Button
          type="submit"
          isLoading={loading}
          className="w-full font-mono text-sm"
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-cyan hover:underline font-medium">
          Sign in here
        </Link>
      </div>
    </div>
  );
}
