import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");

  const [currentPage, setCurrentPage] = useState("home");

  const [todaySchedule, setTodaySchedule] = useState(null);
  const [scheduleMessage, setScheduleMessage] = useState("");

  const [mode, setMode] = useState("day");
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sessions, setSessions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [message, setMessage] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [notesMessage, setNotesMessage] = useState("");

  const [peerTitles, setPeerTitles] = useState({});
  const [peerFiles, setPeerFiles] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const fetchClasses = async (authToken, loggedInUser) => {
    try {
      const res = await fetch(`{import.meta.env.VITE_API_URL}/api/classes`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to fetch classes");
        return;
      }

      const classList = data.classes || [];
      setClasses(classList);

      if (loggedInUser?.className) {
        const matchedClass = classList.find(
          (c) => `${c.department}-${c.section}` === loggedInUser.className
        );

        if (matchedClass) {
          setClassId(matchedClass._id);
        }
      }
    } catch (err) {
      console.log(err);
      setMessage("Error fetching classes");
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchClasses(token, user);
    }
  }, [token, user]);

  const handleLogin = async () => {
    try {
      const res = await fetch(`{import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      if (data.user.role !== "student") {
        setMessage("Only students can login here");
        return;
      }

      setUser(data.user);
      setToken(data.token);
      setMessage("Login successful");
      setCurrentPage("home");
    } catch (err) {
      console.log(err);
      setMessage("Error logging in");
    }
  };

  const handleSignup = async () => {
    try {
      const res = await fetch(`{import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
        name,
        email,
        password,
        role: "student",
        className: `${department}-${year}-${section}`
      })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      setMessage("Signup successful! You can login now");
      setIsLogin(true);
      setName("");
      setDepartment("");
      setYear("");
      setSection("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err);
      setMessage("Error signing up");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    setClasses([]);
    setClassId("");
    setSessions([]);
    setSummary([]);
    setSubjects([]);
    setTodaySchedule(null);
    setScheduleMessage("");
    setNotesMessage("");
    setMessage("");
    setCurrentPage("home");
  };

  const fetchTodayTimetable = async () => {
    try {
      if (!classId) {
        setScheduleMessage("Please select a class");
        return;
      }

      const res = await fetch(
        `{import.meta.env.VITE_API_URL}/api/schedules/${classId}/${today}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setTodaySchedule(null);
        setScheduleMessage("Not assigned yet");
        return;
      }

      setTodaySchedule(data.schedule);
      setScheduleMessage("");
    } catch (err) {
      console.log(err);
      setTodaySchedule(null);
      setScheduleMessage("Not assigned yet");
    }
  };

  const fetchMissedData = async () => {
    try {
      let fromDate = "";
      let toDate = "";

      if (!classId) {
        setMessage("Please select a class");
        return;
      }

      if (mode === "day") {
        if (!singleDate) {
          setMessage("Please select a day");
          return;
        }
        fromDate = singleDate;
        toDate = singleDate;
      } else {
        if (!startDate || !endDate) {
          setMessage("Please select start and end date");
          return;
        }
        fromDate = startDate;
        toDate = endDate;
      }

      const res1 = await fetch(
        `{import.meta.env.VITE_API_URL}/api/missed/sessions?classId=${classId}&startDate=${fromDate}&endDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data1 = await res1.json();

      if (!res1.ok) {
        setMessage(data1.message || "Failed to fetch sessions");
        return;
      }

      setSessions(data1.sessions || []);

      const res2 = await fetch(
        `{import.meta.env.VITE_API_URL}/api/missed/summary?classId=${classId}&startDate=${fromDate}&endDate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data2 = await res2.json();

      if (!res2.ok) {
        setMessage(data2.message || "Failed to fetch summary");
        return;
      }

      setSummary(data2.summary || []);
      setMessage("Data fetched successfully");
    } catch (err) {
      console.log(err);
      setMessage("Error fetching data");
    }
  };

  const fetchGeneralNotes = async () => {
    try {
      if (!classId) {
        setNotesMessage("Class not selected");
        return;
      }

      const res = await fetch(
        `{import.meta.env.VITE_API_URL}/api/subjects/class/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setNotesMessage(data.message || "Failed to fetch general notes");
        return;
      }

      setSubjects(data.subjects || []);
      setNotesMessage("");
    } catch (err) {
      console.log(err);
      setNotesMessage("Error fetching general notes");
    }
  };

  const handlePeerTitleChange = (sessionId, value) => {
    setPeerTitles((prev) => ({ ...prev, [sessionId]: value }));
  };

  const handlePeerFileChange = (sessionId, file) => {
    setPeerFiles((prev) => ({ ...prev, [sessionId]: file }));
  };

  const uploadPeerNote = async (sessionId) => {
    try {
      const title = peerTitles[sessionId];
      const file = peerFiles[sessionId];

      if (!title || !file) {
        alert("Title and file are required");
        return;
      }

      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("title", title);
      formData.append("file", file);

      const res = await fetch(`{import.meta.env.VITE_API_URL}/api/sessions/upload-peer-note`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      alert("Peer note uploaded successfully");
      setPeerTitles((prev) => ({ ...prev, [sessionId]: "" }));
      setPeerFiles((prev) => ({ ...prev, [sessionId]: null }));

      fetchMissedData();
    } catch (err) {
      console.log(err);
      alert("Error uploading peer note");
    }
  };

  if (!user) {
    return (
      <div className="login-container">
        <h2>{isLogin ? "Student Login" : "Student Signup"}</h2>

        {!isLogin && (
          <>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Department / Branch</label>
            <input
              type="text"
              placeholder="e.g. CSE"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <label>Year</label>
            <input
              type="number"
              placeholder="e.g. 3"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <label>Section</label>
            <input
              type="text"
              placeholder="e.g. A"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </>
        )}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isLogin ? (
          <button onClick={handleLogin}>Login</button>
        ) : (
          <button onClick={handleSignup}>Signup</button>
        )}

        <p
          className="switch-link"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin ? "New user? Signup here" : "Already have account? Login"}
        </p>

        {message && <p className="error">{message}</p>}
      </div>
    );
  }

  if (currentPage === "home") {
    return (
      <div className="home-container">
        <div className="top-bar">
          <div>
            <h1>Welcome {user.name}</h1>
            <p><strong>Class:</strong> {user.className}</p>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <h1>Student Portal</h1>
        <p className="subtitle">Choose an option</p>

        <div className="portal-grid">
          <div className="portal-card">
            <h2>View Timetable</h2>
            <p>See today’s class timetable. If CR has not assigned it, it will show not assigned yet.</p>
            <button onClick={() => setCurrentPage("timetable")}>Open Timetable</button>
          </div>

          <div className="portal-card">
            <h2>What You Missed</h2>
            <p>View missed sessions by selecting a single day or a date range.</p>
            <button onClick={() => setCurrentPage("missed")}>Open Report</button>
          </div>

          <div className="portal-card">
            <h2>General Notes</h2>
            <p>View subject-wise materials uploaded by faculty like PPTs and reference notes.</p>
            <button
              onClick={() => {
                setCurrentPage("generalNotes");
                fetchGeneralNotes();
              }}
            >
              Open General Notes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "timetable") {
    return (
      <div className="container">
        <div className="top-bar">
          <h1>Today’s Timetable</h1>
          <button onClick={() => setCurrentPage("home")}>Back</button>
        </div>

        <div className="filter-card">
          <p className="message"><strong>Class:</strong> {user.className}</p>
          <button onClick={fetchTodayTimetable}>View Timetable</button>
        </div>

        {scheduleMessage && <p className="message">{scheduleMessage}</p>}

        {todaySchedule && (
          <div>
            {todaySchedule.periods.map((period, i) => (
              <div key={i} className="card">
                <p><b>Period:</b> {period.periodNumber}</p>
                <p><b>Status:</b> {period.status}</p>
                <p><b>Subject:</b> {period.subjectId?.name || "-"}</p>
                <p><b>Faculty:</b> {period.facultyId?.name || "-"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (currentPage === "missed") {
    return (
      <div className="container">
        <div className="top-bar">
          <h1>What You Missed</h1>
          <button onClick={() => setCurrentPage("home")}>Back</button>
        </div>

        <div className="filter-card">
          <p className="message"><strong>Class:</strong> {user.className}</p>

          <div className="mode-buttons">
            <button onClick={() => setMode("day")}>Select a Day</button>
            <button onClick={() => setMode("range")}>Select a Range</button>
          </div>

          {mode === "day" ? (
            <>
              <label>Select Day</label>
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
              />
            </>
          ) : (
            <>
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </>
          )}

          <button onClick={fetchMissedData}>Get Report</button>

          {message && <p className="message">{message}</p>}
        </div>

        <h3>Missed Sessions</h3>
        {sessions.length === 0 && <p>No sessions found</p>}
        {sessions.map((s, i) => (
          <div key={i} className="card">
            <p><b>Date:</b> {s.date}</p>
            <p><b>Period:</b> {s.periodNumber}</p>
            <p><b>Subject:</b> {s.subjectId?.name}</p>
            <p><b>Summary:</b> {s.summary}</p>
            <p><b>Topics:</b> {s.topicsCovered?.join(", ")}</p>

            {s.sessionNotes?.length > 0 && (
              <div>
                <h4>Notes:</h4>
                {s.sessionNotes.map((note, j) => (
                  <div key={j} className="note-card">
                    <span className={note.noteType === "student" ? "peer-tag" : "faculty-tag"}>
                      {note.noteType === "student" ? "Peer Note" : "Faculty Note"}
                    </span>

                    <p><b>{note.title}</b></p>
                    <p>Uploaded by: {note.uploadedBy?.name || "Unknown"}</p>

                    <a href={note.fileUrl} target="_blank" rel="noreferrer">
                      View / Download
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="note-upload-box">
              <h4>Upload Peer Note</h4>

              <input
                type="text"
                placeholder="Note title"
                value={peerTitles[s._id] || ""}
                onChange={(e) => handlePeerTitleChange(s._id, e.target.value)}
              />

              <input
                type="file"
                onChange={(e) => handlePeerFileChange(s._id, e.target.files[0])}
              />

              <button onClick={() => uploadPeerNote(s._id)}>
                Upload Peer Note
              </button>
            </div>
          </div>
        ))}

        <h3>Subject-wise Summary</h3>
        {summary.length === 0 && <p>No summary found</p>}
        {summary.map((s, i) => (
          <div key={i} className="card">
            <p><b>{s.subjectName}</b></p>
            <p>Missed: {s.totalMissed}</p>
          </div>
        ))}
      </div>
    );
  }

  if (currentPage === "generalNotes") {
    return (
      <div className="container">
        <div className="top-bar">
          <h1>General Subject Notes</h1>
          <button onClick={() => setCurrentPage("home")}>Back</button>
        </div>

        <p className="message">
          <strong>Class:</strong> {user.className}
        </p>

        {notesMessage && <p className="message">{notesMessage}</p>}

        {subjects.length === 0 && <p>No general notes found</p>}

        {subjects.map((subject, i) => (
          <div key={i} className="card">
            <h3>
              {subject.name} {subject.subjectCode ? `(${subject.subjectCode})` : ""}
            </h3>

            {subject.generalNotes?.length > 0 ? (
              subject.generalNotes.map((note, j) => (
                <div key={j} className="note-card">
                  <span className="faculty-tag">General Note</span>
                  <p><b>{note.title}</b></p>
                  <p>Uploaded by: {note.uploadedBy?.name || "Faculty"}</p>
                  <a href={note.fileUrl} target="_blank" rel="noreferrer">
                    View / Download
                  </a>
                </div>
              ))
            ) : (
              <p>No general notes available for this subject</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default App;