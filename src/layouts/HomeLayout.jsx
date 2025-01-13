import { Outlet } from "react-router-dom";
import NavbarDefault from "../shared/Navbar";


const HomeLayout = () => {;

    return (
        <div
            className={`
                min-h-[200vh]
                bg-neutral-50 dark:bg-dark-background 
                text-neutral-900 dark:text-dark-text-primary
                transition-colors duration-300
            `}
        >
            
                <NavbarDefault />
           

            <main
            >
                <Outlet />
            </main>


        </div>
    );
};

export default HomeLayout;