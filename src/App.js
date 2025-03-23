import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// Main App Component
function App() {
  // Define political parties
  const parties = {
    PTI: { name: "PTI", color: "#ff4d4d" },
    PDM: { name: "PDM", color: "#4d79ff" }
  };
  
  // Define provinces
  const provinces = ["Punjab", "Sindh", "Balochistan", "KPK"];
  
  // Initialize NA candidates (200 total seats)
  const initialNationalCandidates = [
    { id: 1, name: 'Imran Khan', party: 'PTI', votes: 0 },
    { id: 2, name: 'General Asim Muneer', party: 'PDM', votes: 0 },
    { id: 3, name: 'Shah Mehmood Qureshi', party: 'PTI', votes: 0 },
    { id: 4, name: 'Nawaz Shareef', party: 'PDM', votes: 0 },
  ];
  
  // Initialize Provincial candidates (300 seats per province)
  const initialProvincialCandidates = {};
  provinces.forEach(province => {
    initialProvincialCandidates[province] = [
      { id: 1, name: 'Murad Saeed', party: 'PTI', votes: 0, province },
      { id: 2, name: 'Rana Snaullah', party: 'PDM', votes: 0, province },
      { id: 3, name: 'Omar Sarfraz ', party: 'PTI', votes: 0, province },
      { id: 4, name: 'Maryam nawaz', party: 'PDM', votes: 0, province },
    ];
  });
  
  // State for candidates and voting info
  const [nationalCandidates, setNationalCandidates] = useState(initialNationalCandidates);
  const [provincialCandidates, setProvincialCandidates] = useState(initialProvincialCandidates);
  const [voter, setVoter] = useState(null);
  const [votingStatus, setVotingStatus] = useState({
    nationalVoteCast: false,
    provincialVoteCast: false
  });

  // Register voter
  const registerVoter = (voterDetails) => {
    setVoter(voterDetails);
  };

  // Add a new national candidate
  const addNationalCandidate = (candidateData) => {
    const newId = nationalCandidates.length > 0 ? Math.max(...nationalCandidates.map(c => c.id)) + 1 : 1;
    setNationalCandidates([...nationalCandidates, { ...candidateData, id: newId, votes: 0 }]);
  };

  // Remove a national candidate
  const removeNationalCandidate = (id) => {
    setNationalCandidates(nationalCandidates.filter(candidate => candidate.id !== id));
  };

  // Add a new provincial candidate
  const addProvincialCandidate = (candidateData, province) => {
    const provinceList = provincialCandidates[province] || [];
    const newId = provinceList.length > 0 ? Math.max(...provinceList.map(c => c.id)) + 1 : 1;
    setProvincialCandidates({
      ...provincialCandidates,
      [province]: [...provinceList, { ...candidateData, id: newId, votes: 0, province }]
    });
  };

  // Remove a provincial candidate
  const removeProvincialCandidate = (id, province) => {
    setProvincialCandidates({
      ...provincialCandidates,
      [province]: provincialCandidates[province].filter(candidate => candidate.id !== id)
    });
  };

  // Cast a vote for national assembly
  const castNationalVote = (id) => {
    if (votingStatus.nationalVoteCast) {
      alert('You have already voted for National Assembly!');
      return;
    }
    
    setNationalCandidates(nationalCandidates.map(candidate => 
      candidate.id === id ? { ...candidate, votes: candidate.votes + 1 } : candidate
    ));
    setVotingStatus({...votingStatus, nationalVoteCast: true});
  };

  // Cast a vote for provincial assembly
  const castProvincialVote = (id, province) => {
    if (votingStatus.provincialVoteCast) {
      alert('You have already voted for Provincial Assembly!');
      return;
    }
    
    setProvincialCandidates({
      ...provincialCandidates,
      [province]: provincialCandidates[province].map(candidate => 
        candidate.id === id ? { ...candidate, votes: candidate.votes + 1 } : candidate
      )
    });
    setVotingStatus({...votingStatus, provincialVoteCast: true});
  };

  // Reset votes for a user
  const resetVotes = () => {
    setVotingStatus({
      nationalVoteCast: false,
      provincialVoteCast: false
    });
    setVoter(null);
  };

  // Log out voter
  const logoutVoter = () => {
    setVoter(null);
    setVotingStatus({
      nationalVoteCast: false,
      provincialVoteCast: false
    });
  };

  return (
    <Router>
      <div className="max-w-6xl mx-auto p-4">
        <header className="bg-gray-800 text-white p-4 mb-6 rounded flex justify-between items-center">
          <h1 className="text-2xl font-bold">Election Voting System</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/admin" className="text-white hover:text-gray-300">Admin</Link></li>
              <li><Link to="/register" className="text-white hover:text-gray-300">Register</Link></li>
              <li><Link to="/vote" className="text-white hover:text-gray-300">Vote</Link></li>
              <li><Link to="/results" className="text-white hover:text-gray-300">Results</Link></li>
            </ul>
          </nav>
          {voter && (
            <div className="flex items-center">
              <span className="mr-4">Voter: {voter.name} ({voter.province})</span>
              <button 
                onClick={logoutVoter}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/admin" element={
            <AdminPage 
              nationalCandidates={nationalCandidates} 
              provincialCandidates={provincialCandidates}
              provinces={provinces}
              parties={parties}
              addNationalCandidate={addNationalCandidate} 
              removeNationalCandidate={removeNationalCandidate}
              addProvincialCandidate={addProvincialCandidate}
              removeProvincialCandidate={removeProvincialCandidate}
              resetVotes={resetVotes}
            />
          } />
          <Route path="/register" element={
            <RegisterPage 
              provinces={provinces}
              registerVoter={registerVoter}
              voter={voter}
            />
          } />
          <Route path="/vote" element={
            voter ? (
              <VotingPage 
                nationalCandidates={nationalCandidates}
                provincialCandidates={provincialCandidates[voter.province] || []}
                castNationalVote={castNationalVote}
                castProvincialVote={(id) => castProvincialVote(id, voter.province)}
                votingStatus={votingStatus}
                parties={parties}
                voter={voter}
              />
            ) : (
              <Navigate to="/register" />
            )
          } />
          <Route path="/results" element={
            <ResultsPage 
              nationalCandidates={nationalCandidates}
              provincialCandidates={provincialCandidates}
              provinces={provinces}
              parties={parties}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App

// Registration Page Component
function RegisterPage({ provinces, registerVoter, voter }) {
  const [voterInfo, setVoterInfo] = useState({
    name: '',
    cnic: '',
    age: '',
    province: provinces[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (voterInfo.name && voterInfo.cnic && voterInfo.age && voterInfo.province) {
      registerVoter(voterInfo);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleChange = (e) => {
    setVoterInfo({
      ...voterInfo,
      [e.target.name]: e.target.value
    });
  };

  if (voter) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">You are registered!</h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p><strong>Name:</strong> {voter.name}</p>
          <p><strong>CNIC:</strong> {voter.cnic}</p>
          <p><strong>Province:</strong> {voter.province}</p>
        </div>
        <Link to="/vote" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Proceed to Vote
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Voter Registration</h1>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={voterInfo.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cnic">
              CNIC / ID Number
            </label>
            <input
              type="text"
              id="cnic"
              name="cnic"
              value={voterInfo.cnic}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your CNIC number"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={voterInfo.age}
              onChange={handleChange}
              min="18"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your age"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="province">
              Province
            </label>
            <select
              id="province"
              name="province"
              value={voterInfo.province}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Register & Continue to Vote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Admin Page Component for adding/removing candidates
function AdminPage({ 
  nationalCandidates, 
  provincialCandidates,
  provinces,
  parties,
  addNationalCandidate, 
  removeNationalCandidate,
  addProvincialCandidate,
  removeProvincialCandidate,
  resetVotes
}) {
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: 'red',
  });
  const [selectedProvince, setSelectedProvince] = useState(provinces[0]);

  const handleChange = (e) => {
    setNewCandidate({
      ...newCandidate,
      [e.target.name]: e.target.value
    });
  };

  const handleNationalSubmit = (e) => {
    e.preventDefault();
    if (newCandidate.name && newCandidate.party) {
      addNationalCandidate(newCandidate);
      setNewCandidate({ ...newCandidate, name: '' });
    }
  };

  const handleProvincialSubmit = (e) => {
    e.preventDefault();
    if (newCandidate.name && newCandidate.party) {
      addProvincialCandidate(newCandidate, selectedProvince);
      setNewCandidate({ ...newCandidate, name: '' });
    }
  };

  // Render party logo
  const PartyLogo = ({ party }) => (
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2"
      style={{ backgroundColor: parties[party].color }}
    >
      {parties[party].name}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Election Administration</h1>
      
      {/* National Assembly Section */}
      <div className="mb-8 p-4 border rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">National Assembly Candidates (200 Seats)</h2>
        <form onSubmit={handleNationalSubmit} className="flex items-center mb-4">
          <input
            type="text"
            name="name"
            value={newCandidate.name}
            onChange={handleChange}
            placeholder="Candidate name"
            className="border p-2 mr-2 flex-grow rounded"
          />
          <select
            name="party"
            value={newCandidate.party}
            onChange={handleChange}
            className="border p-2 mr-2 rounded"
          >
            {Object.keys(parties).map(party => (
              <option key={party} value={party}>{parties[party].name}</option>
            ))}
          </select>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Candidate
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {nationalCandidates.map(candidate => (
            <div key={candidate.id} className="border p-4 rounded shadow flex flex-col">
              <div className="flex items-center mb-2">
                <PartyLogo party={candidate.party} />
                <h3 className="font-medium">{candidate.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{parties[candidate.party].name}</p>
              <button 
                onClick={() => removeNationalCandidate(candidate.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-auto"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Provincial Assembly Section */}
      <div className="mb-8 p-4 border rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">Provincial Assembly Candidates (300 Seats per Province)</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="provinceSelect">
            Select Province
          </label>
          <select
            id="provinceSelect"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="shadow appearance-none border rounded w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {provinces.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>
        
        <form onSubmit={handleProvincialSubmit} className="flex items-center mb-4">
          <input
            type="text"
            name="name"
            value={newCandidate.name}
            onChange={handleChange}
            placeholder="Candidate name"
            className="border p-2 mr-2 flex-grow rounded"
          />
          <select
            name="party"
            value={newCandidate.party}
            onChange={handleChange}
            className="border p-2 mr-2 rounded"
          >
            {Object.keys(parties).map(party => (
              <option key={party} value={party}>{parties[party].name}</option>
            ))}
          </select>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Provincial Candidate
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(provincialCandidates[selectedProvince] || []).map(candidate => (
            <div key={candidate.id} className="border p-4 rounded shadow flex flex-col">
              <div className="flex items-center mb-2">
                <PartyLogo party={candidate.party} />
                <h3 className="font-medium">{candidate.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{parties[candidate.party].name}</p>
              <button 
                onClick={() => removeProvincialCandidate(candidate.id, selectedProvince)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-auto"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Controls */}
      <div className="mt-8">
        <button 
          onClick={resetVotes}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Reset All Votes (Admin Only)
        </button>
      </div>
    </div>
  );
}

// Voting Page Component
function VotingPage({ 
  nationalCandidates, 
  provincialCandidates, 
  castNationalVote, 
  castProvincialVote, 
  votingStatus,
  parties,
  voter
}) {
  const allVotesCast = votingStatus.nationalVoteCast && votingStatus.provincialVoteCast;

  // Render party logo
  const PartyLogo = ({ party }) => (
    <div 
      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2"
      style={{ backgroundColor: parties[party].color }}
    >
      {parties[party].name}
    </div>
  );

  if (allVotesCast) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Thank You for Voting!</h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>Your votes have been recorded for both assemblies.</p>
          <p className="mt-2"><strong>Province:</strong> {voter.province}</p>
        </div>
        <Link to="/results" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Results
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cast Your Votes for {voter.province}</h1>
      
      {/* National Assembly Voting */}
      <div className="mb-8 p-4 border rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">
          National Assembly Vote 
          {votingStatus.nationalVoteCast && <span className="text-green-500 ml-2">(Voted)</span>}
        </h2>
        
        {votingStatus.nationalVoteCast ? (
          <p>You have already cast your National Assembly vote.</p>
        ) : nationalCandidates.length === 0 ? (
          <p>No candidates available to vote for.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {nationalCandidates.map(candidate => (
              <div key={candidate.id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                <PartyLogo party={candidate.party} />
                <h3 className="text-lg font-medium mb-2">{candidate.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{parties[candidate.party].name}</p>
                <button
                  onClick={() => castNationalVote(candidate.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full mt-auto"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Provincial Assembly Voting */}
      <div className="mb-8 p-4 border rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">
          Provincial Assembly Vote for {voter.province}
          {votingStatus.provincialVoteCast && <span className="text-green-500 ml-2">(Voted)</span>}
        </h2>
        
        {votingStatus.provincialVoteCast ? (
          <p>You have already cast your Provincial Assembly vote.</p>
        ) : provincialCandidates.length === 0 ? (
          <p>No candidates available to vote for in {voter.province}.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {provincialCandidates.map(candidate => (
              <div key={candidate.id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                <PartyLogo party={candidate.party} />
                <h3 className="text-lg font-medium mb-2">{candidate.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{parties[candidate.party].name}</p>
                <button
                  onClick={() => castProvincialVote(candidate.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full mt-auto"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Results Page Component
function ResultsPage({ nationalCandidates, provincialCandidates, provinces, parties }) {
  const totalNationalVotes = nationalCandidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  
  // Calculate party totals for national assembly
  const nationalPartyTotals = Object.keys(parties).reduce((acc, party) => {
    acc[party] = nationalCandidates
      .filter(c => c.party === party)
      .reduce((sum, c) => sum + c.votes, 0);
    return acc;
  }, {});
  
  // Calculate party totals for all provincial assemblies
  const provincialPartyTotals = {};
  provinces.forEach(province => {
    const provinceResults = {};
    const provinceList = provincialCandidates[province] || [];
    const totalProvincialVotes = provinceList.reduce((sum, candidate) => sum + candidate.votes, 0);
    
    Object.keys(parties).forEach(party => {
      provinceResults[party] = provinceList
        .filter(c => c.party === party)
        .reduce((sum, c) => sum + c.votes, 0);
    });
    
    provincialPartyTotals[province] = {
      votes: provinceResults,
      total: totalProvincialVotes
    };
  });
  
  // Sort candidates by votes (highest first)
  const sortedNationalCandidates = [...nationalCandidates].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Election Results</h1>
      
      {/* National Assembly Results */}
      <div className="mb-8 p-4 border rounded bg-white shadow">
        <h2 className="text-xl font-semibold mb-4">National Assembly Results (200 Seats)</h2>
        
        {totalNationalVotes === 0 ? (
          <p>No votes have been cast for National Assembly yet.</p>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Party Results</h3>
              <div className="flex mb-4">
                {Object.keys(parties).map(party => {
                  const votes = nationalPartyTotals[party];
                  const percentage = totalNationalVotes > 0 ? (votes / totalNationalVotes) * 100 : 0;
                  const seats = Math.round((percentage / 100) * 200);
                  
                  return (
                    <div key={party} className="mr-6 flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-2"
                        style={{ backgroundColor: parties[party].color }}
                      >
                        {parties[party].name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{parties[party].name}</p>
                        <p>{votes} votes ({percentage.toFixed(1)}%)</p>
                        <p className="text-sm"><strong>{seats}</strong> projected seats</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
                {Object.keys(parties).map(party => {
                  const percentage = totalNationalVotes > 0 ? (nationalPartyTotals[party] / totalNationalVotes) * 100 : 0;
                  return (
                    <div 
                      key={party}
                      className="h-6 rounded-full float-left" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: parties[party].color 
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
            
            <h3 className="font-semibold mb-2">Top Candidates</h3>
            <div className="space-y-4">
              {sortedNationalCandidates.slice(0, 10).map(candidate => {
                const percentage = totalNationalVotes > 0 ? (candidate.votes / totalNationalVotes) * 100 : 0;
                
                return (
                  <div key={candidate.id} className="border p-3 rounded">
                    <div className="flex justify-between mb-2 items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold mr-2"
                          style={{ backgroundColor: parties[candidate.party].color }}
                        >
                          {parties[candidate.party].name.charAt(0)}
                        </div>
                        <span className="font-medium">{candidate.name}</span>
                      </div>
                      <span>{candidate.votes} votes ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="h-4 rounded-full" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: parties[candidate.party].color
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}