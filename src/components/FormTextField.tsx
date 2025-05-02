import { TextField } from "@mui/material";

type FormTextFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  multiline?: boolean;
  rows?: number;
  type?: string;
  required?: boolean;
};

export const FormTextField = ({ label, name, value, onChange, multiline = false, rows = 1, type = "text", required = false }: FormTextFieldProps) => (
  <TextField
    variant="filled"
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    fullWidth
    required={required}
    color="info"
    type={type}
    multiline={multiline}
    rows={rows}
    sx={{
      "& .MuiFilledInput-root": {
        backgroundColor: "#f1f5f9",
        borderRadius: "8px",
        "&:hover": {
          backgroundColor: "#e2e8f0",
        },
        "&.Mui-focused": {
          backgroundColor: "#fff",
        },
      },
      "& .MuiInputBase-input": {
        color: "#0f172a",
      },
      "& .MuiInputBase-input::placeholder": {
        color: "#94a3b8",
        opacity: 1,
      },
    }}
  />
);

export const CurrencyTextField = ({
  label,
  name,
  value,
  onChange,
  multiline = false,
  rows = 1,
  required = false,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) => (
  <TextField
    variant="filled"
    label={label}
    name={name}
    value={value.toLocaleString("id-ID")} // <--- cuma kasih separator ribuan, bukan "Rp"
    onChange={(e) => {
      const raw = e.target.value.replace(/\D/g, "");
      const parsed = raw ? parseInt(raw) : 0;
      onChange(name, parsed); // <--- simple clean no fake event
    }}
    fullWidth
    required={required}
    color="info"
    multiline={multiline}
    rows={rows}
    sx={{
      "& .MuiFilledInput-root": {
        backgroundColor: "#f1f5f9",
        borderRadius: "8px",
        "&:hover": {
          backgroundColor: "#e2e8f0",
        },
        "&.Mui-focused": {
          backgroundColor: "#fff",
        },
      },
      "& .MuiInputBase-input": {
        color: "#0f172a",
      },
      "& .MuiInputBase-input::placeholder": {
        color: "#94a3b8",
        opacity: 1,
      },
    }}
  />
);
