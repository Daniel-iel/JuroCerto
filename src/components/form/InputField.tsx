interface InputFieldProps {
  label: string;
  type?: "number" | "text";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string | number;
  disabled?: boolean;
  placeholder?: string;
}

export default function InputField({
  label,
  type = "number",
  value,
  onChange,
  step,
  disabled = false,
  placeholder,
}: InputFieldProps) {
  return (
    <div>
      <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        step={step}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface font-mono bg-surface-base disabled:opacity-50"
      />
    </div>
  );
}
