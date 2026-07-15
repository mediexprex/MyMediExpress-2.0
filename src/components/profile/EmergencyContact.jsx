import {
  FaUserFriends,
  FaHeart,
  FaPhoneAlt,
} from "react-icons/fa";

function EmergencyContact({ profile, setProfile }) {

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (

    <div className="profile-card">

      <h3>Emergency Contact</h3>

      <div className="profile-grid">

        {/* Contact Name */}

        <div className="form-group">

          <label>
            <FaUserFriends /> Contact Name
          </label>

          <input
            type="text"
            name="emergencyName"
            value={profile.emergencyName}
            onChange={handleChange}
            placeholder="Enter emergency contact name"
          />

        </div>

        {/* Relationship */}

        <div className="form-group">

          <label>
            <FaHeart /> Relationship
          </label>

          <select
            name="emergencyRelation"
            value={profile.emergencyRelation}
            onChange={handleChange}
          >

            <option value="">
              Select Relationship
            </option>

            <option value="Father">
              Father
            </option>

            <option value="Mother">
              Mother
            </option>

            <option value="Spouse">
              Spouse
            </option>

            <option value="Brother">
              Brother
            </option>

            <option value="Sister">
              Sister
            </option>

            <option value="Friend">
              Friend
            </option>

            <option value="Other">
              Other
            </option>

          </select>

        </div>

        {/* Mobile Number */}

        <div className="form-group">

          <label>
            <FaPhoneAlt /> Mobile Number
          </label>

          <input
            type="tel"
            name="emergencyPhone"
            value={profile.emergencyPhone}
            onChange={handleChange}
            placeholder="Enter emergency mobile number"
            maxLength={10}
          />

        </div>

      </div>

    </div>

  );
}

export default EmergencyContact;