import React, { useState } from "react";
import { MapPin, Search, Filter, ChevronRight } from "lucide-react";
import Sidebar from "../../components/Sidebar";

const PharmacyLocator = () => {
  const [pharmacies] = useState([
    {
      id: 1,
      name: "Halifax Pharmacy",
      address: "123 Main St, Halifax, NS",
      distance: "0.5 miles",
      open: true,
      hours: "8:00 AM - 10:00 PM",
    },
    {
      id: 2,
      name: "Downtown Drugstore",
      address: "456 Downtown Ave, Halifax, NS",
      distance: "1.2 miles",
      open: true,
      hours: "9:00 AM - 9:00 PM",
    },
    {
      id: 3,
      name: "24/7 Wellness Pharmacy",
      address: "789 Health St, Halifax, NS",
      distance: "2.0 miles",
      open: false,
      hours: "Open 24/7",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesSearch = pharmacy.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "open" && pharmacy.open) ||
      (selectedFilter === "closed" && !pharmacy.open);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar/>
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Pharmacy Locator
              </h1>
              <p className="text-gray-600">
                Find nearby pharmacies to fill your prescriptions
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pharmacies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Pharmacies</option>
                  <option value="open">Open Now</option>
                  <option value="closed">Closed</option>
                </select>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Pharmacy List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Nearby Pharmacies ({filteredPharmacies.length})
              </h2>
            </div>
            <div className="p-6">
              {filteredPharmacies.length > 0 ? (
                <div className="space-y-4">
                  {filteredPharmacies.map((pharmacy) => (
                    <div
                      key={pharmacy.id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {pharmacy.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {pharmacy.address}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                pharmacy.open
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {pharmacy.open ? "Open Now" : "Closed"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {pharmacy.distance} away
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Hours: {pharmacy.hours}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 text-blue-600 hover:text-blue-800">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pharmacies found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PharmacyLocator;
