// LANDING PAGE
// Author: Cleopatra K
// Date: 2026-08-08

import './Landing.css'
import React, { useState } from 'react';
import testimonialsData from '../../data/testimonials.json'
import heroImage from '../../assets/hero-career.jpg'




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
function Landing(){
    const handleExploreCourses= ()=> {
        console.log( 'Explore Courses clicked');
    };

    const handleExploreCertificates= ()=> {
        console.log( 'Explore Certificates clicked');
    };

    const handleJoinSkillUp= ()=> {
        console.log( 'Join SkillUp clicked');
    };

    // the basic Jakobs law UI of the landing page
    return(
        <main className='landing-page'>
            {/* Abdul is still working on the shared componenets */}

            {/* Hero section */}
            <section className='hero'>
                <div className='hero-content'>
                    <p className='section-label'></p>

                    <h1 className='hero-title'>
                        Learn skills. Build your career.
                    </h1>

                    <p className='hero-decription'>
                        Practical courses designed to help you grow and 
                        succeed in the workplace.
                    </p>

                    <button 
                        className='hero-button'
                        onClick={handleExploreCourses}>
                            Explore Courses
                        </button>
                </div>

                {/* image place holder section */}
                <div 
                    className='hero-image'
                    role='img'
                    aria-label='SkillUp learning platform visual'>

                        <span>Image Placeholder</span>
                    </div>
            </section>
        </main>
    )
}
