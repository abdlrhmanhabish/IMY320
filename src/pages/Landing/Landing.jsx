// LANDING PAGE
// Author: Cleopatra K
// Date: 2026-08-08

import './Landing.css'

// these are for the floating summary cards
const stats=[
    {
        id: 1,
        number: '50K+',
        label: 'Learners'
    },
    {
        id: 2,
        number: '200+',
        label: 'Career Courses'
    },
    {
        id: 3,
        number: '10K+',
        label: 'Certificates'
    },
    
];

//these are cards for the benefits of our platform
const benefits=[
    {
        id: 1,
        title: 'Learn from experts'
    },
    {
        id: 2,
        title: 'Learn at your pace'
    },
    {
        id: 3,
        title: 'Practical skills'
    }, 
];

// these are the career skills we offer
const categories=[
    {
        id: 1,
        title: 'Technology'
    },
    {
        id: 2,
        title: 'Business'
    },
    {
        id: 3,
        title: 'Design'
    }, 
    {
        id: 4,
        title: 'Marketing'
    }, 
    {
        id: 5,
        title: 'Finance'
    }, 
    {
        id: 6,
        title: 'Communication'
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
        </main>
    )
}
