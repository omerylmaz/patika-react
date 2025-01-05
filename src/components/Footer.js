export default function Footer(){
    return(
        <footer className="bg-dark text-light py-3 mt-5">
            <div className="container text-center">
                <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">&copy; 2024 E-Ticaret Sitesi.</p>
                        </div>
                        <div className="col-md-6">
                            <ul className="list-inline -mb-0">
                                    <li className="list-inline-item">
                                        <a href="/" className="text-light text-decoration-none">Home</a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="/cart" className="text-light text-decoration-none">Cart</a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="/profile" className="text-light text-decoration-none">Profile</a>
                                    </li>
                            </ul>
                        </div>
                </div>
            </div>
        </footer>
    );
}