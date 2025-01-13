import { Outlet } from "react-router-dom";
import NavbarDefault from "../shared/Navbar";

const HomeLayout = () => {
    return (
        <div>
            <div>

            <NavbarDefault/>
            </div>
            <Outlet/>            
        </div>
    );
};

export default HomeLayout;