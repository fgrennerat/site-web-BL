import { useEffect, useState } from "react";
import { disciplines } from "../data/disciplines";

const TOKEN_KEY = "admin_token";

const SLUGS = [
  { slug: "general", label: "Général (accueil)" },
  ...disciplines.map((d) => ({ slug: d.slug, label: `${d.name} — ${d.code}` })),
];

const COMBINING_MARKS = /[\u0300-\u036f]/g;

function slugify(label) {
  return (
    String(label)
      .toLowerCase()
      .normalize("NFD")
      .replace(COMBINING_MARKS, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function uniqueId(base, existingIds) {
  if (!existingIds.has(base)) return base;
  let i = 2;
  while (existingIds.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

async function api(path, token, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // réponse sans corps JSON (ex. 204/401 générique) — on garde le message par défaut
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

function putConfig(slug, token, patch) {
  return api(`/api/resources/${slug}/config`, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

function LoginGate({ onAuthed }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setChecking(true);
    setError(null);
    try {
      await api("/api/admin/check", input);
      sessionStorage.setItem(TOKEN_KEY, input);
      onAuthed(input);
    } catch {
      setError("Jeton invalide.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-velin px-6 py-24 text-encre">
      <form onSubmit={submit} className="mx-auto max-w-sm border border-encre/15 bg-white p-6">
        <h1 className="font-display text-2xl font-medium text-encre">Administration</h1>
        <p className="mt-2 text-sm text-ardoise">
          Entrez le jeton d'administration pour gérer les ressources.
        </p>
        <label className="mt-6 block">
          <span className="block font-mono text-[11px] uppercase tracking-widest text-ardoise">
            Jeton
          </span>
          <input
            type="password"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-1 w-full border border-encre/20 bg-white px-3 py-2 text-sm outline-none focus:border-bronze"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={checking || !input}
          className="mt-4 border border-encre bg-encre px-4 py-2 font-mono text-xs uppercase tracking-widest text-velin transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {checking ? "Vérification…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

function Card({ title, description, children }) {
  return (
    <section className="mt-6 border border-encre/15 bg-white p-5">
      <h2 className="font-mono text-xs uppercase tracking-widest text-ardoise">{title}</h2>
      {description && <p className="mt-1 text-xs text-ardoise/80">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Labeled({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs text-ardoise">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

// h-9 partout (inputs, select, boutons) pour que les lignes de formulaire
// s'alignent verticalement, quel que soit le champ.
const FIELD_HEIGHT = "h-9";
const inputClass = `${FIELD_HEIGHT} w-full border border-encre/20 bg-white px-3 text-sm outline-none focus:border-bronze`;
const textareaClass =
  "w-full border border-encre/20 bg-white px-3 py-1.5 text-sm outline-none focus:border-bronze";
const primaryButtonClass = `${FIELD_HEIGHT} inline-flex items-center border border-encre bg-encre px-3 font-mono text-xs uppercase tracking-widest text-velin transition-opacity hover:opacity-90 disabled:opacity-40`;
const dangerButtonClass = `${FIELD_HEIGHT} inline-flex items-center font-mono text-xs uppercase tracking-widest text-red-700 hover:underline disabled:opacity-40`;
const fileInputClass = `${FIELD_HEIGHT} w-full cursor-pointer border border-encre/20 bg-white text-sm leading-9 file:mr-3 file:h-9 file:cursor-pointer file:border-0 file:bg-velin-dark file:px-3 file:font-mono file:text-xs file:uppercase file:tracking-widest file:text-encre`;

function SectionSelect({ sections, value, onChange, id }) {
  return (
    <select id={id} value={value || ""} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      <option value="">Aucune section</option>
      {sections.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

// "hk"/"k"/"" (Général) — voir server/lib/resources.mjs. Sur un fichier ou
// un lien qui a une section, cette valeur n'est jamais lue (l'année de la
// section fait autorité) : on n'affiche donc ce select que quand il n'y a
// pas de section (voir les appelants).
function YearSelect({ value, onChange, id }) {
  return (
    <select id={id} value={value || ""} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      <option value="">Général</option>
      <option value="hk">HK — 1ère année</option>
      <option value="k">K — 2e année</option>
    </select>
  );
}

function Message({ message }) {
  if (!message) return null;
  return (
    <p className={`mt-3 text-sm ${message.type === "error" ? "text-red-700" : "text-sauge"}`}>
      {message.text}
    </p>
  );
}

function Dashboard({ token, onLogout }) {
  const [slug, setSlug] = useState(SLUGS[0].slug);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [teacher, setTeacher] = useState("");
  const [sections, setSections] = useState([]);
  const [newSectionLabel, setNewSectionLabel] = useState("");
  const [newSectionYear, setNewSectionYear] = useState("");
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: "", url: "", section: "", year: "" });
  const [fileEdits, setFileEdits] = useState({});
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadSection, setUploadSection] = useState("");
  const [message, setMessage] = useState(null);

  const load = () => {
    setLoading(true);
    setMessage(null);
    api(`/api/resources/${slug}`, token)
      .then((d) => {
        setData(d);
        setDescription(d.description || "");
        setTeacher(d.teacher || "");
        setSections(d.sections || []);
        setVideos(d.videos || []);
        setFileEdits(
          Object.fromEntries(
            (d.files || []).map((f) => [
              f.path,
              { title: f.title, section: f.section || "", year: f.year || "" },
            ])
          )
        );
      })
      .catch((err) => setMessage({ type: "error", text: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(load, [slug, token]);

  const notify = (text, type = "success") => setMessage({ type, text });

  // --- Description ---
  const saveDescription = async () => {
    try {
      await putConfig(slug, token, { description, teacher });
      notify("Description enregistrée.");
    } catch (err) {
      notify(err.message, "error");
    }
  };

  // --- Sections ---
  const saveSections = async (next) => {
    try {
      await putConfig(slug, token, { sections: next });
      setSections(next);
      notify("Sections enregistrées.");
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const addSection = () => {
    const label = newSectionLabel.trim();
    if (!label) return;
    const id = uniqueId(slugify(label), new Set(sections.map((s) => s.id)));
    const section = { id, label, order: sections.length + 1 };
    if (newSectionYear) section.year = newSectionYear;
    saveSections([...sections, section]);
    setNewSectionLabel("");
    setNewSectionYear("");
  };

  const updateSectionField = (id, field, value) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // Choix immédiat (select "Année") : on calcule et envoie le tableau
  // directement, même raison que pour commitVideoField plus bas.
  const commitSectionField = (id, field, value) => {
    const next = sections.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    saveSections(next);
  };

  // Glisser-déposer : l'ordre affiché = l'ordre stocké, recalculé (1, 2, 3…)
  // depuis la position dans la liste et sauvegardé immédiatement au drop.
  const [dragIndex, setDragIndex] = useState(null);

  const reorderSections = (from, to) => {
    if (from === to) return;
    const next = [...sections];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    saveSections(next.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const removeSection = (id) => {
    if (!confirm("Supprimer cette section ? Les fichiers/liens qui y étaient rattachés redeviendront sans section.")) return;
    saveSections(sections.filter((s) => s.id !== id));
  };

  // --- Vidéos ---
  // "year" ne compte que quand il n'y a pas de section (voir YearSelect) —
  // on ne le garde donc que dans ce cas, comme le fait déjà le serveur.
  const stripVideo = ({ title, url, section, year }) => {
    if (section) return { title, url, section };
    if (year) return { title, url, year };
    return { title, url };
  };

  const persistVideos = async (next) => {
    try {
      await putConfig(slug, token, { videos: next.map(stripVideo) });
      setVideos(next);
      notify("Liens enregistrés.");
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const addVideo = () => {
    if (!newVideo.title || !newVideo.url) return;
    persistVideos([...videos, newVideo]);
    setNewVideo({ title: "", url: "", section: "", year: "" });
  };

  // Frappe : juste l'état local (pas d'appel réseau par caractère tapé).
  const updateVideoField = (i, field, value) => {
    setVideos((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  };

  // Sortie de champ (titre/URL) : la frappe a déjà mis à jour `videos`, donc
  // le lire ici est sûr — le blur arrive toujours après le re-render du
  // dernier onChange. Le select (choix immédiat) calcule et envoie le
  // tableau directement, sans dépendre d'un setState pas encore appliqué.
  const saveVideos = () => persistVideos(videos);
  const commitVideoField = (i, field, value) => {
    persistVideos(videos.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  };
  const removeVideo = (i) => persistVideos(videos.filter((_, idx) => idx !== i));

  // --- Fichiers ---
  // "overrides" permet d'envoyer une valeur qui vient d'être choisie (ex.
  // section) sans dépendre d'un setFileEdits pas encore appliqué au moment
  // de l'appel (même raison que pour les vidéos ci-dessus).
  const updateFileEdit = (path, field, value) => {
    setFileEdits((prev) => ({ ...prev, [path]: { ...prev[path], [field]: value } }));
  };

  const saveFile = async (path, overrides = {}) => {
    const edit = { ...fileEdits[path], ...overrides };
    const payload = { title: edit.title };
    if (edit.section) payload.section = edit.section;
    else if (edit.year) payload.year = edit.year;
    try {
      await putConfig(slug, token, { files: { [path]: payload } });
      setFileEdits((prev) => ({ ...prev, [path]: edit }));
      notify("Fichier mis à jour.");
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const deleteFile = async (path) => {
    if (!confirm(`Supprimer définitivement "${path}" ?`)) return;
    try {
      await api(`/api/resources/${slug}/files/${encodeURIComponent(path)}`, token, { method: "DELETE" });
      notify("Fichier supprimé.");
      load();
    } catch (err) {
      notify(err.message, "error");
    }
  };

  // Upload par lot fait côté client : une requête par fichier, envoyées
  // l'une après l'autre (le serveur ne connaît que l'upload à un fichier).
  const upload = async (e) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;
    const uploaded = [];
    const errors = [];
    for (const file of uploadFiles) {
      const form = new FormData();
      form.append("file", file);
      if (uploadSection) form.append("section", uploadSection);
      try {
        await api(`/api/resources/${slug}/files`, token, { method: "POST", body: form });
        uploaded.push(file.name);
      } catch (err) {
        errors.push({ filename: file.name, error: err.message });
      }
    }
    if (errors.length === 0) {
      notify(`${uploaded.length} fichier(s) envoyé(s).`);
    } else {
      const detail = errors.map((e) => `${e.filename} (${e.error})`).join(", ");
      notify(`${uploaded.length} envoyé(s), ${errors.length} échec(s) : ${detail}`, uploaded.length > 0 ? "success" : "error");
    }
    setUploadFiles([]);
    setUploadSection("");
    load();
  };

  const files = data?.files || [];

  return (
    <div className="min-h-screen bg-velin px-6 py-12 text-encre">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-medium text-encre">
            Administration des ressources
          </h1>
          <button type="button" onClick={onLogout} className={dangerButtonClass}>
            Se déconnecter
          </button>
        </div>

        <label className="mt-6 block">
          <span className="block font-mono text-[11px] uppercase tracking-widest text-ardoise">
            Matière
          </span>
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className={`mt-1 ${inputClass}`}>
            {SLUGS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <Message message={message} />

        {loading && <p className="mt-6 text-sm italic text-ardoise">Chargement…</p>}

        {!loading && data && (
          <>
            <Card title="Description de la page">
              <Labeled label="Professeur">
                <input
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  onBlur={saveDescription}
                  placeholder="ex. M. Dupont"
                  className={inputClass}
                />
              </Labeled>
              <div className="mt-3">
                <Labeled label="Description">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={saveDescription}
                    rows={3}
                    className={textareaClass}
                  />
                </Labeled>
              </div>
            </Card>

            <Card
              title="Sections"
              description="Une section est purement organisationnelle : elle n'existe que dans la config, pas comme dossier sur le disque. Rattachez-y des fichiers ou des liens ci-dessous."
            >
              {sections.length === 0 && (
                <p className="text-sm italic text-ardoise">Aucune section pour l'instant.</p>
              )}
              <p className="mb-2 text-xs text-ardoise/80">
                Glissez une section par sa poignée (⠿) pour changer son ordre d'affichage.
              </p>
              <div className="space-y-2">
                {sections.map((s, idx) => (
                  <div
                    key={s.id}
                    draggable
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex !== null) reorderSections(dragIndex, idx);
                      setDragIndex(null);
                    }}
                    onDragEnd={() => setDragIndex(null)}
                    className={`flex items-center gap-2 border px-2 py-1.5 ${
                      dragIndex === idx ? "border-bronze bg-velin-dark/40" : "border-transparent"
                    }`}
                  >
                    <span
                      className="shrink-0 cursor-grab select-none text-ardoise active:cursor-grabbing"
                      aria-hidden="true"
                    >
                      ⠿
                    </span>
                    <div className="flex-1">
                      <Labeled label="Nom">
                        <input
                          value={s.label}
                          onChange={(e) => updateSectionField(s.id, "label", e.target.value)}
                          onBlur={() => saveSections(sections)}
                          className={inputClass}
                        />
                      </Labeled>
                    </div>
                    <div className="w-44 shrink-0">
                      <Labeled label="Année">
                        <YearSelect value={s.year} onChange={(val) => commitSectionField(s.id, "year", val)} />
                      </Labeled>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSection(s.id)}
                      className={`${dangerButtonClass} mt-5 shrink-0`}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-end gap-2 border-t border-encre/10 pt-4">
                <div className="flex-1">
                  <Labeled label="Nouvelle section">
                    <input
                      value={newSectionLabel}
                      onChange={(e) => setNewSectionLabel(e.target.value)}
                      placeholder="ex. Annales"
                      className={inputClass}
                    />
                  </Labeled>
                </div>
                <div className="w-44 shrink-0">
                  <Labeled label="Année">
                    <YearSelect value={newSectionYear} onChange={setNewSectionYear} />
                  </Labeled>
                </div>
                <button type="button" onClick={addSection} disabled={!newSectionLabel.trim()} className={primaryButtonClass}>
                  Créer
                </button>
              </div>
            </Card>

            <Card title="Documents" description={`${files.length} fichier(s), stockés à plat.`}>
              <form onSubmit={upload} className="flex flex-wrap items-start gap-2 border-b border-encre/10 pb-4">
                <div className="flex-1 basis-52">
                  <Labeled label="Fichiers">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setUploadFiles([...(e.target.files || [])])}
                      className={fileInputClass}
                    />
                  </Labeled>
                  {uploadFiles.length > 0 && (
                    <p className="mt-1 text-xs text-ardoise">{uploadFiles.length} fichier(s) sélectionné(s)</p>
                  )}
                </div>
                <div className="w-40 shrink-0">
                  <Labeled label="Section">
                    <SectionSelect sections={sections} value={uploadSection} onChange={setUploadSection} />
                  </Labeled>
                </div>
                <div className="mt-5">
                  <button type="submit" disabled={uploadFiles.length === 0} className={primaryButtonClass}>
                    Téléverser
                  </button>
                </div>
              </form>

              <div className="mt-4 space-y-3">
                {files.map((f) => {
                  const edit = fileEdits[f.path] || { title: f.title, section: f.section || "", year: f.year || "" };
                  return (
                    <div key={f.path} className="flex flex-wrap items-end gap-2 border-b border-encre/10 pb-3 last:border-b-0">
                      <div className="flex-1 basis-40">
                        <Labeled label={f.path}>
                          <input
                            value={edit.title}
                            onChange={(e) => updateFileEdit(f.path, "title", e.target.value)}
                            onBlur={() => saveFile(f.path)}
                            className={inputClass}
                          />
                        </Labeled>
                      </div>
                      <div className="w-40 shrink-0">
                        <Labeled label="Section">
                          <SectionSelect
                            sections={sections}
                            value={edit.section}
                            onChange={(val) => {
                              updateFileEdit(f.path, "section", val);
                              saveFile(f.path, { section: val });
                            }}
                          />
                        </Labeled>
                      </div>
                      {!edit.section && (
                        <div className="w-44 shrink-0">
                          <Labeled label="Année">
                            <YearSelect
                              value={edit.year}
                              onChange={(val) => {
                                updateFileEdit(f.path, "year", val);
                                saveFile(f.path, { year: val });
                              }}
                            />
                          </Labeled>
                        </div>
                      )}
                      <button type="button" onClick={() => deleteFile(f.path)} className={dangerButtonClass}>
                        Supprimer
                      </button>
                    </div>
                  );
                })}
                {files.length === 0 && <p className="text-sm italic text-ardoise">Aucun fichier.</p>}
              </div>
            </Card>

            <Card title="Liens">
              {videos.length === 0 && <p className="text-sm italic text-ardoise">Aucun lien.</p>}
              <div className="space-y-3">
                {videos.map((v, i) => (
                  <div key={i} className="flex flex-wrap items-end gap-2 border-b border-encre/10 pb-3 last:border-b-0">
                    <div className="flex-1 basis-40">
                      <Labeled label="Titre">
                        <input
                          value={v.title}
                          onChange={(e) => updateVideoField(i, "title", e.target.value)}
                          onBlur={saveVideos}
                          className={inputClass}
                        />
                      </Labeled>
                    </div>
                    <div className="flex-1 basis-40">
                      <Labeled label="URL">
                        <input
                          value={v.url}
                          onChange={(e) => updateVideoField(i, "url", e.target.value)}
                          onBlur={saveVideos}
                          className={inputClass}
                        />
                      </Labeled>
                    </div>
                    <div className="w-40 shrink-0">
                      <Labeled label="Section">
                        <SectionSelect
                          sections={sections}
                          value={v.section}
                          onChange={(val) => {
                            updateVideoField(i, "section", val);
                            commitVideoField(i, "section", val);
                          }}
                        />
                      </Labeled>
                    </div>
                    {!v.section && (
                      <div className="w-44 shrink-0">
                        <Labeled label="Année">
                          <YearSelect
                            value={v.year}
                            onChange={(val) => {
                              updateVideoField(i, "year", val);
                              commitVideoField(i, "year", val);
                            }}
                          />
                        </Labeled>
                      </div>
                    )}
                    <button type="button" onClick={() => removeVideo(i)} className={dangerButtonClass}>
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-2 border-t border-encre/10 pt-4">
                <div className="flex-1 basis-40">
                  <Labeled label="Titre">
                    <input
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className={inputClass}
                    />
                  </Labeled>
                </div>
                <div className="flex-1 basis-40">
                  <Labeled label="URL">
                    <input
                      value={newVideo.url}
                      onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                      className={inputClass}
                    />
                  </Labeled>
                </div>
                <div className="w-40 shrink-0">
                  <Labeled label="Section">
                    <SectionSelect
                      sections={sections}
                      value={newVideo.section}
                      onChange={(val) => setNewVideo({ ...newVideo, section: val })}
                    />
                  </Labeled>
                </div>
                {!newVideo.section && (
                  <div className="w-44 shrink-0">
                    <Labeled label="Année">
                      <YearSelect value={newVideo.year} onChange={(val) => setNewVideo({ ...newVideo, year: val })} />
                    </Labeled>
                  </div>
                )}
                <button
                  type="button"
                  onClick={addVideo}
                  disabled={!newVideo.title || !newVideo.url}
                  className={primaryButtonClass}
                >
                  Ajouter
                </button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setChecked(true);
      return;
    }
    api("/api/admin/check", stored)
      .then(() => setToken(stored))
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setChecked(true));
  }, []);

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (!checked) return null;
  if (!token) return <LoginGate onAuthed={setToken} />;
  return <Dashboard token={token} onLogout={logout} />;
}
