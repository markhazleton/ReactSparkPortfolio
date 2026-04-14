import { Alert } from "react-bootstrap";
import { CheckCircleFill, ExclamationTriangleFill, InfoCircleFill } from "react-bootstrap-icons";
import type { ThemeLoadStatus } from "../../models/theme/themeCatalog";

interface ThemeStatusNoticeProps {
  activeThemeName: string;
  errorMessage?: string;
  status: ThemeLoadStatus;
}

/**
 * Displays the current theme-selection runtime status in a user-safe way.
 */
const ThemeStatusNotice: React.FC<ThemeStatusNoticeProps> = ({
  activeThemeName,
  errorMessage,
  status,
}) => {
  if (status === "loading") {
    return (
      <Alert variant="info" className="d-flex align-items-center gap-2">
        <InfoCircleFill /> Applying your selected theme...
      </Alert>
    );
  }

  if (status === "fallback" || status === "error") {
    return (
      <Alert variant="warning" className="d-flex align-items-center gap-2">
        <ExclamationTriangleFill />
        <span>
          {errorMessage ?? `BootstrapSpark restored ${activeThemeName} after a theme issue.`}
        </span>
      </Alert>
    );
  }

  return (
    <Alert variant="light" className="d-flex align-items-center gap-2 border">
      <CheckCircleFill className="text-success" />
      <span>
        <strong>{activeThemeName}</strong> is active. Changes apply immediately and stay with your
        next visit.
      </span>
    </Alert>
  );
};

export default ThemeStatusNotice;
