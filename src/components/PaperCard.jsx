function PaperCard({ paper, isSaved, onToggleSave }) {
  // Show only the first 200 characters of the abstract
  const shortAbstract =
    paper.abstract.length > 200 ? paper.abstract.slice(0, 200) + "..." : paper.abstract;

  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className="mb-2 w-fit rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800">
        {paper.domain}
      </span>

      <h3 className="font-bold text-slate-900">{paper.title}</h3>

      <p className="mt-2 text-sm text-slate-600">
        Authors: {paper.authors.length > 0 ? paper.authors.join(", ") : "Unknown"}
      </p>

      <p className="mt-1 text-sm text-slate-600">
        Year: {paper.year} · Cited by {paper.citations}
      </p>

      <p className="mt-3 text-sm text-slate-700">{shortAbstract}</p>

      <a
        href={paper.link}
        target="_blank"
        rel="noopener"
        className="mt-3 mb-4 text-sm font-semibold text-blue-600 hover:underline"
      >
        {paper.isOpenAccess ? "Read Free Paper" : "View Paper"}
      </a>

      <button
        onClick={() => onToggleSave(paper)}
        className={
          isSaved
            ? "mt-auto rounded-lg bg-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            : "mt-auto rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        }
      >
        {isSaved ? "Remove Saved Paper" : "Save Paper"}
      </button>
    </article>
  );
}

export default PaperCard;