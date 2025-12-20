import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVendors } from '../services/vendorService';

const VendorList = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        startDate: '',
        endDate: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 0
    });

    console.log(document.cookie)
    const fetchVendors = async () => {
        setLoading(true);
        try {
            const result = await getVendors(pagination.page, pagination.limit, filters);
            setVendors(result.data);
            setPagination(prev => ({ ...prev, total: result.total, totalPages: result.totalPages }));
        } catch (error) {
            console.error("Failed to fetch vendors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, [pagination.page, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
    };

    const clearFilters = () => {
        setFilters({ search: '', startDate: '', endDate: '' });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return 'badge badge-success';
            case 'Inactive': return 'badge badge-danger';
            case 'Pending': return 'badge badge-warning';
            default: return 'badge';
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Vendors</h1>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Manage your vendor relationships</div>
                </div>
                <button className="btn btn-primary">
                    + Add Vendor
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Search</label>
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by name or email..."
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div style={{ width: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>From Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div style={{ width: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>To Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <button className="btn btn-outline" onClick={clearFilters}>
                        Clear
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Vendor Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Joined Date</th>
                                <th>Revenue</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                                        Loading vendors...
                                    </td>
                                </tr>
                            ) : vendors.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        No vendors found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                vendors.map(vendor => (
                                    <tr key={vendor.id}>
                                        <td style={{ fontWeight: 500 }}>{vendor.name}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{vendor.email}</td>
                                        <td>
                                            <span className={getStatusBadge(vendor.status)}>
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td>{new Date(vendor.joinedDate).toLocaleDateString()}</td>
                                        <td>${vendor.revenue.toLocaleString()}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Link to={`/vendors/${vendor.id}`} className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && vendors.length > 0 && (
                    <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="btn btn-outline"
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-outline"
                                disabled={pagination.page === pagination.totalPages}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorList;
