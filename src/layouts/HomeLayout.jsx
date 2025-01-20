import { Outlet } from "react-router-dom";
import NavbarDefault from "../shared/Navbar";
import Footer from "../shared/Footer";
import { useEffect } from "react";


const HomeLayout = () => {
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[])

    return (
        <div>
            <NavbarDefault />
            <Outlet />
            <Footer/>
        </div>
    );
};

export default HomeLayout;