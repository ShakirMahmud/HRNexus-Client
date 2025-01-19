import Banner from "./Banner";
import CoreValues from "./CoreValues";
import FAQSection from "./FAQSection";
import Services from "./Services";
import Test from "./Test";
import Testimonials from "./Testimonials";

const Home = () => {
    return (
        <div>
            <Banner/>
            <Services/>
            <Testimonials/>
            <CoreValues/>
            <FAQSection/>
        </div>
    );
};

export default Home;