import PropTypes from 'prop-types'

const BrandLogo = ({ size = 'md' }) => {
  return (
    <div className={`brand-logo brand-logo--${size}`}>
      <img
        src="/logo.svg"
        alt="Daco Jaya Medika - Apotek & Klinik"
        className="brand-logo__img"
      />
    </div>
  )
}

BrandLogo.propTypes = {
  size: PropTypes.oneOf(['sm', 'md']),
}

export default BrandLogo
