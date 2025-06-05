"use client";

import Image from "next/image";

export default function AboutUs() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        About ElectroSaida
      </h1>

      {/* Intro Section with Logo */}
<section className="mb-16 text-center">
  <div className="flex flex-col items-center justify-center mb-6">
    <Image
      src="/assets/logos/icon_no_white_edges.png" // <-- Make sure this path is correct
      alt="ElectroSaida Logo"
      width={140}
      height={140}
      className="mb-4"
    />
    <h1 className="text-3xl sm:text-4xl font-bold text-blue-700">
      Welcome to ElectroSaida
    </h1>
  </div>
  <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
    At <span className="font-semibold text-blue-700">ElectroSaida</span>,
    We&rsquo;re on a mission to build the future—one chip at a time. Based in
    the heart of Saida, Lebanon, we are your go-to destination for
    high-quality electronics components, development boards, and
    educational kits. We proudly support students, makers, engineers, and
    dreamers working on tomorrow’s technology today.
  </p>

</section>


      {/* Values Section */}
      <section className="grid md:grid-cols-2 gap-10 items-start mb-20">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            Our Vision
          </h2>
          <p className="text-gray-700">
            To become Lebanon’s leading supplier of electronic components and a
            hub for innovation, prototyping, and embedded technology.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            Our Mission
          </h2>
          <p className="text-gray-700">
            To empower makers, students, and tech professionals with reliable,
            affordable, and cutting-edge components—backed by expert support and
            community engagement.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-blue-50 rounded-xl p-8 mb-20">
        <h2 className="text-2xl font-semibold mb-6 text-blue-800 text-center">
          What We Stand For
        </h2>
        <ul className="grid sm:grid-cols-2 gap-4 text-gray-700 text-lg list-disc list-inside">
          <li><strong>Innovation:</strong> We stay ahead with the latest tech.</li>
          <li><strong>Support:</strong> We guide every step of your project.</li>
          <li><strong>Community:</strong> We grow Lebanon’s tech ecosystem.</li>
          <li><strong>Trust:</strong> Genuine parts. Honest service.</li>
        </ul>
      </section>

      {/* Services Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold mb-6 text-blue-800 text-center">
          What We Offer
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
          {[
            "Microcontrollers (Arduino, ESP32, STM32)",
            "Sensors & Modules (Motion, GPS, WiFi, etc.)",
            "Robotics & Maker Kits",
            "Basic Electronics (LEDs, Resistors, etc.)",
            "Custom Orders for Institutions",
            "Local Delivery & Technical Support",
            "3D Printing & Custom Design Services", // 🆕
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Contact and Location */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Visit Us</h2>
        <p className="text-gray-700 mb-2">📍 Saida, Lebanon</p>
        <p className="text-gray-700 mb-2">📞 +961 71 109 468</p>
        <p className="text-gray-700 mb-2">📧 electro.saida.lb@gmail.com</p>
        <p className="text-gray-700">📱 Instagram: @electrosaida</p>
      </section>
    </main>
  );
}
