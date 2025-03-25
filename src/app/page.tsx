"use client";

import { useEffect, useState } from "react";

interface Repairman {
    name: string;
    phone: string;
    address: string;
    specialization: string;
    link: string;
}

export default function Home() {
    const [repairmen, setRepairmen] = useState<Repairman[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationFilter, setLocationFilter] = useState<string>("all");
    const [specializationFilter, setSpecializationFilter] =
        useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/sheets");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setRepairmen(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredRepairmen = repairmen.filter((person) => {
        const matchesLocation =
            locationFilter === "all" ||
            (locationFilter === "ha noi" &&
                person.address.toLowerCase().includes("hà nội")) ||
            (locationFilter === "ho chi minh" &&
                person.address.toLowerCase().includes("hồ chí minh"));

        const matchesSpecialization =
            specializationFilter === "all" ||
            (specializationFilter === "film" &&
                person.specialization.toLowerCase().includes("film")) ||
            (specializationFilter === "digital" &&
                person.specialization.toLowerCase().includes("digital"));

        return matchesLocation && matchesSpecialization;
    });

    const totalPages = Math.ceil(filteredRepairmen.length / itemsPerPage);
    const currentItems = filteredRepairmen.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-pulse text-2xl text-gray-800 dark:text-gray-200">
                    Đang tải dữ liệu...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-2xl text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-6 py-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
                        SỬA CAM
                    </h1>
                    <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
                        Danh sách các thợ sửa máy ảnh Film và Digital
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4">
                        <select
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="all">🌍 Tất cả khu vực</option>
                            <option value="ha noi">🏙️ Hà Nội</option>
                            <option value="ho chi minh">🌆 Hồ Chí Minh</option>
                        </select>

                        <select
                            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={specializationFilter}
                            onChange={(e) =>
                                setSpecializationFilter(e.target.value)
                            }
                        >
                            <option value="all">🔧 Tất cả chuyên môn</option>
                            <option value="film">📷 Máy Film</option>
                            <option value="digital">📸 Digital</option>
                        </select>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentItems.map((person, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                    {person.name}
                                </h2>
                                <div className="space-y-3">
                                    <p className="flex items-center text-gray-700 dark:text-gray-300">
                                        <span className="text-xl mr-3">📱</span>
                                        <a
                                            href={`tel:${person.phone}`}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline"
                                        >
                                            {person.phone}
                                        </a>
                                    </p>
                                    <p className="flex items-start text-gray-700 dark:text-gray-300">
                                        <span className="text-xl mr-3">📍</span>
                                        <span>{person.address}</span>
                                    </p>
                                    <p className="flex items-start text-gray-700 dark:text-gray-300">
                                        <span className="text-xl mr-3">🔧</span>
                                        <span>{person.specialization}</span>
                                    </p>
                                </div>
                                {person.link && (
                                    <div className="mt-6">
                                        <a
                                            href={person.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                                        >
                                            Xem trang cá nhân →
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                        ← Trước
                    </button>
                    <span className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                        Sau →
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-gray-600 dark:text-gray-300">
                        © 2024 Danh Sách Thợ Sửa Máy Ảnh. Tất cả quyền được bảo
                        lưu.
                    </p>
                </div>
            </footer>
        </div>
    );
}
