import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  const linkSections = [
    {
      title: "Quick Links",
      links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"],
    },
    {
      title: "Need Help?",
      links: [
        "Delivery Information",
        "Return & Refund Policy",
        "Payment Methods",
        "Track your Order",
        "Contact Us",
      ],
    },
    {
      title: "Follow Us",
      links: ["Instagram", "Twitter", "Facebook", "YouTube"],
    },
  ];

  return (
    <footer className="bg-primary/20 text-gray-600 rounded-md w-full mt-3">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-300/60">
          {/* Brand / Description */}
          <div className="md:max-w-[40%]">
            <a href="/" aria-label="ZipBasket home" className="inline-block">
              {/* Use w-auto so logo keeps aspect ratio; h fixed */}
              <img
                className="h-[50px] w-auto object-contain"
                src={assets.zlogo}
                alt="ZipBasket logo"
              />
            </a>
            <p className="max-w-[410px] mt-6 text-sm leading-6 text-gray-500">
              ZipBasket is a one-stop destination for all your grocery needs. We
              offer fresh produce, pantry staples, and convenience items at
              competitive prices. Our user-friendly platform makes shopping easy
              and efficient so you can find everything you need in one place.
            </p>
          </div>

          {/* Link sections - responsive grid for predictable spacing */}
          <div className="w-full md:w-[55%]">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              aria-label="Footer links"
            >
              {linkSections.map((section, index) => (
                <nav key={index} aria-labelledby={`footer-section-${index}`}>
                  <h3
                    id={`footer-section-${index}`}
                    className="font-semibold text-base text-gray-900 mb-2"
                  >
                    {section.title}
                  </h3>
                  <ul className="text-sm space-y-1">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href="#"
                          className="hover:underline transition-colors"
                          aria-label={section.title + " - " + link}
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
          Copyright {new Date().getFullYear()} ©{" "}
          <a href="/" className="text-gray-700 hover:underline">
            ZipBasket
          </a>{" "}
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
