import React from 'react';

interface Props {
  isActive: boolean;
  isHover: boolean;
  setIsActive: (active: boolean) => void;
  setIsHover: (hover: boolean) => void;
}

const SubmitButton: React.FC<Props> = ({ isActive, isHover, setIsActive, setIsHover }) => {
  const buttonStyle: React.CSSProperties = {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#fff',
    background: isActive
      ? '#004494'
      : isHover
      ? 'linear-gradient(90deg, #005bb5 0%, #0070f3 100%)'
      : 'linear-gradient(90deg, #0070f3 0%, #3291ff 100%)',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    boxShadow: isActive
      ? '0 4px 10px rgba(0, 68, 148, 0.7)'
      : isHover
      ? '0 8px 20px rgba(0, 91, 181, 0.7)'
      : '0 6px 15px rgba(50, 145, 255, 0.5)',
    transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.1s ease',
    userSelect: 'none',
    outline: 'none',
  };

  return (
    <button
      type="submit"
      style={buttonStyle}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onBlur={() => {
        setIsHover(false);
        setIsActive(false);
      }}
      aria-live="polite"
      aria-busy={isActive}
    >
      Send Message
    </button>
  );
};

export default SubmitButton;
