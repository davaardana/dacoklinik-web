import PropTypes from 'prop-types'

const SummaryCard = ({ label, value, accent = 'var(--teal-500)' }) => {
  return (
    <div className="summary-card" style={{ borderColor: accent }}>
      <div className="summary-card__dot" style={{ background: accent }} />
      <p className="summary-card__label">{label}</p>
      <p className="summary-card__value">{value}</p>
    </div>
  )
}

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  accent: PropTypes.string,
}

export default SummaryCard
