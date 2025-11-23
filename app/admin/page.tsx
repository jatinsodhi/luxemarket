import { AdminDashboard } from '../../views/AdminDashboard';
import { AdminRoute } from '../../components/AdminRoute';

export default function Page() {
    return (
        <AdminRoute>
            <AdminDashboard />
        </AdminRoute>
    );
}
