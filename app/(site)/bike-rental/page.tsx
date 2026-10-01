import { Bike } from "lucide-react";
import ServiceLandingPage, { ServiceLandingConfig } from "@/components/ServiceLandingPage";

const config: ServiceLandingConfig = {
  title: "Bike Rental in Patna",
  eyebrow: "Affordable two-wheeler travel",
  description: "Choose a scooter or motorcycle for your Patna trip, with rental options for everyday commutes and longer rides.",
  details: "Tell us when and where you need the bike. Our team will confirm availability, rental terms and pickup details before your trip.",
  icon: <Bike strokeWidth={1.3} />,
  benefits: ["Daily and weekly plans", "Commuter bikes for city travel", "Helmet support available", "Clear terms confirmed before pickup"],
  optionsHeading: "Choose Your Bike",
  options: [
    {
      title: "Honda Activa",
      image: "/Activa.png",
      description: "An easy-to-ride scooter for daily errands and city travel.",
      features: ["Automatic scooter", "Convenient for city commutes", "Daily and weekly requests"],
    },
    {
      title: "Bajaj Pulsar",
      image: "/Pulsar.png",
      description: "A sporty motorcycle for commuting and longer rides.",
      features: ["Manual motorcycle", "For city and highway journeys", "Daily and weekly requests"],
    },
    {
      title: "Bajaj Vikrant",
      image: "/Vikrant.png",
      description: "A practical commuter motorcycle for getting around town.",
      features: ["Commuter motorcycle", "Suitable for everyday travel", "Availability confirmed by our team"],
    },
    {
      title: "Royal Enfield Classic 350 Bullet",
      image: "/Bullet.png",
      description: "A classic-style motorcycle for a relaxed, distinctive ride.",
      features: ["350 cc motorcycle", "For city and longer rides", "Availability confirmed by our team"],
    },
  ],
  bookingLabel: "Request a Bike",
  bookingType: "a Bike Rental",
};

export default function BikeRentalPage() {
  return <ServiceLandingPage config={config} />;
}
