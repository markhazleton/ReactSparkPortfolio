import { useEffect } from "react";
import { Badge, Col, Row, Spinner } from "react-bootstrap";
import { PaletteFill } from "react-bootstrap-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useSEO } from "../../contexts/useSEO";
import ThemeSelectorCard from "./ThemeSelectorCard";
import ThemeStatusNotice from "./ThemeStatusNotice";

/**
 * Dedicated page for browsing, comparing, and selecting supported themes.
 */
const ThemeSelectorPage: React.FC = () => {
  const { setDescription, setTitle } = useSEO();
  const { activeTheme, catalog, errorMessage, isThemeActive, selectTheme, status } = useTheme();

  useEffect(() => {
    setTitle("Themes | BootstrapSpark");
    setDescription(
      "Browse the supported BootstrapSpark and Bootswatch themes, compare their visual character, and apply one instantly across the site."
    );
  }, [setDescription, setTitle]);

  return (
    <section className="theme-selector-page py-4 py-lg-5">
      <div className="rounded-4 p-4 p-lg-5 mb-4 theme-selector-hero shadow-sm border-theme">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-3 text-uppercase small fw-semibold text-theme-muted">
              <PaletteFill /> Theme Switcher
            </div>
            <h1 className="display-6 fw-bold text-theme mb-3">
              Choose the site mood that fits your session.
            </h1>
            <p className="lead mb-0 text-theme-alt">
              BootstrapSpark keeps the first-party default plus the full Bootswatch theme catalog
              available so you can switch styles instantly, keep your choice across visits, and fall
              back safely when external metadata is unavailable.
            </p>
          </div>
          <div className="theme-selector-summary rounded-4 p-4 bg-card border-theme shadow-sm">
            <p className="small text-uppercase fw-semibold text-theme-muted mb-2">Current theme</p>
            <h2 className="h3 mb-2 text-theme">{activeTheme.name}</h2>
            <p className="mb-3 text-theme-muted">{activeTheme.description}</p>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="secondary" className="text-capitalize">
                {activeTheme.source}
              </Badge>
              <Badge
                bg={activeTheme.colorModeHint === "dark" ? "dark" : "light"}
                text={activeTheme.colorModeHint === "dark" ? undefined : "dark"}
              >
                {activeTheme.colorModeHint}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <ThemeStatusNotice
        activeThemeName={activeTheme.name}
        errorMessage={errorMessage}
        status={status}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1 text-theme">Supported themes</h2>
          <p className="text-theme-muted mb-0">
            BootstrapSpark plus every available Bootswatch theme below is selectable.
          </p>
        </div>
        {status === "loading" ? (
          <div className="d-flex align-items-center gap-2 text-theme-muted">
            <Spinner size="sm" /> Applying theme...
          </div>
        ) : null}
      </div>

      <Row className="g-4">
        {catalog.themes
          .slice()
          .sort((leftTheme, rightTheme) => leftTheme.order - rightTheme.order)
          .map((theme) => (
            <Col key={theme.id} md={6} xl={4}>
              <ThemeSelectorCard
                isActive={isThemeActive(theme.id)}
                isBusy={status === "loading"}
                onSelect={(themeId) => {
                  void selectTheme(themeId);
                }}
                theme={theme}
              />
            </Col>
          ))}
      </Row>
    </section>
  );
};

export default ThemeSelectorPage;
