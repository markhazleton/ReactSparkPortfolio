import { Badge, Button, Card } from "react-bootstrap";
import { CheckCircleFill, CircleHalf, Stars } from "react-bootstrap-icons";
import type { ThemeOption } from "../../models/theme/themeCatalog";

interface ThemeSelectorCardProps {
  isActive: boolean;
  isBusy: boolean;
  onSelect: (themeId: string) => void;
  theme: ThemeOption;
}

const previewSwatches: Record<string, string[]> = {
  bootstrapspark: ["#843f1a", "#d2b18e", "#fef6e4"],
  flatly: ["#2c3e50", "#18bc9c", "#ecf0f1"],
  darkly: ["#375a7f", "#00bc8c", "#222222"],
  quartz: ["#6c757d", "#8b5cf6", "#f8f9fa"],
};

/**
 * Renders one supported theme card with status, metadata, and selection affordances.
 */
const ThemeSelectorCard: React.FC<ThemeSelectorCardProps> = ({
  isActive,
  isBusy,
  onSelect,
  theme,
}) => {
  const swatches = previewSwatches[theme.id] ?? ["#adb5bd", "#ced4da", "#f8f9fa"];

  return (
    <Card
      className={`theme-selector-card h-100 shadow-sm ${isActive ? "border-primary border-2" : "border-theme"}`}
    >
      <Card.Body className="d-flex flex-column gap-3 bg-card">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <h3 className="h5 mb-0 text-theme">{theme.name}</h3>
              {theme.isDefault ? <Badge bg="primary">Default</Badge> : null}
              {isActive ? <Badge bg="success">Active</Badge> : null}
            </div>
            <p className="text-theme-muted mb-0">{theme.description}</p>
          </div>
          <div className="theme-selector-badges d-flex gap-2 flex-wrap justify-content-end">
            <Badge bg="secondary" className="text-capitalize">
              <Stars className="me-1" /> {theme.source}
            </Badge>
            <Badge
              bg={theme.colorModeHint === "dark" ? "dark" : "light"}
              text={theme.colorModeHint === "dark" ? undefined : "dark"}
            >
              <CircleHalf className="me-1" /> {theme.colorModeHint}
            </Badge>
          </div>
        </div>

        <div className="theme-preview-strip" aria-hidden="true">
          {swatches.map((swatch) => (
            <span
              key={`${theme.id}-${swatch}`}
              className="theme-preview-swatch"
              style={{ backgroundColor: swatch }}
            />
          ))}
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
          <small className="text-theme-muted">
            {theme.previewUrl ? "Bootswatch metadata available" : "Local curated metadata"}
          </small>
          <Button
            variant={isActive ? "success" : "primary"}
            onClick={() => onSelect(theme.id)}
            disabled={isBusy}
            aria-pressed={isActive}
          >
            {isActive ? (
              <>
                <CheckCircleFill className="me-2" /> Active
              </>
            ) : (
              "Apply theme"
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ThemeSelectorCard;
