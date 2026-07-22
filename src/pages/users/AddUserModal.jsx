import React, { useState } from 'react';
import { X, Save, Loader2, Upload, Edit } from 'lucide-react';
import communitiesData from '../../data/communities.json';

const initialState = {
  email: '',
  phone: '',
  password: '',
  role: 'user',
  isVerified: true,
  isBlocked: false,
  signupStep: 1,
  is_onboarding_complete: false,
  profile: {
    name: '',
    firstName: '',
    lastName: '',
    age: '',
    dob: '',
    gender: '',
    religion: '',
    education: '',
    profession: '',
    income: '',
    city: '',
    state: '',
    country: '',
    maritalStatus: '',
    diet: '',
    height: '',
    bio: '',
    profileFor: '',
    community: '',
    subCommunity: '',
    caste: '',
    college: '',
    workSector: '',
    workRole: '',
    companyName: '',
    motherStatus: '',
    fatherStatus: '',
    sistersCount: 0,
    brothersCount: 0,
    familyLocation: '',
    familyFinancialStatus: '',
    hobbies: '',
    liveWithFamily: false,
    astrology: {
      timeOfBirth: '',
      cityOfBirth: ''
    }
  },
  preferences: {
    ageRangeMin: '',
    ageRangeMax: '',
    religion: [],
    location: [],
    country: [],
    state: [],
    city: [],
    gender: [],
    heightMin: '',
    heightMax: '',
    education: [],
    profession: [],
    income: [],
    maritalStatus: [],
    diet: [],
    motherTongue: [],
    caste: [],
    community: [],
    subCommunity: []
  },
  premiumMembership: {
    isPremium: false,
    planType: ''
  },
  settings: {
    hidePhoneNumber: false,
    allowVoiceAndVideoCalls: true,
    hidePhotos: false
  }
};

export default function AddUserModal({ isOpen, onClose, onUserAdded, editingUser = null, onUserUpdated = () => { } }) {
  const commonOptions = {
    gender: ['Male', 'Female'],
    maritalStatus: ['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed', 'Annulled'],
    religion: Object.keys(communitiesData.subcommunities),
    diet: ['Veg', 'Non-Veg', 'Jain', 'Vegan', 'Eggetarian', 'Halal Only', 'Kosher Only'],
    education: ['BTech/BE', 'MTech/ME', 'MCA', 'MBA', 'MBBS', 'MD', 'BArch', 'MArch', 'BSc', 'MSc', 'BCom', 'MCom', 'BBA', 'BCA', 'BA', 'MA', 'PhD', 'Diploma', 'High School', 'Other'],
    profession: ['Software Professional', 'Manager/Executive', 'Consultant', 'Doctor/Medical Professional', 'Engineer (Non-IT)', 'Teacher/Educator', 'IAS/IPS/Civil Servant', 'Defense Personnel', 'CA/Financial Analyst', 'Business Owner/Entrepreneur', 'Marketing/Sales', 'Scientist/Researcher', 'HR Professional', 'Artist/Designer/Writer', 'Legal Professional', 'Student', 'Not Working', 'Other'],
    income: ['Under 3 LPA', '3-5 LPA', '5-7 LPA', '7-10 LPA', '10-15 LPA', '15-20 LPA', '20-30 LPA', '30-50 LPA', '50-70 LPA', '70 LPA - 1 Crore', '1 Crore+'],
    workSector: ['Private Sector', 'Government/Public Sector', 'Civil Services', 'Defense', 'Business/Self-employed', 'Not Working'],
    familyStatus: ['Elite', 'High', 'Middle', 'Aspiring'],
    fatherStatus: ['Employed', 'Business Man', 'Retired', 'Homemaker', 'Passed Away'],
    motherStatus: ['Employed', 'Business Woman', 'Retired', 'Homemaker', 'Passed Away'],
    heights: [
      '4\'5" (134 cm)', '4\'6" (137 cm)', '4\'7" (139 cm)', '4\'8" (142 cm)', '4\'9" (144 cm)', '4\'10" (147 cm)', '4\'11" (149 cm)',
      '5\'0" (152 cm)', '5\'1" (154 cm)', '5\'2" (157 cm)', '5\'3" (160 cm)', '5\'4" (162 cm)', '5\'5" (165 cm)', '5\'6" (167 cm)',
      '5\'7" (170 cm)', '5\'8" (172 cm)', '5\'9" (175 cm)', '5\'10" (177 cm)', '5\'11" (180 cm)',
      '6\'0" (182 cm)', '6\'1" (185 cm)', '6\'2" (187 cm)', '6\'3" (190 cm)', '6\'4" (193 cm)', '6\'5" (195 cm)', '6\'6" (198 cm)',
      '6\'7" (200 cm)', '6\'8" (203 cm)', '6\'9" (205 cm)', '6\'10" (208 cm)', '6\'11" (210 cm)', '7\'0" (213 cm)'
    ],
    colleges: [
      'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kharagpur', 'IIT Kanpur', 'IIT Roorkee', 'IIT Guwahati',
      'IIT Hyderabad', 'IIT BHU Varanasi', 'IIT Indore', 'IIT Gandhinagar', 'IIT Ropar', 'IIT Patna', 'IIT Mandi',
      'BITS Pilani', 'BITS Mesra', 'NIT Trichy', 'NIT Surathkal', 'NIT Warangal', 'NIT Calicut', 'NIT Rourkela',
      'NIT Kurukshetra', 'NIT Silchar', 'NIT Durgapur', 'IISc Bangalore', 'IIM Ahmedabad', 'IIM Bangalore',
      'IIM Calcutta', 'IIM Lucknow', 'IIM Kozhikode', 'IIM Indore', 'XLRI Jamshedpur', 'ISB Hyderabad',
      'FMS Delhi', 'SPJIMR Mumbai', 'Delhi University (DU)', 'St. Stephen\'s College', 'SRCC', 'LSR', 'Miranda House',
      'Hindu College', 'Hansraj College', 'Kirori Mal College', 'Ramjas College', 'Sri Venkateswara College',
      'Mumbai University', 'St. Xavier\'s College Mumbai', 'HR College', 'NM College', 'Mithibai College',
      'Jai Hind College', 'Wilson College', 'Sophia College', 'VJTI Mumbai', 'COEP Pune', 'Pune University (SPPU)',
      'SYMBIOSIS International Pune', 'FLAME University Pune', 'MIT WPU Pune', 'Bharati Vidyapeeth', 'DY Patil University',
      'Anna University Chennai', 'PSG Tech Coimbatore', 'Madras Christian College', 'Loyola College Chennai',
      'JNTU Hyderabad', 'Osmania University', 'CBIT Hyderabad', 'Vasavi College of Engineering', 'VNR VJIET',
      'IIIT Hyderabad', 'IIIT Bangalore', 'IIIT Delhi', 'IIIT Allahabad', 'Calcutta University', 'Presidency University Kolkata',
      'Jadavpur University', 'St. Xavier\'s Kolkata', 'Heritage Institute of Technology', 'IEM Kolkata',
      'Gujarat Technological University (GTU)', 'Nirma University', 'LD College of Engineering', 'MS University Baroda',
      'DA-IICT Gandhinagar', 'PDEU Gandhinagar', 'LDRP Institute', 'Rajasthan Technical University', 'MNIT Jaipur',
      'Banasthali Vidyapith', 'LMNIIT Jaipur', 'Manipal University Jaipur', 'Amity University Noida', 'Amity University Gurgaon',
      'Lovely Professional University (LPU)', 'Chandigarh University', 'Thapar Institute Patiala', 'PEC Chandigarh',
      'Kurukshetra University', 'Chitkara University', 'Sharda University Greater Noida', 'Galgotias University',
      'Noida International University', 'Bennett University', 'GLA University Mathura', 'Invertis University Bareilly',
      'Integral University Lucknow', 'Babu Banarasi Das University', 'Graphic Era University Dehradun', 'UPES Dehradun',
      'Christ University Bangalore', 'Manipal Institute of Technology (MIT)', 'RV College of Engineering',
      'PES University Bangalore', 'MS Ramaiah Institute of Technology', 'BMS College of Engineering', 'Dayananda Sagar College',
      'Alliance University Bangalore', 'REVA University Bangalore', 'Jain University Bangalore', 'GITAM University Visakhapatnam',
      'Vignan University Guntur', 'KL University Vijayawada', 'VIT Vellore', 'SRM University Chennai',
      'Sathyabama University Chennai', 'Kalasalingam University', 'SASTRA University Thanjavur', 'SSN College of Engineering',
      'Kalinga Institute of Industrial Technology (KIIT)', 'ITER Bhubaneswar', 'Banaras Hindu University (BHU)',
      'Aligarh Muslim University (AMU)', 'Allahabad University', 'HBTI Kanpur', 'Harvard University', 'Stanford University',
      'MIT USA', 'Oxford University', 'Cambridge University', 'Columbia University', 'NYU', 'University of Toronto',
      'National University of Singapore (NUS)', 'Imperial College London', 'Other'
    ]
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);

  React.useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("https://server.familiess.com/api/admin/plans", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setSubscriptionPlans(data);
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && editingUser) {
      setFormData({
        ...initialState,
        ...editingUser,
        profile: { ...initialState.profile, ...(editingUser.profile || {}) },
        preferences: {
          ...initialState.preferences,
          ...(editingUser.preferences || {}),
          ageRangeMin: editingUser.preferences?.ageRange?.[0] || '',
          ageRangeMax: editingUser.preferences?.ageRange?.[1] || '',
        },
        premiumMembership: { ...initialState.premiumMembership, ...(editingUser.premiumMembership || {}) },
        settings: { ...initialState.settings, ...(editingUser.settings || {}) }
      });
      setSelectedFiles([]);
    } else if (isOpen) {
      setFormData(initialState);
      setSelectedFiles([]);
    }
  }, [isOpen, editingUser]);

  if (!isOpen) return null;

  const handleChange = (e, section, subSection) => {
    const { name, value, type, checked, options } = e.target;

    let finalValue;
    if (type === 'checkbox') {
      finalValue = checked;
    } else if (type === 'select-multiple') {
      finalValue = Array.from(options).filter(opt => opt.selected).map(opt => opt.value);
    } else {
      finalValue = value;
    }

    if (section === 'profile' && subSection === 'astrology') {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          astrology: { ...prev.profile.astrology, [name]: finalValue }
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [name]: finalValue }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = JSON.parse(JSON.stringify(formData));

    // Automatically set verification and onboarding status for all users (create & update)
    payload.isVerified = true;

    payload.is_onboarding_complete = true;

    if (payload.profile.hobbies && typeof payload.profile.hobbies === 'string') {
      payload.profile.hobbies = payload.profile.hobbies.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      payload.profile.hobbies = [];
    }

    const arrayPrefs = ['religion', 'location', 'country', 'state', 'city', 'gender', 'education', 'profession', 'income', 'maritalStatus', 'diet', 'community', 'subCommunity', 'college', 'workSector', 'familyFinancialStatus'];

    arrayPrefs.forEach(field => {
      if (Array.isArray(payload.preferences[field])) {
      } else if (payload.preferences[field] && typeof payload.preferences[field] === 'string') {
        payload.preferences[field] = payload.preferences[field].split(',').map(s => s.trim()).filter(Boolean);
      } else {
        payload.preferences[field] = [];
      }
    });

    if (payload.preferences.ageRangeMin && payload.preferences.ageRangeMax) {
      payload.preferences.ageRange = [Number(payload.preferences.ageRangeMin), Number(payload.preferences.ageRangeMax)];
    } else {
      payload.preferences.ageRange = [];
    }

    if (payload.preferences.heightMin && payload.preferences.heightMax) {
      payload.preferences.height = [payload.preferences.heightMin, payload.preferences.heightMax];
    } else {
      payload.preferences.height = [];
    }

    delete payload.preferences.ageRangeMin;
    delete payload.preferences.ageRangeMax;
    delete payload.preferences.heightMin;
    delete payload.preferences.heightMax;

    try {
      const token = localStorage.getItem('adminToken');

      let uploadedPhotoUrls = [];
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('media', file);
        });

        const uploadRes = await fetch('https://server.familiess.com/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || 'Failed to upload images');
        uploadedPhotoUrls = uploadData.urls || [];
      }

      payload.profile.photos = [...(editingUser?.profile?.photos || []), ...uploadedPhotoUrls];

      // Map root onboarding fields into profile so backend accepts them
      payload.profile.signupStep = payload.signupStep;
      payload.profile.is_onboarding_complete = payload.is_onboarding_complete;

      const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

      const url = editingUser
        ? `https://server.familiess.com/api/admin/users/${editingUser._id}`
        : 'https://server.familiess.com/api/admin/users';

      const res = await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ encodedPayload })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save user');

      if (editingUser) {
        onUserUpdated(data);
      } else {
        onUserAdded(data);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500";
  const labelClasses = "block text-xs font-semibold text-slate-700 mb-1";
  const checkboxLabelClasses = "ml-2 text-sm text-slate-700 font-medium";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[95vw] max-w-5xl h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <p className="text-xs text-slate-500">Create a comprehensive profile covering all available data points</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form id="addUserForm" onSubmit={handleSubmit} className="space-y-8">

            {/* 1. Account & Security */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-slate-100 pb-2">Account & Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className={labelClasses}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={(e) => handleChange(e, null)} className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Mobile Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={(e) => handleChange(e, null)} className={inputClasses} required />
                </div>
                <div>
                  <label className={labelClasses}>Password {editingUser && '(Leave blank to keep current)'}</label>
                  <input type="text" name="password" value={formData.password} onChange={(e) => handleChange(e, null)} className={inputClasses} placeholder={editingUser ? "Leave blank to keep unchanged" : "Set initial password"} required={!editingUser} />
                </div>
                <div>
                  <label className={labelClasses}>Role</label>
                  <select name="role" value={formData.role} onChange={(e) => handleChange(e, null)} className={inputClasses}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 2. Basic Profile Info */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-slate-100 pb-2">Basic Profile Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div><label className={labelClasses}>Display Name</label><input type="text" name="name" value={formData.profile.name} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} required /></div>
                <div><label className={labelClasses}>First Name</label><input type="text" name="firstName" value={formData.profile.firstName} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
                <div><label className={labelClasses}>Last Name</label><input type="text" name="lastName" value={formData.profile.lastName} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
                <div><label className={labelClasses}>Date of Birth</label><input type="date" name="dob" value={formData.profile.dob} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
                <div><label className={labelClasses}>Age</label><input type="number" name="age" value={formData.profile.age} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} min="18" /></div>
                <div>
                  <label className={labelClasses}>Gender</label>
                  <select name="gender" value={formData.profile.gender} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.gender.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Marital Status</label>
                  <select name="maritalStatus" value={formData.profile.maritalStatus} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.maritalStatus.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Height</label>
                  <select name="height" value={formData.profile.height} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.heights.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Diet</label>
                  <select name="diet" value={formData.profile.diet} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.diet.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label className={labelClasses}>Profile Creating For</label><input type="text" name="profileFor" value={formData.profile.profileFor} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} placeholder="Myself, Son, etc." /></div>
                <div className="col-span-full"><label className={labelClasses}>Hobbies (comma separated)</label><input type="text" name="hobbies" value={formData.profile.hobbies} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} placeholder="Reading, Traveling, Cooking" /></div>
                <div className="col-span-full"><label className={labelClasses}>Bio</label><textarea name="bio" value={formData.profile.bio} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} rows={2}></textarea></div>
                <div className="col-span-full">
                  <label className={labelClasses}>Profile Photos</label>
                  <p className="text-xs text-slate-500 mb-2">Upload photos for the user. Since you are an admin, these photos will be directly approved and visible.</p>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-500 font-semibold">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400">PNG, JPG or JPEG (Max 10 files)</p>
                      </div>
                      <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 3. Background & Location */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-slate-100 pb-2">Background & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClasses}>Religion</label>
                  <select name="religion" value={formData.profile.religion} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.religion.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Community</label>
                  <select name="community" value={formData.profile.community} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {communitiesData.communities.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Sub Community (Caste)</label>
                  <select name="caste" value={formData.profile.caste} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {(formData.profile.religion
                      ? (communitiesData.subcommunities[formData.profile.religion] || [])
                      : Object.values(communitiesData.subcommunities).flat()
                    ).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label className={labelClasses}>City</label><input type="text" name="city" value={formData.profile.city} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
                <div><label className={labelClasses}>State</label><input type="text" name="state" value={formData.profile.state} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
                <div><label className={labelClasses}>Country</label><input type="text" name="country" value={formData.profile.country} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
              </div>
            </section>

            {/* 4. Education & Career */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-slate-100 pb-2">Education & Career</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelClasses}>Education</label>
                  <select name="education" value={formData.profile.education} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.education.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>College</label>
                  <select name="college" value={formData.profile.college} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.colleges.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Profession</label>
                  <select name="profession" value={formData.profile.profession} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.profession.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label className={labelClasses}>Work Role</label><input type="text" name="workRole" value={formData.profile.workRole} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
                <div>
                  <label className={labelClasses}>Work Sector</label>
                  <select name="workSector" value={formData.profile.workSector} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.workSector.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label className={labelClasses}>Company Name</label><input type="text" name="companyName" value={formData.profile.companyName} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
                <div>
                  <label className={labelClasses}>Income</label>
                  <select name="income" value={formData.profile.income} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.income.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* 5. Family Details */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-slate-100 pb-2">Family Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div>
                  <label className={labelClasses}>Father Status</label>
                  <select name="fatherStatus" value={formData.profile.fatherStatus} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.fatherStatus.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Mother Status</label>
                  <select name="motherStatus" value={formData.profile.motherStatus} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.motherStatus.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Family Status</label>
                  <select name="familyFinancialStatus" value={formData.profile.familyFinancialStatus} onChange={(e) => handleChange(e, 'profile')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.familyStatus.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label className={labelClasses}>Brothers Count</label><input type="number" min="0" name="brothersCount" value={formData.profile.brothersCount} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
                <div><label className={labelClasses}>Sisters Count</label><input type="number" min="0" name="sistersCount" value={formData.profile.sistersCount} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
                <div><label className={labelClasses}>Family Location</label><input type="text" name="familyLocation" value={formData.profile.familyLocation} onChange={(e) => handleChange(e, 'profile')} className={inputClasses} /></div>
              </div>
              <label className="flex items-center">
                <input type="checkbox" name="liveWithFamily" checked={formData.profile.liveWithFamily} onChange={(e) => handleChange(e, 'profile')} className="rounded text-purple-600 focus:ring-purple-500" />
                <span className={checkboxLabelClasses}>Lives with family</span>
              </label>
            </section>

            {/* 6. Astrology */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-slate-100 pb-2">Astrology</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={labelClasses}>Time of Birth</label><input type="text" name="timeOfBirth" value={formData.profile.astrology.timeOfBirth} onChange={(e) => handleChange(e, 'profile', 'astrology')} className={inputClasses} placeholder="HH:MM AM/PM" /></div>
                <div><label className={labelClasses}>City of Birth</label><input type="text" name="cityOfBirth" value={formData.profile.astrology.cityOfBirth} onChange={(e) => handleChange(e, 'profile', 'astrology')} className={inputClasses} /></div>
              </div>
            </section>

            {/* 7. Partner Preferences (Comma Separated) */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-slate-100 pb-2">Partner Preferences</h3>
              <p className="text-xs text-slate-500 mb-4">Hold CTRL or CMD to select multiple values.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div><label className={labelClasses}>Min Age</label><input type="number" name="ageRangeMin" value={formData.preferences.ageRangeMin} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses} /></div>
                <div><label className={labelClasses}>Max Age</label><input type="number" name="ageRangeMax" value={formData.preferences.ageRangeMax} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses} /></div>
                <div>
                  <label className={labelClasses}>Religion(s)</label>
                  <select multiple name="religion" value={formData.preferences.religion} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.religion.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Community(s)</label>
                  <select multiple name="community" value={formData.preferences.community} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {communitiesData.communities.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Sub Community(s)</label>
                  <select multiple name="subCommunity" value={formData.preferences.subCommunity} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {Array.from(new Set(
                      formData.preferences.religion && formData.preferences.religion.length > 0
                        ? formData.preferences.religion.flatMap(r => communitiesData.subcommunities[r] || [])
                        : Object.values(communitiesData.subcommunities).flat()
                    )).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div><label className={labelClasses}>Country(s) (comma separated)</label><input type="text" name="country" value={formData.preferences.country} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses} /></div>
                <div><label className={labelClasses}>State(s) (comma separated)</label><input type="text" name="state" value={formData.preferences.state} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses} /></div>
                <div><label className={labelClasses}>City(s) (comma separated)</label><input type="text" name="city" value={formData.preferences.city} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses} /></div>
                <div><label className={labelClasses}>Location(s) (comma separated)</label><input type="text" name="location" value={formData.preferences.location} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses} /></div>
                <div>
                  <label className={labelClasses}>Gender(s)</label>
                  <select multiple name="gender" value={formData.preferences.gender} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.gender.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Min Height</label>
                  <select name="heightMin" value={formData.preferences.heightMin} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.heights.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Max Height</label>
                  <select name="heightMax" value={formData.preferences.heightMax} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses}>
                    <option value="">Select</option>
                    {commonOptions.heights.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Education(s)</label>
                  <select multiple name="education" value={formData.preferences.education} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.education.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Profession(s)</label>
                  <select multiple name="profession" value={formData.preferences.profession} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.profession.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Income(s)</label>
                  <select multiple name="income" value={formData.preferences.income} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.income.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Marital Status(es)</label>
                  <select multiple name="maritalStatus" value={formData.preferences.maritalStatus} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.maritalStatus.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Diet(s)</label>
                  <select multiple name="diet" value={formData.preferences.diet} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.diet.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>College(s)</label>
                  <select multiple name="college" value={formData.preferences.college} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.colleges.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Work Sector(s)</label>
                  <select multiple name="workSector" value={formData.preferences.workSector} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.workSector.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClasses}>Family Status(es)</label>
                  <select multiple name="familyFinancialStatus" value={formData.preferences.familyFinancialStatus} onChange={(e) => handleChange(e, 'preferences')} className={inputClasses + " h-24"}>
                    {commonOptions.familyStatus.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* 8. Premium Membership */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 mb-4 border-b border-slate-100 pb-2">Premium Membership</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="flex items-end mb-2">
                  <label className="flex items-center">
                    <input type="checkbox" name="isPremium" checked={formData.premiumMembership.isPremium} onChange={(e) => handleChange(e, 'premiumMembership')} className="rounded text-purple-600 focus:ring-purple-500" />
                    <span className={checkboxLabelClasses}>Is Premium User</span>
                  </label>
                </div>
                <div>
                  <label className={labelClasses}>Plan Type</label>
                  <select name="planType" value={formData.premiumMembership.planType} onChange={(e) => handleChange(e, 'premiumMembership')} className={inputClasses} disabled={!formData.premiumMembership.isPremium}>
                    <option value="">Select Plan</option>
                    {subscriptionPlans.map(plan => <option key={plan._id} value={plan.name}>{plan.name}</option>)}
                  </select>
                </div>
              </div>
            </section>

          </form>
        </div>

        <div className="flex-shrink-0">
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end gap-4 rounded-b-2xl mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button type="submit" form="addUserForm" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? 'Saving...' : (editingUser ? 'Save Changes' : 'Create User')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
