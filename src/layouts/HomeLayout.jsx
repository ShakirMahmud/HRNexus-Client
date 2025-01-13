import { Outlet } from "react-router-dom";
import NavbarDefault from "../shared/Navbar";


const HomeLayout = () => {
    ;

    return (
        <div>
            <NavbarDefault />
            <Outlet />
        </div>
    );
};

export default HomeLayout;