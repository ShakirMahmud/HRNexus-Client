import { Outlet } from "react-router-dom";
import NavbarDefault from "../shared/Navbar";
import Footer from "../shared/Footer";


const HomeLayout = () => {
    ;

    return (
        <div>
            <NavbarDefault />
            <Outlet />
            <Footer/>
        </div>
    );
};

export default HomeLayout;