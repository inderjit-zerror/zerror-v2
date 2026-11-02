import TLink from './TLink';
import Magnetic from './Magnetic';
import RollText from './RollText';
import { PixelArrow } from './Pixel';

// Primary action: solid in the theme's headline colour. Ghost: hairline outline.
export default function Button({ href, children, variant = 'solid', label, magnetic = true, ...rest }) {
  const link = (
    <TLink href={href} label={label} className={`btn btn--${variant}`} {...rest}>
      <RollText text={children} />
      <span className="btn__icon">
        <PixelArrow />
      </span>
    </TLink>
  );
  return magnetic ? <Magnetic strength={0.25}>{link}</Magnetic> : link;
}
