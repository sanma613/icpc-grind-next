import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — ICPC Grind",
  description: "Create your ICPC Grind account",
};

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  );
}
