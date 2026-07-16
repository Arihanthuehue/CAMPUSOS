import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { ApiError } from "../../lib/apiError";

export function Register() {
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors(err.errors);
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold font-display text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Join CampusOS to browse, join, and build with campus clubs.</p>
      </div>

      {formError && (
        <p className="border-2 border-[#FF3B3B] bg-[#FFF0F0] px-3 py-2 text-sm text-[#FF3B3B] font-semibold">{formError}</p>
      )}

      <div>
        <label htmlFor="name" className="field-label">
          Name
        </label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="field-control mt-1.5"
          placeholder="Asha Rao"
        />
        {fieldErrors.name && <p className="mt-1.5 text-xs text-[#FF3B3B] font-semibold">{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="field-control mt-1.5"
          placeholder="you@campusos.edu"
        />
        {fieldErrors.email && <p className="mt-1.5 text-xs text-[#FF3B3B] font-semibold">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          className="field-control mt-1.5"
          placeholder="••••••••"
        />
        {fieldErrors.password && <p className="mt-1.5 text-xs text-[#FF3B3B] font-semibold">{fieldErrors.password}</p>}
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted font-medium">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-ink underline decoration-brand decoration-2 underline-offset-2">
          Log in
        </Link>
      </p>
    </form>
  );
}
