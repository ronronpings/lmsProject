import React from "react"
import HeroImg from  '../../assets/images/hero-4.png'
export const Hero = ()=>{
    return(
        <>
            <section className='section-1'>
                <div className='container '>
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <span className="tagline">Excellence in Learning</span>
                            
                            <h1 className="display-3 fw-bold">Learn Without Limits</h1>
                            <p className="lead">Explore thousands of courses taught by industry experts. Learn at your own pace, anytime.</p>
                            <a href="#courses" className="btn btn-white">Explore Courses</a>
                        </div>
                        <div className="col-md-6 text-center">
                            <img src={HeroImg} alt="Student Learning" className="img-fluid"/>
                        </div>
                    </div>            
                </div>
            </section>

            <section className='section-confidence'>
                <div className='container'>
                    <div className="confidence-content">
                        <h2 className="confidence-title">
                            Master <span className="text-muted">skills with confidence</span>
                        </h2>
                        <p className="confidence-description">
                            Learn from world-class instructors. Gain skills that matter and advance your career with confidence.
                        </p>
                    </div>
                </div>
            </section>
        </>
    )
}