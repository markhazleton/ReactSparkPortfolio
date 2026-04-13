import { useMemo, useState } from "react";
import { Song, SongSortColumn, SortDirection } from "../models/Song";
import { searchSongs, sortSongs } from "../services/SongService";

interface UseDataTableResult {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortColumn: SongSortColumn;
  sortDirection: SortDirection;
  setSort: (column: SongSortColumn) => void;
  currentPage: number;
  totalPages: number;
  pageSongs: Song[];
  filteredCount: number;
  goToPage: (page: number) => void;
}

export const useDataTable = (songs: Song[], pageSize = 10): UseDataTableResult => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SongSortColumn>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSongs = useMemo(() => searchSongs(songs, searchQuery), [songs, searchQuery]);

  const sortedSongs = useMemo(
    () => sortSongs(filteredSongs, sortColumn, sortDirection),
    [filteredSongs, sortColumn, sortDirection]
  );

  const totalPages = Math.max(1, Math.ceil(sortedSongs.length / pageSize));

  const pageSongs = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return sortedSongs.slice(start, start + pageSize);
  }, [sortedSongs, currentPage, totalPages, pageSize]);

  const setSort = (column: SongSortColumn) => {
    setCurrentPage(1);
    if (column === sortColumn) {
      setSortDirection((value) => (value === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumn(column);
    setSortDirection("asc");
  };

  const goToPage = (page: number) => {
    const bounded = Math.min(totalPages, Math.max(1, page));
    setCurrentPage(bounded);
  };

  return {
    searchQuery,
    setSearchQuery: (value: string) => {
      setCurrentPage(1);
      setSearchQuery(value);
    },
    sortColumn,
    sortDirection,
    setSort,
    currentPage,
    totalPages,
    pageSongs,
    filteredCount: sortedSongs.length,
    goToPage,
  };
};
