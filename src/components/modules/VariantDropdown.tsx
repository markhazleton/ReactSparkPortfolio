import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Variant } from "../types";

interface Props {
  variants: Variant[];
  selectedVariant: Variant | null;
  onSelect: (variant: Variant) => void;
}

const VariantDropdown: React.FC<Props> = ({ variants, selectedVariant, onSelect }) => (
  <DropdownButton
    id="variant-dropdown"
    title={selectedVariant ? selectedVariant.name : 'Select a Variant'}
    className="mb-4"
  >
    {variants.map((variant) => (
      <Dropdown.Item key={variant.id} onClick={() => onSelect(variant)}>
        {variant.name}
      </Dropdown.Item>
    ))}
  </DropdownButton>
);

export default VariantDropdown;
