import React from "react";
import Navbar from "../components/Navbar"; // Adjust path if necessary
import "./Style/About.css";
// import Navbar from "../components/nav"; 

const About = () => {
  return (
    <>
      <Navbar />

      <div className="about">
        <section className="about-header">
          <h1>About JUST Journal</h1>
          <p>Innovating Scientific Publishing for a Smarter Academic Future</p>
        </section>

        <section className="about-content">
          <div className="content-block">
            <h2>Overview</h2>
            <p>
              JUST Journal is an innovative online scientific publishing
              platform designed to facilitate the dissemination of high-quality
              research while streamlining the peer-review and publication
              workflow. As a fully digital, web-based journal management system,
              it provides researchers worldwide with an efficient channel to
              publish their scholarly work and stay updated through automated
              research notifications.
            </p>
          </div>

          <div className="content-block">
            <h2>A Digital Transformation in Academic Publishing</h2>
            <p>
              The platform represents a transformative advancement in scholarly
              communication, offering a comprehensive and digitally native
              ecosystem that revolutionizes how researchers disseminate and
              access scientific knowledge. By integrating cutting-edge
              technologies with user-centric design principles, JUST Journal
              enhances transparency, efficiency, and collaboration across the
              entire publication process—from submission to peer review, final
              publication, and beyond.
            </p>
          </div>

          <div className="content-block">
            <h2>Technology & Workflow Automation</h2>
            <p>
              As a cloud-based, fully digital system, JUST Journal eliminates
              the inefficiencies of traditional publishing models. Its automated
              workflows reduce delays and streamline manuscript handling,
              significantly shortening the time between submission and
              publication. Features such as real-time tracking, intelligent
              notifications, and integrated version control create a responsive,
              researcher-friendly environment.
            </p>
          </div>

          <div className="content-block">
            <h2>Commitment to Academic Quality</h2>
            <p>
              While technologically advanced, JUST Journal upholds rigorous
              academic standards. Its peer-review structure maintains scholarly
              integrity while improving speed and communication. Additional
              features enhance research visibility, long-term accessibility, and
              impact measurement, ensuring each publication reaches its fullest
              academic potential.
            </p>
          </div>

          <div className="content-block">
            <h2>Real-Time Research Engagement</h2>
            <p>
              A key innovation of JUST Journal is its advanced notification
              ecosystem, which keeps researchers constantly informed about
              submission updates, newly published studies, and developments
              within their fields of interest. This fosters deeper engagement
              and accelerates the pace of scientific discourse.
            </p>
          </div>

          <div className="content-block">
            <h2>Accessibility & Global Impact</h2>
            <p>
              Designed to democratize scientific publishing, the platform
              removes geographical and financial barriers that traditionally
              limit participation—especially for researchers in developing
              regions or under-resourced institutions. By offering an intuitive
              interface and robust author support, JUST Journal empowers
              scholars at all career stages to contribute to and benefit from
              global scientific exchange.
            </p>
          </div>

          <div className="content-block">
            <h2>A Future-Ready Solution</h2>
            <p>
              In an era where rapid dissemination of research is essential for
              addressing global health, environmental, and technological
              challenges, JUST Journal provides a timely solution that aligns
              with the evolving needs of the scientific community—advancing
              academic excellence and collaborative knowledge-building.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
