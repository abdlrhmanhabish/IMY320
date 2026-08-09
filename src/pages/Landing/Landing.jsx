// LANDING PAGE
// Author: Cleopatra K
// Date: 2026-08-08

import './Landing.css'
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import heroImage from '../../assets/hero-career.jpg'
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import microsoftLogo from '../../assets/logos/microsoft.svg';
import awsLogo from '../../assets/logos/aws.svg';
import googleLogo from '../../assets/logos/google.svg';
import metaLogo from '../../assets/logos/meta.svg';
import salesforceLogo from '../../assets/logos/salesforce.svg';


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
    const location = useLocation();

    const categories = ['All', 'Data', 'Finance', 'Development', 'Management'];

    const filteredCourses = courses.filter(
    (course) => selectedCategory === 'All' || course.category === selectedCategory
    );

    // the basic Jakobs law UI of the landing page
    return(
        <main className="landing-page">
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
                        <Button href="/courses" variant="primary" size="lg">
                        Explore Courses
                        </Button>
                        <Button 
                            to={{
                                pathname: location.pathname,
                                search: '?auth=signup'
                            }} 
                            variant="secondary" 
                            size="lg">
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

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="how-it-works-section">
                <div className="container">
                    <h2>How SkillsUp Works</h2>
                    <p className="subtitle">Four steps to building skills that count</p>

                    <div className="steps-grid">
                        <div className="step-card">
                            <span className="step-number">1</span>
                            <h3>Pick a Path</h3>
                            <p>Select a goal-oriented career path instead of guessing random courses.</p>
                        </div>

                        <div className="step-card">
                            <span className="step-number">2</span>
                            <h3>Bite-Sized Modules</h3>
                            <p>Study in short, focused evening modules built around working schedules.</p>
                        </div>

                        <div className="step-card">
                            <span className="step-number">3</span>
                            <h3>Build a Project</h3>
                            <p>Complete a practical project reviewed by industry practitioners.</p>
                        </div>
                        
                        <div className="step-card">
                            <span className="step-number">4</span>
                            <h3>Show Employers</h3>
                            <p>Share your certificate and completed project link directly on your CV.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* COURSES CATALOGUE */}
            <section id="courses" className="courses-section container">
                <h2>Featured Courses</h2>
                <p className="subtitle">Practical courses designed for real workplace demands</p>

                <div className="category-tabs">
                    {categories.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                    >
                        {cat}
                    </button>
                    ))}
                </div>

                <div className="courses-grid">
                    {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <Card
                        key={course.id}
                        eyebrow={course.category}
                        title={course.title}
                        to={`/courses/${course.id}`}
                        footer={
                            <div className="card-footer-content">
                            <span className="price">{course.price}</span>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={(event) => {
                                event.preventDefault();
                                navigate({
                                    pathname: location.pathname,
                                    search: `?auth=signup&enroll=${course.id}`
                                });
                                }}
                            >
                                Enroll
                            </Button>
                            </div>
                        }
                        >
                        <p className="instructor-info">
                            {course.instructor} • <span>{course.role}</span>
                        </p>
                        <div className="course-details">
                            <span>★ {course.rating} ({course.reviews})</span>
                            <span>{course.duration}</span>
                            <span>{course.level}</span>
                        </div>
                        </Card>
                    ))
                    ) : (
                    <p className="no-results">No courses match your search criteria.</p>
                    )}
                </div>

                {/* EXPLORE MORE COURSES ACTION */}
                <div className="explore-more-container">
                    <Button href="/courses" variant="secondary" size="lg">
                        Explore All Courses →
                    </Button>
                </div>
            </section>
        </main>
    )
}
