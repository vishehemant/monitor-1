import React, {useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import styled from 'styled-components'
import Table from './Table';
import targets from './data/targets.json';

const App = () => {

  const [data, setData] = useState([]);
  const [freq, setFreq] = useState(5000);
  
  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {

    const myInterval = setInterval(() => refresh(), freq);

    return () => clearInterval(myInterval);
  }, [freq]);

  const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const refresh = async () => {

  const dataArray = [];
  for(const target of targets.targets){

    const url = `${target.url}:${target.port}`;
    let status;
    try{
      const request = await axios.head(url);
      status = request.status;
    }
    catch(e) {
      status = e.response.status;
    }
    dataArray.push({
          label: target.label,
          url: target.url,
          port: target.port,
          status: status
        });
  }
  setData(dataArray);
};

const changeFreq = (freq) => {
  setFreq(Number(freq));
}

  

  const columns = useMemo(
    () => [
      {
        // first group - TV Show
        Header: "Targets",
        // First group columns
        columns: [
          {
            Header: "Label",
            accessor: "label"
          },
          {
            Header: "URL",
            accessor: "url"
          },
          {
            Header: "Port",
            accessor: "port"
          },
          {
            Header: "Status",
            accessor: "status"
          }
        ]
      },
    ],
    []
  );

  return (
    <div className="App">
      <select onChange={(e)=> changeFreq(e.target.value)} name='freq'>
        <option value="5000">5 Seconds</option>
        <option value="10000">10 Seconds</option>
        <option value="20000">20 Seconds</option>
        <option value="30000">30 Seconds</option>
      </select>
      <button onClick={refresh}>Refresh now</button>
      <Styles>
    <Table columns={columns} data={data} />
    </Styles>
  </div>
  );
};

export default App;
