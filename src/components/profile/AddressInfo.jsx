import {
  FaHome,
  FaRoad,
  FaMapMarkerAlt,
  FaCity,
  FaMap,
  FaMailBulk,
} from "react-icons/fa";

function AddressInfo({ profile, setProfile }) {

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (

    <div className="profile-card">

      <h3>Delivery Address</h3>

      <div className="profile-grid">

        {/* House No */}

        <div className="form-group">

          <label>
            <FaHome /> House / Flat No
          </label>

          <input
            type="text"
            name="house"
            value={profile.house}
            onChange={handleChange}
            placeholder="House / Flat Number"
          />

        </div>

        {/* Street */}

        <div className="form-group">

          <label>
            <FaRoad /> Street
          </label>

          <input
            type="text"
            name="street"
            value={profile.street}
            onChange={handleChange}
            placeholder="Street Name"
          />

        </div>

        {/* Area */}

        <div className="form-group">

          <label>
            <FaMapMarkerAlt /> Area / Locality
          </label>

          <input
            type="text"
            name="area"
            value={profile.area}
            onChange={handleChange}
            placeholder="Area / Locality"
          />

        </div>

        {/* Landmark */}

        <div className="form-group">

          <label>
            <FaMapMarkerAlt /> Landmark
          </label>

          <input
            type="text"
            name="landmark"
            value={profile.landmark}
            onChange={handleChange}
            placeholder="Nearby Landmark"
          />

        </div>

        {/* City */}

        <div className="form-group">

          <label>
            <FaCity /> City
          </label>

          <input
            type="text"
            name="city"
            value={profile.city}
            onChange={handleChange}
            placeholder="City"
          />

        </div>

        {/* State */}

        <div className="form-group">

          <label>
            <FaMap /> State
          </label>

          <input
            type="text"
            name="state"
            value={profile.state}
            onChange={handleChange}
            placeholder="State"
          />

        </div>

        {/* Pincode */}

        <div className="form-group">

          <label>
            <FaMailBulk /> PIN Code
          </label>

          <input
            type="text"
            name="pincode"
            value={profile.pincode}
            onChange={handleChange}
            placeholder="PIN Code"
            maxLength={6}
          />

        </div>

      </div>

    </div>

  );
}

export default AddressInfo;