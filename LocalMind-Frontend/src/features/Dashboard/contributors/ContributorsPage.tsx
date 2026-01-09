import React, { useState } from "react";

type Contributor = {
  name: string;
  github: string;
  linkedin: string;
  role: string;
};

const ContributorsPage = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [form, setForm] = useState<Contributor>({
    name: "",
    github: "",
    linkedin: "",
    role: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addContributor = () => {
    if (!form.name || !form.github) {
      alert("Name and GitHub are required");
      return;
    }
    setContributors([...contributors, form]);
    setForm({ name: "", github: "", linkedin: "", role: "" });
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>
      {/* HERO */}
      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#4f46e5)",
          padding: "2.5rem",
          borderRadius: "18px",
          color: "white",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem" }}>Contributors 💙</h1>
        <p>
          Built by people like you. Every contribution — big or small — matters.
        </p>
      </div>

      {/* ADD CONTRIBUTOR FORM */}
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "14px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          marginBottom: "2.5rem",
        }}
      >
        <h2>Add Yourself</h2>

        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="github"
          placeholder="GitHub Profile URL"
          value={form.github}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="linkedin"
          placeholder="LinkedIn Profile URL"
          value={form.linkedin}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="role"
          placeholder="Area of Contribution (Frontend, Docs, etc.)"
          value={form.role}
          onChange={handleChange}
          style={inputStyle}
        />

        <button onClick={addContributor} style={buttonStyle}>
          ➕ Add Contributor
        </button>
      </div>

      {/* CONTRIBUTORS LIST */}
      <h2>Our Contributors</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginTop: "1rem",
        }}
      >
        {contributors.map((c, index) => (
          <div key={index} style={cardStyle}>
            <h3>{c.name}</h3>

            <div style={{ marginTop: "0.5rem" }}>
              <a href={c.github} target="_blank" rel="noreferrer" style={link}>
                GitHub
              </a>
              {c.linkedin && (
                <a
                  href={c.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={link}
                >
                  LinkedIn
                </a>
              )}
            </div>

            {c.role && <span style={tag}>{c.role}</span>}
          </div>
        ))}
      </div>

      {/* HOW TO CONTRIBUTE */}
      <div style={{ marginTop: "3rem" }}>
        <h2>How to Become a Contributor</h2>
        <ol style={{ lineHeight: "1.8" }}>
          <li>Fork the repository</li>
          <li>Pick an issue or improve a feature</li>
          <li>Create a new branch</li>
          <li>Make your changes</li>
          <li>Submit a Pull Request 🎉</li>
        </ol>
      </div>
    </div>
  );
};

/* ---------- STYLES ---------- */

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.6rem",
  marginTop: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "1.2rem",
  background: "#2563eb",
  color: "#fff",
  padding: "0.6rem 1.4rem",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 600,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const link: React.CSSProperties = {
  marginRight: "12px",
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 500,
};

const tag: React.CSSProperties = {
  display: "inline-block",
  marginTop: "0.8rem",
  background: "#eef2ff",
  color: "#4338ca",
  padding: "0.25rem 0.7rem",
  borderRadius: "999px",
  fontSize: "0.75rem",
};

export default ContributorsPage;
