import axios from "axios";
import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState({ field: "name", order: "asc" });
  const usersPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = users
  .filter((user: any) =>
    [user.name, user.email, user.company.name]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => {
    const field = sortOrder.field as keyof typeof a;
    const aValue = String(a[field] ?? "");
    const bValue = String(b[field] ?? "");

    return sortOrder.order === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="w-full p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">User List</h1>
      <form className="flex items-center max-w-sm mx-auto mb-4">   
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
            <input
              type="text"
              id="simple-search"
              className="bg-gray-200 border border-gray-400 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by Name, Email, or Company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              required
            />
        </div>
      </form>
      {loading && (
        <div className="flex justify-center  h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      )}
      {error ? <p className="text-red-500 text-lg">{error}</p> : null}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full bg-gray-200 dark:bg-gray-800">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
          <thead className="text-xs text-gray-900 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 cursor-pointer" onClick={() => setSortOrder({ field: "name", order: sortOrder.order === "asc" ? "desc" : "asc" })}><span className='text-gray-200 text-lg'>⬍</span> Name</th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => setSortOrder({ field: "email", order: sortOrder.order === "asc" ? "desc" : "asc" })}><span className='text-gray-200 text-lg'>⬍</span> Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Address</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user :any) => (
              <tr key={user.id} className="bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.company.name}</td>
                <td className="px-6 py-4">{user.address.city}, {user.address.street}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <nav className="flex justify-center mt-4">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <button 
              className="px-3 py-2 border rounded-s-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <button 
                className={`px-3 py-2 border ${currentPage === index + 1 ? "bg-gray-500 text-white" : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button 
              className="px-3 py-2 border rounded-e-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
