'use client';
export default function Features() {
const features = [
{
title: "Secure & Reliable",
desc: "End-to-end encrypted voting system that ensures your vote counts.",
},
{
title: "No More Queues",
desc: "Vote from anywhere, anytime, without standing in long lines.",
},
{
title: "Transparent Results",
desc: "Instant and transparent results to build student trust.",
},
];


return (
<section id="features" className="py-16 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
{features.map((feature, i) => (
<div key={i} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:scale-105 transition">
<h3 className="text-2xl font-bold text-teal-400 mb-4">{feature.title}</h3>
<p className="text-gray-300">{feature.desc}</p>
</div>
))}
</section>
);
}