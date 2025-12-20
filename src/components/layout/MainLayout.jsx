import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
