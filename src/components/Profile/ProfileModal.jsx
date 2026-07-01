import Profile from "../../pages/Profile/Profile";

function ProfileModal({
  show,
  onClose,
  onProfileUpdated,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">

      <div className="modal-panel">

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <Profile
          onClose={onProfileUpdated}
        />

      </div>

    </div>
  );
}

export default ProfileModal;