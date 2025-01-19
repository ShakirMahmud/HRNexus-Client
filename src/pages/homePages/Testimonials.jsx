import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Typography, Button } from '@material-tailwind/react';
import 'swiper/css';
import 'swiper/css/pagination';
import img1 from '../../assets/10008828.jpg'
import img2 from '../../assets/8660809.jpg'
import img3 from '../../assets/9866636.jpg'
import img4 from '../../assets/woman-green-jacket-hat-with-word-hero-front.jpg'

const Testimonials = () => {
    const testimonials = [
        {
            name: "John Doe",
            position: "CEO, Company A",
            text: "This company has transformed our HR processes. Their solutions are innovative and effective!",
            image: img1
        },
        {
            name: "Jane Smith",
            position: "HR Manager, Company B",
            text: "The team is incredibly supportive and knowledgeable. I highly recommend their services!",
            image: img2
        },
        {
            name: "Michael Johnson",
            position: "CTO, Company C",
            text: "Their data-driven approach has helped us make informed decisions that improved our workforce management.",
            image: img3
        },
        {
            name: "Emily Davis",
            position: "Operations Director, Company D",
            text: "A fantastic partner in our HR journey. Their tools are user-friendly and efficient.",
            image: img4
        }
    ];

    return (
        <section className="py-12 px-4 bg-white dark:bg-dark-surface">
            <div className="container mx-auto text-center mb-8">
                <Typography 
                    variant="h2" 
                    className="text-neutral-800 dark:text-neutral-100 mb-4"
                >
                    What Our Clients Say
                </Typography>
                <Typography 
                    variant="lead" 
                    className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto"
                >
                    Hear from our satisfied clients about how we've helped them achieve their HR goals.
                </Typography>
            </div>

            <div className="flex justify-center">
                <Swiper
                    spaceBetween={30}
                    loop={true}
                    centeredSlides={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Autoplay, Pagination]}
                    className="w-full max-w-3xl"
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index} className="flex flex-col items-center p-6 bg-gray-100 dark:bg-dark-neutral-300 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
                            <div className="relative mb-4 flex items-center justify-center">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name} 
                                    className="h-24 w-24 rounded-full object-cover border-4 border-primary-500 shadow-md"
                                />
                            </div>
                            <Typography 
                                variant="h5" 
                                className="text-neutral-800 dark:text-neutral-100 mb-2 font-semibold text-center"
                            >
                                {testimonial.name}
                            </Typography>
                            <Typography 
                                variant="small" 
                                className="text-neutral-600 dark:text-neutral-300 mb-4 italic text-center"
                            >
                                {testimonial.position}
                            </Typography>
                            <Typography 
                                variant="paragraph" 
                                className="text-neutral-700 dark:text-neutral-200 text-center  "
                            >
                                "{testimonial.text}"
                            </Typography>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Testimonials;