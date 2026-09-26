"use client";

import CountryPhoneInput from "@/components/CountryPhoneInput";
import type { AuthUser } from "@/lib/useAuth";

type Props = {
  user: AuthUser | null;
  includeEmail?: boolean;
  inputClassName?: string;
};

export default function MemberContactFields({ user, includeEmail = false, inputClassName = "w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500" }: Props) {
  return <>
    {user?.name ? <input type="hidden" name="name" value={user.name} /> : (
      <label className="block text-sm font-semibold text-gray-700">Name *
        <input required name="name" autoComplete="name" className={`mt-2 ${inputClassName}`} placeholder="Your name" />
      </label>
    )}
    {user?.phone ? <input type="hidden" name="phone" value={user.phone} /> : (
      <label className="block text-sm font-semibold text-gray-700">Phone *
        <CountryPhoneInput required name="phone" containerClassName="mt-2" inputClassName="py-3 font-normal" placeholder="Phone number" />
      </label>
    )}
    {includeEmail && (user?.email ? <input type="hidden" name="email" value={user.email} /> : (
      <label className="block text-sm font-semibold text-gray-700">Email
        <input type="email" name="email" autoComplete="email" className={`mt-2 ${inputClassName}`} placeholder="Email address" />
      </label>
    ))}
  </>;
}
