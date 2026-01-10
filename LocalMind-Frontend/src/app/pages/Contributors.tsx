import React, { useMemo, useState } from "react";
import { CONTRIBUTORS, type Contributor } from "../../data/contributors";
import s from "./contributors.module.css";

const REPO_ISSUE_NEW_URL = "https://github.com/NexGenStudioDev/LocalMind/issues/new";

function enc(x: string) {
  return encodeURIComponent(x);
}

function buildNewIssueUrl(c: Contributor) {
  const title = `Add contributor: ${c.name}`;

  const body = `Hi maintainers,
Please add me to the Contributors page.

Name: ${c.name}
Email: ${c.email}
GitHub: ${c.github}
LinkedIn: ${c.linkedin}
Bio: ${c.bio}
Area of contribution (optional): ${c.area ?? ""}
Tags (optional): ${(c.tags ?? []).join(", ")}

Notes:
- Beginners are welcome.
- No contribution is too small.
`;

  return `${REPO_ISSUE_NEW_URL}?title=${enc(title)}&body=${enc(body)}`;
}

export default function ContributorsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState("");
  const [area, setArea] = useState("");
  const [tags, setTags] = useState("");

  const list = CONTRIBUTORS;

  const issueUrl = useMemo(() => {
    const c: Contributor = {
      name: name.trim(),
      email: email.trim(),
      github: github.trim(),
      linkedin: linkedin.trim(),
      bio: bio.trim(),
      area: area.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    return c.name && c.email && c.github && c.linkedin && c.bio
      ? buildNewIssueUrl(c)
      : "";
  }, [name, email, github, linkedin, bio, area, tags]);

  return (
    <div className={s.cwrap}>
      <header className={s.chead}>
        <h1>Contributors</h1>
        <p className={s.csub}>
          This project grows because people like you show up and help. Beginners
          are welcome, and no contribution is too small.
        </p>
      </header>

      <section className={s.csec}>
        <h2>People who contributed</h2>

        <div className={s.cgrid}>
          {list.map((c) => (
            <article key={c.github + c.email} className={s.ccard}>
              <div className={s.ctop}>
                <h3 className={s.cname}>{c.name}</h3>
                {c.area ? <span className={s.cpill}>{c.area}</span> : null}
              </div>

              <p className={s.cbio}>{c.bio}</p>

              <div className={s.clinks}>
                <a href={`mailto:${c.email}`} target="_blank" rel="noreferrer">
                  {c.email}
                </a>
                <a href={c.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href={c.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>

              {c.tags && c.tags.length ? (
                <div className={s.ctags}>
                  {c.tags.map((t) => (
                    <span key={t} className={s.ctag}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className={s.csec}>
        <h2>How to become a contributor</h2>
        <ul className={s.clist}>
          <li>Pick an issue labeled “good first issue” (or any small task).</li>
          <li>Fork the repo, create a new branch, and make a focused change.</li>
          <li>Open a pull request and describe what you changed and why.</li>
          <li>Ask questions—collaboration helps everyone grow.</li>
        </ul>
      </section>

      <section className={s.csec}>
        <h2>Add your details</h2>

        <p className={s.csub}>
          Fill the fields below and click “Create request”. It will open a
          GitHub issue with your details prefilled.
        </p>

        <div className={s.cform}>
          <label>
            Name *
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </label>

          <label>
            Email *
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            GitHub profile link *
            <input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/username"
            />
          </label>

          <label>
            LinkedIn profile link *
            <input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://www.linkedin.com/in/username/"
            />
          </label>

          <label>
            Short bio *
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="2–3 lines about you"
            />
          </label>

          <label>
            Area of contribution (optional)
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Docs / Frontend / Backend / Design..."
            />
          </label>

          <label>
            Tags (optional, comma-separated)
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, typescript, ui"
            />
          </label>

          <div className={s.cactions}>
            <button
              className={s.cbtn}
              disabled={!issueUrl}
              onClick={() => window.open(issueUrl, "_blank", "noopener,noreferrer")}
              type="button"
              title={!issueUrl ? "Fill all required fields first" : "Open GitHub issue"}
            >
              Create request (opens GitHub)
            </button>

            <a
              className={s.clink}
              href={REPO_ISSUE_NEW_URL}
              target="_blank"
              rel="noreferrer"
            >
              Or open a blank issue
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
