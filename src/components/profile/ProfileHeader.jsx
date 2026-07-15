import { useRef } from "react";
import { FaUserCircle, FaCamera } from "react-icons/fa";

import "./ProfileHeader.css";

function ProfileHeader({ profile, setProfile }) {

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      profilePhoto: imageUrl,
      profilePhotoFile: file,
    }));

  };

  return (

    <div className="profile-header">

      <div className="profile-avatar">

        {profile?.profilePhoto ? (

          <img
            src={profile.profilePhoto}
            alt="Profile"
          />

        ) : (

          <FaUserCircle />

        )}

        <button
          type="button"
          className="camera-btn"
          onClick={handleImageClick}
        >
          <FaCamera />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

      </div>

      <h1>
        {profile?.fullName || "My Profile"}
      </h1>

      <p>
        Manage your personal information,
        delivery address and healthcare
        details.
      </p>

    </div>

  );

}

export default ProfileHeader;