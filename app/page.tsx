"use client";

import { SetStateAction, useState } from "react";
import Hero from "@/components/Hero";
import SiteHeader from "@/components/site-header";
import MedicineCard from "@/components/MedicineCard";
import medicines from "@/data/medicines.json";

export default function Home() {
  const [filteredMedicines, setFilteredMedicines] = useState(medicines);

  const handleSearch = (
    filtered: SetStateAction<
      {
        id: string;
        name: string;
        price: number;
        stock: number;
        pharmacyId: string;
        description: string;
      }[]
    >
  ) => {
    setFilteredMedicines(filtered);
  };

  return (
    <div className="">
      <SiteHeader />
      <Hero onSearch={handleSearch} />
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Available Medicines
        </h2>
        {filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No medicines found matching your search.
          </p>
        )}
      </section>
    </div>
  );
}
