"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { useState } from "react";
import emailjs from "emailjs-com";
import { EMAILJS_CONFIG } from "@/lib/config";

export default function Feedback() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rating: "5",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        const templateParams = {
            to_name: "CSC Travel Admin",
            from_name: formData.name,
            email: formData.email,
            rating: formData.rating,
            message: formData.message,
            form_type: "Feedback Submission"
        };

        emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.PUBLIC_KEY
        ).then(
            () => {
                setStatus("success");
                setFormData({ name: "", email: "", rating: "5", message: "" });
            },
            (error) => {
                console.error(error);
                setStatus("error");
            }
        );
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">We Value Your Feedback</h1>
                    <p className="text-lg text-gray-600">
                        Help us improve our services by sharing your experience.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <label key={star} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={star}
                                            checked={formData.rating === String(star)}
                                            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                            className="sr-only peer"
                                        />
                                        <span className="text-3xl text-gray-300 peer-checked:text-yellow-400 transition-colors">★</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors h-32 resize-none"
                                placeholder="Tell us about your experience..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/25"
                        >
                            {status === "sending" ? "Sending..." : "Submit Feedback"}
                        </button>

                        {status === "success" && (
                            <p className="mt-4 text-green-600 text-center font-medium">Thank you for your feedback!</p>
                        )}
                        {status === "error" && (
                            <p className="mt-4 text-red-600 text-center font-medium">Something went wrong. Please try again.</p>
                        )}
                    </form>
                </div>
            </div>

            <Footer />
            <WhatsAppButton />
        </main>
    );
}
