import { LoginForm } from "@/features/auth/components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — ICPC Grind",
  description: "Sign in to your ICPC Grind account",
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  );
}
