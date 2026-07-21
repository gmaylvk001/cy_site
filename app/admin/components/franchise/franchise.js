import React, { useEffect, useState } from "react";

export default function FranchiseEnquiriesComponent() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const enquiriesPerPage = 10;

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/franchise-enquiry");
      const data = await response.json();
      if (data.success) {
        setEnquiries(data.data || []);
      } else {
        showAlert(data.message || "Failed to load franchise enquiries", "error");
      }
    } catch (error) {
      console.error("Error fetching franchise enquiries:", error);
      showAlert("Error fetching franchise enquiries", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000);
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      [item.name, item.email, item.phone, item.city, item.company, item.investment_range, item.start_time, item.occupation_type]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchLower));

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / enquiriesPerPage));
  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = filteredEnquiries.slice(indexOfFirst, indexOfLast);
  const startEntry = filteredEnquiries.length === 0 ? 0 : indexOfFirst + 1;
  const endEntry = Math.min(indexOfLast, filteredEnquiries.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Franchise Enquiries</h2>
        <div className="text-sm text-gray-600">
          Total: {enquiries.length}
        </div>
      </div>

      {alertMessage && (
        <div className={`mb-4 rounded-md p-3 text-white ${alertType === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {alertMessage}
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, city..."
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          >
            <option value="All">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-5 text-gray-600 shadow">Loading enquiries...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white p-4 shadow">
          {filteredEnquiries.length === 0 ? (
            <p className="text-center text-gray-600">No franchise enquiries found</p>
          ) : (
            <>
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="border-b border-gray-200 px-3 py-2">Name</th>
                    <th className="border-b border-gray-200 px-3 py-2">Phone</th>
                    <th className="border-b border-gray-200 px-3 py-2">Email</th>
                    <th className="border-b border-gray-200 px-3 py-2">City</th>
                    <th className="border-b border-gray-200 px-3 py-2">Investment Range</th>
                    <th className="border-b border-gray-200 px-3 py-2">Start Time</th>
                    <th className="border-b border-gray-200 px-3 py-2">Occupation</th>
                    <th className="border-b border-gray-200 px-3 py-2">Status</th>
                    <th className="border-b border-gray-200 px-3 py-2">Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEnquiries.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2">{item.name || "-"}</td>
                      <td className="px-3 py-2">{item.phone || "-"}</td>
                      <td className="px-3 py-2">{item.email || "-"}</td>
                      <td className="px-3 py-2">{item.city || "-"}</td>
                      <td className="px-3 py-2">{item.investment_range || "-"}</td>
                      <td className="px-3 py-2">{item.start_time || "-"}</td>
                      <td className="px-3 py-2">{item.occupation_type || "-"}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.status === "closed"
                            ? "bg-gray-200 text-gray-700"
                            : item.status === "contacted"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}>
                          {item.status || "new"}
                        </span>
                      </td>
                      <td className="px-3 py-2">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startEntry} to {endEntry} of {filteredEnquiries.length} entries
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`rounded-md border px-3 py-1.5 ${currentPage === 1 ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                  >
                    «
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`rounded-md border px-3 py-1.5 ${currentPage === i + 1 ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`rounded-md border px-3 py-1.5 ${currentPage === totalPages ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                  >
                    »
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}