import {
  FaTint,
  FaAllergies,
  FaPills,
  FaNotesMedical,
  FaFileMedical,
} from "react-icons/fa";

function MedicalInfo({ profile, setProfile }) {

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (

    <div className="profile-card">

      <h3>Medical Information</h3>

      <div className="profile-grid">

        {/* Blood Group */}

        <div className="form-group">

          <label>
            <FaTint /> Blood Group
          </label>

          <select
            name="bloodGroup"
            value={profile.bloodGroup}
            onChange={handleChange}
          >

            <option value="">
              Select Blood Group
            </option>

            <option value="A+">A+</option>
            <option value="A-">A-</option>

            <option value="B+">B+</option>
            <option value="B-">B-</option>

            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>

            <option value="O+">O+</option>
            <option value="O-">O-</option>

          </select>

        </div>

        {/* Allergies */}

        <div className="form-group">

          <label>
            <FaAllergies /> Allergies
          </label>

          <input
            type="text"
            name="allergies"
            value={profile.allergies}
            onChange={handleChange}
            placeholder="Example: Penicillin, Dust"
          />

        </div>

        {/* Regular Medicines */}

        <div className="form-group">

          <label>
            <FaPills /> Regular Medicines
          </label>

          <input
            type="text"
            name="medicines"
            value={profile.medicines}
            onChange={handleChange}
            placeholder="Medicines taken regularly"
          />

        </div>

        {/* Medical Conditions */}

        <div className="form-group">

          <label>
            <FaNotesMedical /> Medical Conditions
          </label>

          <input
            type="text"
            name="medicalConditions"
            value={profile.medicalConditions}
            onChange={handleChange}
            placeholder="Diabetes, BP, Asthma..."
          />

        </div>

      </div>

      {/* Additional Notes */}

      <div
        className="form-group"
        style={{ marginTop: "20px" }}
      >

        <label>
          <FaFileMedical /> Additional Notes
        </label>

        <textarea
          name="notes"
          rows="5"
          value={profile.notes}
          onChange={handleChange}
          placeholder="Any additional medical information..."
        />

      </div>

    </div>

  );
}

export default MedicalInfo;