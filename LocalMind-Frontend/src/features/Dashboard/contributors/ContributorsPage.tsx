const ContributorsPage = () => {
  return (
    <div style={{ padding: "2.5rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* Page Title */}
      <h1>Contributors </h1>

      {/* Introduction */}
      <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>
        This project is built by people like you.  
        Every contribution — big or small — helps this community grow.
      </p>

      <p style={{ marginTop: "0.5rem" }}>
        Whether you are a beginner or an experienced developer, you are welcome
        here. Collaboration makes us stronger 
      </p>

      <hr style={{ margin: "2rem 0" }} />

      {/* Contributors List */}
      <h2>Our Contributors</h2>

      <div style={{ marginTop: "1rem" }}>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h3>Your Name</h3>
          <p>Email: your.email@example.com</p>
          <p>
            GitHub:{" "}
            <a href="https://github.com/your-username" target="_blank">
              https://github.com/your-username
            </a>
          </p>
          <p>
            LinkedIn:{" "}
            <a href="https://linkedin.com/in/your-profile" target="_blank">
              https://linkedin.com/in/your-profile
            </a>
          </p>
          <p>
            Bio: Passionate developer who loves learning and contributing to
            open-source.
          </p>
          <p>Area of Contribution: Frontend / Documentation / Bug Fixes</p>
        </div>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      {/* How to Become a Contributor */}
      <h2>How to Become a Contributor </h2>

      <ol style={{ marginTop: "1rem", lineHeight: "1.8" }}>
        <li>Fork the repository</li>
        <li>Pick an issue or improve existing features</li>
        <li>Create a new branch</li>
        <li>Make your changes</li>
        <li>Submit a Pull Request</li>
      </ol>

      <p style={{ marginTop: "1rem" }}>
        No contribution is too small — even fixing a typo helps 
      </p>

      <hr style={{ margin: "2rem 0" }} />

      {/* Call to Action */}
      <h2>New Here? You’re Welcome </h2>

      <p style={{ marginTop: "0.5rem" }}>
        Beginners are encouraged to contribute.  
        This project is a safe space to learn, grow, and collaborate.
      </p>

      <p>
        If you’re unsure where to start, check the issues labeled{" "}
        <strong>“good first issue”</strong>.
      </p>

      <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
        Let’s build something amazing together 
      </p>
    </div>
  );
};

export default ContributorsPage;
