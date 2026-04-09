import { createContext, useContext, useState } from 'react';

const LeadsContext = createContext(null);

export const LeadsProvider = ({ children }) => {
    const [jobId, setJobId] = useState(null);
    const [leads, setLeads] = useState([]);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(null);

    return (
        <LeadsContext.Provider value={{ jobId, setJobId, leads, setLeads, progress, setProgress, status, setStatus }}>
        {children}
        </LeadsContext.Provider>
    );
};

export const useLeads = () => useContext(LeadsContext);