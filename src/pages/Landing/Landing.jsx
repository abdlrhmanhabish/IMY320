// LANDING PAGE
// Author: Cleopatra K
// Date: 2026-08-08

import './Landing.css'
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import testimonialsData from '../../data/testimonials.json'
import heroImage from '../../assets/hero-career.jpg'
import PageShell from '../../components/layout/PageShell.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Carousel from '../../components/ui/Carousel.jsx';


// these are the career skills we offer
const courses=[
    {
        id: 1,
        title: "SQL for People Who Write Reports",
        instructor: "Thandi Mokoena",
        role: "Analytics Lead",
        rating: "4.8",
        reviews: "1,240",
        duration: "9 hours",
        level: "Beginner",
        price: "R 690",
        category: "Data",
    },
    {
        id: 2,
        title: "Spreadsheets That Survive Who Audit",
        instructor: "Devan Pillay",
        role: "Finance Manager",
        rating: "4.7",
        reviews: "880",
        duration: "6 hours",
        level: "Beginner",
        price: "R 540",
        category: "Finance",

    },
    {
        id: 3,
        title: "React for the First Real Project",
        instructor: "Hannah Meyer",
        role: "Senior Engineer",
        rating: "4.9",
        reviews: "2,110",
        duration: "14 hours",
        level: "Intermediate",
        price: "R 890",
        category: "Development",
    }, 
    {
        id: 4,
        title: "Running a Delivery Without Chaos",
        instructor: "Tebogo Maseko",
        role: "Delivery Manager",
        rating: "4.6",
        reviews: "460",
        duration: "8 hours",
        level: "Intermediate",
        price: "R 640",
        category: "Management",
    }, 
];


// the minimal functionality of our page
export default function Landing(){
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigate = useNavigate();

    const categories = ['All', 'Data', 'Finance', 'Development', 'Management'];

    const filteredCourses = courses.filter(
    (course) => selectedCategory === 'All' || course.category === selectedCategory
    );

    // the basic Jakobs law UI of the landing page
    return(
        <PageShell>
            {/* Abdul is still working on the shared componenets */}

            {/* HERO SECTION */}
            <section className="hero container">
                <div className="hero-content">
                    <span className="section-label">
                        Career Skills Training
                    </span>
                    <h1 className="hero-title">
                        Learn skills. Build your career.
                    </h1>
                    <p className="hero-description">
                        Practical, short courses taught by people who do the work. Every learning path ends in a real project you can show an employer.
                    </p>

                    <div className="hero-buttons">
                        <Button href="#courses" variant="primary" size="lg">
                        Explore Courses
                        </Button>
                        <Button to="/auth" variant="secondary" size="lg">
                        Join SkillsUp
                        </Button>
                    </div>

                    <div className="hero-stats">
                        <div>
                            <strong>4,200+</strong> Learners
                        </div>
                        <div>
                            <strong>78%</strong> Finish Rate
                        </div>
                        <div>
                            <strong>4.8 ★</strong> Rating
                        </div>
                    </div>
                </div>

                <div className="hero-image-container">
                    <img 
                        src={heroImage} 
                        alt="Professional working on career skills visual" 
                        className="hero-img"
                    />
                </div>
            </section>
        </PageShell>
    )
}
