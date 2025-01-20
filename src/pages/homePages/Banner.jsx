import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Typography, Button } from '@material-tailwind/react';
import img1 from '../../assets/front-view-group-young-freelancers-office-have-conversation-smiling-min.jpg'
import img2 from '../../assets/modern-equipped-computer-lab-min.jpg'
import img3 from '../../assets/people-taking-part-business-event-min.jpg'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Banner = () => {
    const slides = [
        {
            image: img1,
            title: 'Empowering Workforce Excellence',
            description: 'Transforming workplace productivity through innovative HR solutions',
            buttonText: 'Explore Our Services',
            link: '/services'
        },
        {
            image: img2,
            title: 'Streamline Your Human Resources',
            description: 'Efficient management, seamless operations, and employee growth',
            buttonText: 'Learn More',
            link: '/about'
        },
        {
            image: img3,
            title: 'Data-Driven HR Management',
            description: 'Leverage analytics to make informed decisions and boost performance',
            buttonText: 'View Insights',
            link: '/insights'
        }
    ];

    return (
        <div className="w-full relative">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                loop={true}
                
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full h-[500px] md:h-[600px] lg:h-[700px]"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index} className="relative">
                        {/* Background Image with Overlay */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ 
                                backgroundImage: `url(${slide.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {/* Dark Overlay */}
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex items-center justify-center h-full">
                            <div className="text-center max-w-2xl px-4">
                                <Typography
                                    variant="h1"
                                    className="text-white mb-4 text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg"
                                >
                                    {slide.title}
                                </Typography>
                                <Typography
                                    variant="lead"
                                    className="text-neutral-200 mb-6 text-base md:text-lg lg:text-xl"
                                >
                                    {slide.description}
                                </Typography>
                                <Button
                                    color="blue"
                                    size="lg"
                                    className="dark:bg-primary-600 dark:hover:bg-primary-500"
                                >
                                    {slide.buttonText}
                                </Button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;