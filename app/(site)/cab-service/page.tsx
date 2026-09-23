import { CarTaxiFront } from "lucide-react";
import ServiceLandingPage, { ServiceLandingConfig } from "@/components/ServiceLandingPage";

const config: ServiceLandingConfig = {
  title: "Cab Service in Patna",
  eyebrow: "Everyday city rides",
  description: "Book a cab for local travel across Patna, including everyday trips, airport pickups and railway station transfers.",
  details: "Share your pickup point, destination and preferred time. Our team will contact you to confirm the ride and fare.",
  icon: <CarTaxiFront strokeWidth={1.3} />,
  benefits: ["Doorstep pickup", "Airport and railway transfers", "Verified, salaried drivers", "Fare confirmed before the trip"],
  options: [
    { title: "Local rides", description: "Travel across Patna for work, shopping, appointments and everyday plans." },
    { title: "Airport transfers", description: "Arrange a pickup or drop-off around your flight schedule." },
    { title: "Railway station rides", description: "Book a convenient transfer to or from Patna railway stations." },
  ],
  bookingLabel: "Request a Cab",
  bookingType: "a Cab",
};

export default function CabServicePage() {
  return <ServiceLandingPage config={config} />;
}
