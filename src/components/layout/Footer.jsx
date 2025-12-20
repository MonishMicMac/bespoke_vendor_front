const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
            <div className="text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} SellerCRM. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
