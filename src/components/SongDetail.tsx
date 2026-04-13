import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSEO } from "../contexts/useSEO";
import { Song } from "../models/Song";
import { getSongById } from "../services/SongService";

const SongDetail: React.FC = () => {
  const { id } = useParams();
  const { setTitle, setDescription } = useSEO();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSong = async () => {
      const numericId = Number(id);
      if (!Number.isInteger(numericId) || numericId < 1) {
        setSong(null);
        setLoading(false);
        return;
      }

      const found = await getSongById(numericId);
      setSong(found);
      setLoading(false);
    };

    loadSong();
  }, [id]);

  useEffect(() => {
    if (!song) {
      setTitle("Song Not Found | BootstrapSpark");
      setDescription("Song details were not found.");
      return;
    }

    setTitle(`${song.title} | BootstrapSpark`);
    setDescription(`View details for ${song.title} by ${song.channel}.`);
  }, [setDescription, setTitle, song]);

  if (loading) {
    return (
      <div className="py-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!song) {
    return (
      <section className="py-4">
        <h1 className="h3">Song not found</h1>
        <p>The song ID is invalid or missing from the dataset.</p>
        <Link to="/data-tables" className="btn btn-outline-primary">
          Back to Data Tables
        </Link>
      </section>
    );
  }

  return (
    <section className="py-4">
      <Link to="/data-tables" className="btn btn-sm btn-outline-secondary mb-3">
        Back to Data Tables
      </Link>
      <h1 className="mb-3">{song.title}</h1>
      <div className="row g-4">
        <div className="col-md-4">
          {song.thumbnail ? (
            <img src={song.thumbnail} className="img-fluid rounded shadow-sm" alt={song.title} />
          ) : (
            <div className="bg-body-tertiary rounded p-5 text-center">No thumbnail</div>
          )}
        </div>
        <div className="col-md-8">
          <dl className="row">
            <dt className="col-sm-4">Rank</dt>
            <dd className="col-sm-8">{song.rank}</dd>
            <dt className="col-sm-4">Channel</dt>
            <dd className="col-sm-8">{song.channel}</dd>
            <dt className="col-sm-4">Views</dt>
            <dd className="col-sm-8">{song.viewCountFormatted}</dd>
            <dt className="col-sm-4">Duration</dt>
            <dd className="col-sm-8">{song.duration ?? "-"}</dd>
            <dt className="col-sm-4">Followers</dt>
            <dd className="col-sm-8">{song.channelFollowerCount?.toLocaleString() ?? "-"}</dd>
            <dt className="col-sm-4">Categories</dt>
            <dd className="col-sm-8">{song.categories ?? "-"}</dd>
            <dt className="col-sm-4">Tags</dt>
            <dd className="col-sm-8">{song.tags ?? "-"}</dd>
          </dl>
          {song.channelUrl && (
            <a
              href={song.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Visit Channel
            </a>
          )}
        </div>
      </div>
      {song.description && (
        <article className="mt-4">
          <h2 className="h5">Description</h2>
          <p className="text-body-secondary">{song.description}</p>
        </article>
      )}
    </section>
  );
};

export default SongDetail;
