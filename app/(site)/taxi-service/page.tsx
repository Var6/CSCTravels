import { Navigation } from "lucide-react";
import ServiceLandingPage, { ServiceLandingConfig } from "@/components/ServiceLandingPage";

const config: ServiceLandingConfig = {
  title: "Taxi Service in Patna",
  eyebrow: "Point-to-point and outstation trips",
  description: "Plan a one-way or return taxi ride from Patna for a nearby town, a family visit or a longer journey.",
  details: "Outstation rides are quoted at the published ₹12/km rate. Tolls and parking are billed clearly, and our team confirms the trip details before booking.",
  icon: <Navigation strokeWidth={1.3} />,
  benefits: ["One-way and round trips", "Outstation travel from Patna", "Published ₹12/km outstation rate", "Tolls and parking billed clearly"],
  options: [
    { title: "Nearby destinations", description: "Request a trip to Gaya, Jehanabad, Ranchi or another destination." },
    { title: "One-way taxi", description: "Arrange a point-to-point trip without booking a return journey." },
    { title: "Round-trip taxi", description: "Plan a return journey and share your schedule with our team." },
  ],
  bookingLabel: "Request a Taxi",
  bookingType: "an Outstation Taxi",
};

export default function TaxiServicePage() {
  return <ServiceLandingPage config={config} />;
}
