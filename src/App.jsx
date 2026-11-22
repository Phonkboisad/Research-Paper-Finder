import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import PaperCard from "./components/PaperCard";

// Optional free API key from the .env.local file (never upload that file)
const API_KEY = import.meta.env.VITE_OPENALEX_KEY;

// OpenAlex gives the abstract as { word: [positions] }.
// This puts every word back in its position to make normal text.
function getAbstract(invertedIndex) {
  if (!invertedIndex) {
    return "No abstract available.";
  }

  const words = [];

  for (const word in invertedIndex) {
    invertedIndex[word].forEach(position => {
      words[position] = word;
    });
  }

  return words.join(" ");
}

function App() {
  // 1. CREATE STATE
  const [searchText, setSearchText] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedDomain, setSelectedDomain] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [showingSaved, setShowingSaved] = useState(false);

  // Read saved papers from Local Storage when the app starts
  const [savedPapers, setSavedPapers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedPapers")) || [];
    } catch {
      return [];
    }
  });

  // 2. SAVE TO LOCAL STORAGE WHENEVER savedPapers CHANGES
  useEffect(() => {
    localStorage.setItem("savedPapers", JSON.stringify(savedPapers));
  }, [savedPapers]);

  // 3. SEARCH PAPERS USING THE OPENALEX API
  async function searchPapers() {
    if (searchText.trim() === "") {
      setError("Please enter a research topic.");
      return;
    }

    setLoading(true);
    setError("");
    setShowingSaved(false);
    setSelectedDomain("All");

    try {
      let apiURL =
        "https://api.openalex.org/works?search=" +
        encodeURIComponent(searchText) +
        "&per_page=24" +
        "&select=id,title,publication_year,authorships,primary_topic,open_access,abstract_inverted_index,cited_by_count,doi";

      if (API_KEY) {
        apiURL += "&api_key=" + API_KEY;
      }

      const response = await fetch(apiURL);

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      // Turn each API result into a simple paper object
      const simplePapers = data.results.map(work => ({
        id: work.id,
        title: work.title || "Title unavailable",
        year: work.publication_year || "Unknown",
        authors: work.authorships.slice(0, 3).map(a => a.author.display_name),
        domain: work.primary_topic?.field?.display_name || "Other",
        isOpenAccess: work.open_access?.is_oa || false,
        citations: work.cited_by_count || 0,
        abstract: getAbstract(work.abstract_inverted_index),
        link: work.open_access?.oa_url || work.doi || work.id,
      }));

      setPapers(simplePapers);
    } catch {
      setError("Could not load papers. Check your internet and try again.");
      setPapers([]);
    } finally {
      setLoading(false);
    }
  }

  // 4. SAVE OR REMOVE A PAPER
  function toggleSave(paper) {
    const alreadySaved = savedPapers.some(saved => saved.id === paper.id);

    if (alreadySaved) {
      setSavedPapers(savedPapers.filter(saved => saved.id !== paper.id));
    } else {
      setSavedPapers([...savedPapers, paper]);
    }
  }

  // 5. FILTER AND SORT THE PAPERS
  const currentPapers = showingSaved ? savedPapers : papers;

  // Make the domain list from the papers we have, e.g. ["All", "Computer Science", "Medicine"]
  const domains = ["All", ...new Set(currentPapers.map(paper => paper.domain))];

  let papersToShow = currentPapers
    .filter(paper => selectedDomain === "All" || paper.domain === selectedDomain)
    .filter(paper => !openAccessOnly || paper.isOpenAccess);

  if (sortBy === "citations") {
    papersToShow = [...papersToShow].sort((a, b) => b.citations - a.citations);
  } else if (sortBy === "newest") {
    papersToShow = [...papersToShow].sort((a, b) => b.year - a.year);
  } else if (sortBy === "oldest") {
    papersToShow = [...papersToShow].sort((a, b) => a.year - b.year);
  }

  // 6. SHOW THE PAGE
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-blue-900 px-5 py-8 text-center text-white">
        <h1 className="text-3xl font-bold md:text-4xl">Research Paper Finder</h1>
        <p className="mt-2 text-blue-100">Search real research papers with the OpenAlex API</p>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            onSearch={searchPapers}
            loading={loading}
            showingSaved={showingSaved}
            onToggleSaved={() => {
              setShowingSaved(!showingSaved);
              setSelectedDomain("All");
            }}
          />

          <Filters
            domains={domains}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
            sortBy={sortBy}
            setSortBy={setSortBy}
            openAccessOnly={openAccessOnly}
            setOpenAccessOnly={setOpenAccessOnly}
          />

          {/* Loading and error messages */}
          {loading && (
            <p className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
              Searching for papers...
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          {!loading && !error && (
            <p className="mt-4 text-sm text-slate-600">
              {showingSaved ? "Your saved papers: " : "Papers found: "}
              {papersToShow.length}
            </p>
          )}

          {/* Paper cards */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {papersToShow.map(paper => (
              <PaperCard
                key={paper.id}
                paper={paper}
                isSaved={savedPapers.some(saved => saved.id === paper.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;