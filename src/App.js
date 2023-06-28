import './App.css';
import Login from './ui/Login';
import Records from './ui/Records';
import { useState } from 'react';
import { fetchRecordsByPage } from './api/fetchRecords';
import { NewOperation } from './ui/NewOperation';
import { RecordsTableProvider } from './ui/RecordsTableContext';
import { fetchOperations } from './api/fetchOperations';

const initialPageSize = 10;

function App() {
  const [token, setToken] = useState(null);
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [operations, setOperations] = useState([]);

  const fetchApi = (tokenValue) => {
    fetchRecordsByPage(tokenValue, {limit: initialPageSize, page:1})
      .then( data => {
        fetchOperations(tokenValue)
          .then(operations => {
            setRecords(data.records);
            setTotalRecords(data.total)
            setToken(tokenValue);
            setOperations(operations);
          })       
      }).catch(() => {
        setToken(null);
      });  
  }

  const handleLogin = (token) => {
    fetchApi(token); 
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div>
      {!token ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <RecordsTableProvider data={records} totalRecords={totalRecords} token={token}>
          <NewOperation token={token} incomingOperations={operations} handleLogout={handleLogout}/>
          <Records token={token} />
        </RecordsTableProvider>
      )}
    </div>
  );
}

export default App;
