import { Bike } from "lucide-react";
import ServiceLandingPage, { ServiceLandingConfig } from "@/components/ServiceLandingPage";

const config: ServiceLandingConfig = {
  title: "Bike Rental in Patna",
  eyebrow: "Affordable two-wheeler travel",
  description: "Get around Patna on a dependable commuter bike, with daily and weekly rental options for errands, work and local travel.",
  details: "Tell us when and where you need the bike. Our team will confirm availability, rental terms and pickup details before your trip.",
  icon: <Bike strokeWidth={1.3} />,
  benefits: ["Daily and weekly plans", "Commuter bikes for city travel", "Helmet support available", "Clear terms confirmed before pickup"],
  options: [
    { title: "Daily rental", description: "A practical option for a day of errands, appointments or local travel." },
    { title: "Weekly rental", description: "Keep a bike for a longer stay or a week of regular commuting." },
    { title: "Request a bike", description: "Share your dates and pickup needs so our team can check availability." },
  ],
  bookingLabel: "Request a Bike",
  bookingType: "a Bike Rental",
};

export default function BikeRentalPage() {
  return <ServiceLandingPage config={config} />;
}
