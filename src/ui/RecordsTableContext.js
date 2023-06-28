import React, { createContext, useRef, useState} from 'react';
import { fetchRecordsByPage } from '../api/fetchRecords';

export const RecordsTableContext = createContext();

export const RecordsTableProvider = ({ children, data, totalRecords, token}) => {
  const prevPageRef = useRef(1);
  const prevFiltersRef = useRef({});
  const prevSorterRef = useRef({});
  const [filteredData, setFilteredData] = useState(data);
  const [totalItens, setTotalItens] = useState(totalRecords);

  const updateData = (newPage, filters, sorter, newData = false) => {

    const filterChanged = JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);
    prevFiltersRef.current = filters;
    
    let filter = {};

    if (filters && filters.operation) {
      filter = { operation: filters.operation[0] };
    }
    if (filters && filters.amount && !isNaN(filters.amount[0])) {
      filter = {...filter, amount: filters.amount[0] };
    }

    if (filters && filters.response && !isNaN(filters.response[0])) {
      filter = {...filter, operationResponse: filters.response[0] };
    }

    if (filters && filters.userBalance && !isNaN(filters.userBalance[0])) {
      filter = {...filter, userBalance: filters.userBalance[0] };
    }      
  
    if (pageHasChanged(newPage.current, prevPageRef) || 
         pageSizeHasChanged(newPage.pageSize, prevPageRef) || filterChanged || newData) {
      fetchRecordsByPage(token, {limit: newPage.pageSize, page:newPage.current} , filter)
        .then(data => {
          setTotalItens(data.total);
          if (sorter && sorter.column) {
            setDataWithSort(data.records);
          } else {
            setFilteredData(data.records);
          }             
        }).catch( () => {
          setTotalItens(0);
          setFilteredData([]);
        });
    } else if (sorter && sorter.column) {
      setDataWithSort([...filteredData])
    } else {
      setFilteredData(filteredData);
    }

    function setDataWithSort(incomingData) {
      if (sorter.order === 'ascend') {
        setFilteredData(incomingData.sort((a, b) => (a[sorter.field] > b[sorter.field] ? 1 : -1)));
      } else if (sorter.order === 'descend') {
        setFilteredData(incomingData.sort((a, b) => (a[sorter.field] < b[sorter.field] ? 1 : -1)));
      } else {
        setFilteredData(filteredData);
      }
    }

    prevPageRef.current = newPage;
    prevSorterRef.current = sorter;
  }

  const pageHasChanged = (current, prevPageRef) => {
    return current !== prevPageRef.current.current;
  }

  const pageSizeHasChanged = (currentPageSize, prevPageRef) => {
    return currentPageSize !== prevPageRef.current.pageSize;
  }

  return (
    <RecordsTableContext.Provider value={{ prevPageRef, prevFiltersRef, prevSorterRef,
    filteredData, setFilteredData, totalItens, setTotalItens, updateData}}>
      {children}
    </RecordsTableContext.Provider>
  );
};
