"use client";

import { useState } from "react";

const countries = [
  { name: "India", code: "+91", flag: "in" },
  { name: "United States", code: "+1", flag: "us" },
  { name: "Canada", code: "+1", flag: "ca" },
  { name: "United Kingdom", code: "+44", flag: "gb" },
  { name: "United Arab Emirates", code: "+971", flag: "ae" },
  { name: "Saudi Arabia", code: "+966", flag: "sa" },
  { name: "Qatar", code: "+974", flag: "qa" },
  { name: "Oman", code: "+968", flag: "om" },
  { name: "Kuwait", code: "+965", flag: "kw" },
  { name: "Nepal", code: "+977", flag: "np" },
  { name: "Bangladesh", code: "+880", flag: "bd" },
  { name: "Sri Lanka", code: "+94", flag: "lk" },
  { name: "Pakistan", code: "+92", flag: "pk" },
  { name: "Australia", code: "+61", flag: "au" },
  { name: "New Zealand", code: "+64", flag: "nz" },
  { name: "Singapore", code: "+65", flag: "sg" },
  { name: "Malaysia", code: "+60", flag: "my" },
  { name: "Germany", code: "+49", flag: "de" },
  { name: "France", code: "+33", flag: "fr" },
  { name: "South Africa", code: "+27", flag: "za" },
];

type Country = (typeof countries)[number];

function parsePhone(value: string): { country: Country; number: string } {
  const country = countries.find((entry) => value.startsWith(entry.code)) ?? countries[0];
  const number = value.startsWith(country.code)
    ? value.slice(country.code.length).replace(/\D/g, "")
    : value.replace(/\D/g, "");
  return { country, number };
}

interface CountryPhoneInputProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  containerClassName?: string;
  inputClassName?: string;
  id?: string;
}

export default function CountryPhoneInput({
  name,
  value,
  defaultValue = "",
  onChange,
  required = false,
  placeholder = "Phone number",
  autoComplete = "tel-national",
  containerClassName = "",
  inputClassName = "",
  id,
}: CountryPhoneInputProps) {
  const initial = parsePhone(value ?? defaultValue);
  const [country, setCountry] = useState<Country>(initial.country);
  const [localNumber, setLocalNumber] = useState(initial.number);
  const [open, setOpen] = useState(false);

  const number = value === undefined
    ? localNumber
    : value.startsWith(country.code)
      ? value.slice(country.code.length).replace(/\D/g, "")
      : parsePhone(value).number;

  const updateNumber = (nextNumber: string, nextCountry = country) => {
    const digits = nextNumber.replace(/\D/g, "");
    setLocalNumber(digits);
    onChange?.(digits ? `${nextCountry.code}${digits}` : "");
  };

  const chooseCountry = (nextCountry: Country) => {
    setCountry(nextCountry);
    setOpen(false);
    onChange?.(number ? `${nextCountry.code}${number}` : "");
  };

  return (
    <div className={`relative flex rounded-xl border border-gray-200 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 ${containerClassName}`}>
      <input type="hidden" name={name} value={number ? `${country.code}${number}` : ""} />
      <div className="relative shrink-0 border-r border-gray-200">
        <button
          type="button"
          aria-label={`Country calling code: ${country.name} ${country.code}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className="flex h-full w-24 items-center justify-center gap-2 px-2 text-xs text-gray-700"
        >
          <img src={`https://flagcdn.com/w40/${country.flag}.png`} alt="" width={22} height={16} className="h-4 w-[22px] rounded-sm object-cover" />
          <span>{country.code}</span>
        </button>
        {open && (
          <div role="listbox" aria-label="Choose country calling code" className="absolute left-0 top-full z-50 mt-2 max-h-60 w-48 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl">
            {countries.map((entry) => (
              <button
                key={entry.flag}
                type="button"
                role="option"
                aria-selected={country.flag === entry.flag}
                aria-label={`${entry.name} ${entry.code}`}
                onClick={() => chooseCountry(entry)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-orange-50"
              >
                <img src={`https://flagcdn.com/w40/${entry.flag}.png`} alt="" width={22} height={16} className="h-4 w-[22px] rounded-sm object-cover" />
                <span>{entry.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete={autoComplete}
        value={number}
        onChange={(event) => updateNumber(event.target.value)}
        placeholder={placeholder}
        required={required}
        className={`min-w-0 w-full rounded-r-xl border-0 bg-white px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 ${inputClassName}`}
      />
    </div>
  );
}
