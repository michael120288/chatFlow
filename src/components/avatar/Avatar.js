import PropTypes from 'prop-types';
import '@components/avatar/Avatar.scss';

const Avatar = ({ avatarSrc, name, bgColor = '#f33e58', textColor, size, round = true }) => {
  const textSizeRatio = 1.7;
  const fontSize = Math.floor(size / textSizeRatio);
  const firstNameCharacter = name?.charAt(0);
  const iconSize = Math.floor(size * 0.6);

  const DefaultAvatarIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ margin: 'auto' }}
    >
      <path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        fill={textColor || '#ffffff'}
      />
      <path d="M12 14C6.47715 14 2 18.4772 2 24H22C22 18.4772 17.5228 14 12 14Z" fill={textColor || '#ffffff'} />
    </svg>
  );

  return (
    <>
      {!avatarSrc && (
        <div
          data-testid="avatar-container"
          className="avatar-container"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${round ? '50%' : ''}`,
            backgroundColor: `${!avatarSrc ? bgColor : ''}`,
            display: 'flex'
          }}
        >
          {name && firstNameCharacter ? (
            <div
              data-testid="avatar-name"
              style={{
                color: `${textColor}`,
                fontSize: `${fontSize}`,
                margin: 'auto',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}
            >
              {firstNameCharacter}
            </div>
          ) : (
            <DefaultAvatarIcon />
          )}
        </div>
      )}

      {avatarSrc && (
        <div className="avatar-image-wrapper">
          <img
            src={avatarSrc}
            alt=""
            className="avatar-content avatar-container"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: `${round ? '50%' : ''}`
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              parent.innerHTML = `
                <div class="avatar-container" style="width: ${size}px; height: ${size}px; border-radius: ${
                round ? '50%' : '0'
              }; background-color: ${bgColor}; display: flex;">
                  <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin: auto;">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="${
                      textColor || '#ffffff'
                    }"/>
                    <path d="M12 14C6.47715 14 2 18.4772 2 24H22C22 18.4772 17.5228 14 12 14Z" fill="${
                      textColor || '#ffffff'
                    }"/>
                  </svg>
                </div>
              `;
            }}
          />
        </div>
      )}
    </>
  );
};

Avatar.propTypes = {
  avatarSrc: PropTypes.string,
  name: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.number,
  round: PropTypes.bool
};
export default Avatar;
