import React, {useContext} from 'react';
import { Table, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fetchRecordsByPage } from '../api/fetchRecords';
import { deleteRecord } from '../api/deleteRecord';
import { RecordsTableContext } from './RecordsTableContext';

const { Column } = Table;

const Records = ({token}) => {
  
  const { prevPageRef, prevFiltersRef, filteredData, 
    setFilteredData, totalItens, setTotalItens, updateData } = useContext(RecordsTableContext);

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex, pattern) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    
    const handleInputChange = (e) => {
      const inputValue = e.target.value;
      const updatedValue = inputValue.replace(pattern, '');
      setSelectedKeys(updatedValue ? [updatedValue] : []); 
    };

    return (
      
      <div style={{ padding: 5 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => handleInputChange(e)}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    )},
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  return (
    <Table rowKey="id"
      dataSource={filteredData}
      pagination={{
        pageSize: prevPageRef.current.pageSize,
        total: totalItens,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
        current: prevPageRef.current.current,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      onChange={(newPage, filters, sorter) => {
        updateData(newPage, filters, sorter);
      }}
    >
      <Column title="Operation" dataIndex="operation" key="operation" sorter
        {...getColumnSearchProps('operation', /[0-9]/g)}
      />
      <Column title="User Balance" dataIndex="userBalance" key="userBalance" sorter 
        {...getColumnSearchProps('userBalance', /[^0-9]/g)}/>
      <Column title="Cost" dataIndex="amount" key="amount" sorter 
        {...getColumnSearchProps('amount', /[^0-9]/g)}/>
      <Column title="Response" dataIndex="response" key="response" sorter 
        {...getColumnSearchProps('response', /[^0-9]/g)} />
      <Column title="Date" dataIndex="date" key="date" sorter />
      <Column
        title="Action"
        key="actions"
        render={(text, record) => (
          <Button
            type="primary"
            danger
            onClick={() => 
              deleteRecord(token, record.id)
              .then(() => {
                fetchRecordsByPage(token, {limit: prevPageRef.current.pageSize, page:prevPageRef.current.current} 
                  , prevFiltersRef.current)
                .then(data => {
                  setTotalItens(data.total);
                  setFilteredData(data.records)
                }).catch( () => {
                  setTotalItens(0);
                  setFilteredData([]);
                });
              }).catch(() => {
                setTotalItens(0);
                setFilteredData([]);
              })
            }>
            Delete
          </Button>
        )}
      />
    </Table>
  );
};

export default Records;


