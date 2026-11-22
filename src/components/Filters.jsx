function Filters({
  domains,
  selectedDomain,
  setSelectedDomain,
  sortBy,
  setSortBy,
  openAccessOnly,
  setOpenAccessOnly,
}) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Domain filter */}
      <select
        value={selectedDomain}
        onChange={event => setSelectedDomain(event.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        {domains.map(domain => (
          <option key={domain} value={domain}>
            {domain === "All" ? "All Domains" : domain}
          </option>
        ))}
      </select>

      {/* Sort option */}
      <select
        value={sortBy}
        onChange={event => setSortBy(event.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="relevance">Sort: Most relevant</option>
        <option value="citations">Sort: Most cited</option>
        <option value="newest">Sort: Newest first</option>
        <option value="oldest">Sort: Oldest first</option>
      </select>

      {/* Open access checkbox */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={openAccessOnly}
          onChange={event => setOpenAccessOnly(event.target.checked)}
        />
        Open access only
      </label>
    </div>
  );
}

export default Filters;