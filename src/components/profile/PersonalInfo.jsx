import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";

function PersonalInfo({ profile, setProfile }) {
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="profile-card">

      <h3>Personal Information</h3>

      <div className="profile-grid">

        {/* Full Name */}

        <div className="form-group">

          <label>
            <FaUser /> Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

        </div>

        {/* Email */}

        <div className="form-group">

          <label>
            <FaEnvelope /> Email Address
          </label>

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

        </div>

        {/* Mobile */}

        <div className="form-group">

          <label>
            <FaPhone /> Mobile Number
          </label>

          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Enter mobile number"
          />

        </div>

        {/* DOB */}

        <div className="form-group">

          <label>
            <FaBirthdayCake /> Date of Birth
          </label>

          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
          />

        </div>

        {/* Gender */}

        <div className="form-group">

          <label>
            <FaVenusMars /> Gender
          </label>

          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
          >

            <option value="">
              Select Gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}

export default PersonalInfo;