function SearchBar({ searchText, setSearchText, onSearch, loading, showingSaved, onToggleSaved }) {
  // Stop the page from refreshing, then search
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-blue-900">Search for Papers</h2>
      <p className="mt-2 text-sm text-slate-600">
        Try machine learning, climate change, cancer, or any research topic.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={searchText}
          onChange={event => setSearchText(event.target.value)}
          placeholder="Enter a research topic..."
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Search Papers
        </button>

        <button
          type="button"
          onClick={onToggleSaved}
          className="rounded-lg bg-slate-600 px-5 py-2.5 font-semibold text-white hover:bg-slate-700"
        >
          {showingSaved ? "Show Search Results" : "Show Saved"}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;