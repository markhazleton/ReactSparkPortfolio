import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSEO } from "../contexts/useSEO";
import { useDataTable } from "../hooks/useDataTable";
import { Song, SongSortColumn } from "../models/Song";
import { exportToCsv, exportToJson, fetchAllSongs } from "../services/SongService";

const DataTables: React.FC = () => {
  const { setTitle, setDescription } = useSEO();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [pageSize, setPageSize] = useState(10);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    songs.forEach((song) => {
      song.categories
        ?.split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((category) => categories.add(category));
    });
    return Array.from(categories).sort((left, right) => left.localeCompare(right));
  }, [songs]);

  const availableChannels = useMemo(() => {
    const channelCounts = new Map<string, number>();
    songs.forEach((song) => {
      channelCounts.set(song.channel, (channelCounts.get(song.channel) ?? 0) + 1);
    });
    return Array.from(channelCounts.entries())
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([channel]) => channel);
  }, [songs]);

  const scopedSongs = useMemo(() => {
    return songs.filter((song) => {
      const categoryMatch =
        selectedCategory === "all" ||
        song.categories
          ?.split(",")
          .map((item) => item.trim())
          .includes(selectedCategory);
      const channelMatch = selectedChannel === "all" || song.channel === selectedChannel;
      return Boolean(categoryMatch) && channelMatch;
    });
  }, [songs, selectedCategory, selectedChannel]);

  const table = useDataTable(scopedSongs, pageSize);

  useEffect(() => {
    setTitle("Data Tables | BootstrapSpark");
    setDescription("Interactive data tables with sorting, search, pagination, and export.");
  }, [setDescription, setTitle]);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        const loaded = await fetchAllSongs();
        setSongs(loaded);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Failed to load songs.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  const triggerDownload = (content: string, fileName: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const sortIcon = useMemo(() => {
    return table.sortDirection === "asc" ? "▲" : "▼";
  }, [table.sortDirection]);

  const stats = useMemo(() => {
    const totalViews = scopedSongs.reduce((sum, song) => sum + song.viewCount, 0);
    const averageViews = scopedSongs.length ? Math.round(totalViews / scopedSongs.length) : 0;
    const topSong = [...scopedSongs].sort((left, right) => right.viewCount - left.viewCount)[0];
    const visibleViews = table.pageSongs.reduce((sum, song) => sum + song.viewCount, 0);
    return {
      totalSongs: scopedSongs.length,
      totalViews,
      averageViews,
      topSong,
      visibleViews,
    };
  }, [scopedSongs, table.pageSongs]);

  const pageNumbers = useMemo(() => {
    const radius = 2;
    const start = Math.max(1, table.currentPage - radius);
    const end = Math.min(table.totalPages, table.currentPage + radius);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [table.currentPage, table.totalPages]);

  const renderSortButton = (label: string, column: SongSortColumn) => (
    <button
      type="button"
      className="btn btn-link p-0 text-decoration-none text-reset fw-semibold"
      onClick={() => table.setSort(column)}
    >
      {label} {table.sortColumn === column ? sortIcon : ""}
    </button>
  );

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="py-4">
      <div className="p-4 p-lg-5 mb-4 rounded-4 border bg-body-tertiary shadow-sm">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <p className="text-uppercase text-body-secondary small mb-1 fw-semibold">Showcase</p>
            <h1 className="mb-2">YouTube Top Songs</h1>
            <p className="text-body-secondary mb-0">
              Premium Bootstrap data table patterns with faceted filtering, sticky context, and
              export-ready analytics.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => triggerDownload(exportToCsv(scopedSongs), "songs.csv", "text/csv")}
            >
              Export CSV
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                triggerDownload(exportToJson(scopedSongs), "songs.json", "application/json")
              }
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <p className="text-body-secondary mb-2 small">Scoped Songs</p>
              <p className="display-6 fw-semibold mb-1">{stats.totalSongs}</p>
              <p className="mb-0 text-body-secondary small">Records matching current filters</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <p className="text-body-secondary mb-2 small">Total Views</p>
              <p className="display-6 fw-semibold mb-1">{stats.totalViews.toLocaleString()}</p>
              <p className="mb-0 text-body-secondary small">Across currently scoped records</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <p className="text-body-secondary mb-2 small">Average Views</p>
              <p className="display-6 fw-semibold mb-1">{stats.averageViews.toLocaleString()}</p>
              <p className="mb-0 text-body-secondary small">Per song in this scope</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <p className="text-body-secondary mb-2 small">Top Song</p>
              <p className="fw-semibold mb-1 text-truncate">{stats.topSong?.title ?? "-"}</p>
              <p className="mb-0 text-body-secondary small">
                {stats.topSong?.viewCountFormatted ?? "No data"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-lg-5">
              <label htmlFor="song-search" className="form-label fw-semibold">
                Search
              </label>
              <div className="input-group">
                <span className="input-group-text">Filter</span>
                <input
                  id="song-search"
                  className="form-control"
                  placeholder="Search songs, channels, categories"
                  value={table.searchQuery}
                  onChange={(event) => table.setSearchQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label htmlFor="song-category" className="form-label fw-semibold">
                Category
              </label>
              <select
                id="song-category"
                className="form-select"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <label htmlFor="song-channel" className="form-label fw-semibold">
                Channel
              </label>
              <select
                id="song-channel"
                className="form-select"
                value={selectedChannel}
                onChange={(event) => setSelectedChannel(event.target.value)}
              >
                <option value="all">All channels</option>
                {availableChannels.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-1">
              <label htmlFor="song-page-size" className="form-label fw-semibold">
                Rows
              </label>
              <select
                id="song-page-size"
                className="form-select"
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <p className="text-body-secondary mb-0">
          Showing <span className="fw-semibold text-body">{table.pageSongs.length}</span> of{" "}
          <span className="fw-semibold text-body">{table.filteredCount}</span> songs.
        </p>
        <span className="badge text-bg-light border">
          Visible views: {stats.visibleViews.toLocaleString()}
        </span>
      </div>

      <div className="table-responsive rounded-4 border shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr className="table-light">
              <th>{renderSortButton("Rank", "rank")}</th>
              <th>{renderSortButton("Title", "title")}</th>
              <th>{renderSortButton("Channel", "channel")}</th>
              <th>{renderSortButton("Views", "viewCount")}</th>
              <th>{renderSortButton("Duration", "durationSeconds")}</th>
            </tr>
          </thead>
          <tbody>
            {table.pageSongs.map((song) => (
              <tr key={song.rank}>
                <td>
                  <span className="badge text-bg-secondary">#{song.rank}</span>
                </td>
                <td>
                  <Link to={`/song/${song.rank}`} className="text-decoration-none fw-semibold">
                    {song.title}
                  </Link>
                  {song.categories ? (
                    <div className="small text-body-secondary">{song.categories}</div>
                  ) : null}
                </td>
                <td>
                  <div className="fw-medium">{song.channel}</div>
                  {song.liveStatus ? (
                    <span className="badge rounded-pill text-bg-danger-subtle text-danger-emphasis border">
                      {song.liveStatus}
                    </span>
                  ) : null}
                </td>
                <td>
                  <span className="fw-semibold">{song.viewCountFormatted}</span>
                </td>
                <td>{song.duration ?? "-"}</td>
              </tr>
            ))}
            {table.pageSongs.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-body-secondary">
                  No songs match your current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <nav aria-label="Songs pagination">
        <ul className="pagination justify-content-center mt-4 mb-0 flex-wrap">
          <li className={`page-item ${table.currentPage === 1 ? "disabled" : ""}`}>
            <button type="button" className="page-link" onClick={() => table.goToPage(1)}>
              First
            </button>
          </li>
          <li className={`page-item ${table.currentPage === 1 ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => table.goToPage(table.currentPage - 1)}
            >
              Previous
            </button>
          </li>
          {pageNumbers.map((page) => (
            <li key={page} className={`page-item ${table.currentPage === page ? "active" : ""}`}>
              <button type="button" className="page-link" onClick={() => table.goToPage(page)}>
                {page}
              </button>
            </li>
          ))}
          <li className={`page-item ${table.currentPage === table.totalPages ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => table.goToPage(table.currentPage + 1)}
            >
              Next
            </button>
          </li>
          <li className={`page-item ${table.currentPage === table.totalPages ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => table.goToPage(table.totalPages)}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default DataTables;
