import React, { useState, useContext } from 'react';
import { Button, Col, Input, Row, Select, Typography, Form} from 'antd';
import { performCalculation } from '../api/performCalculation';
import { RecordsTableContext } from './RecordsTableContext';

const { Option } = Select;
const { Text } = Typography;
const twoOperandOps = ['subtraction', 'addition', 'division', 'multiplication', 'new-addition'];
const oneOperandOps = [ 'square-root', 'new-square'];
const noOperandOps = ['random-string'];

export const NewOperation = ({token, handleLogout, incomingOperations}) => {
  const [firstOperand, setFirstOperand] = useState('');
  const [secondOperand, setSecondOperand] = useState('');
  const [operator, setOperator] = useState('');
  const [response, setResult] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const {prevPageRef, prevFiltersRef, prevSorterRef,
    updateData} = useContext(RecordsTableContext);

  const handleOperation = () => {
    
    if (!operator) {
        setWarningMessage('Please select an operation.');
        return;
    }
    
    if ( twoOperandOps.some(op => op === operator ) && 
        (!firstOperand || !secondOperand)) {
            setWarningMessage('Please enter values for both operands.');
        return;
    }

    if ( oneOperandOps.some(op => op === operator) && !firstOperand) {
        setWarningMessage('Please enter a value for the operand.');
        return;
    }
    
    setWarningMessage('');

    let params =  {operator: operator, method:"arithmetic-operation", operands:[]};;

    if (oneOperandOps.some(op => op === operator)) {
        params.operands = [firstOperand];
    } else if (twoOperandOps.some(op => op === operator)) {
        params.operands = [firstOperand, secondOperand];
    } else {
        params.method = "non-arithmetic-operation"; 
    }

    performCalculation(token, params)
    .then((data) => setResult(data))
    .then(() => updateData(prevPageRef.current, 
      prevFiltersRef.current, prevSorterRef.current, true))
    .catch((errorMessage) => {
        setWarningMessage(errorMessage);
    })
  };

  const handleFirstOperand = (e) => {
    const value = e.target.value+"";
    // Validate that only numbers are entered
    if (/^\d*\.?\d*$/.test(value)) {
      setFirstOperand(value);
    }
  };

  const handleSecondOperand = (e) => {
    const value = e.target.value+"";
    // Validate that only numbers are entered
    if (/^\d*\.?\d*$/.test(value)) {
      setSecondOperand(value);
    }
  };

  const handleOperatorChange = (value) => {
    setWarningMessage('')
    setOperator(value);
  };

  return (
    <div>
      <Row gutter={16} align="middle" style={{ alignItems: 'flex-end' }}>
        <Col span={3}>
          {!noOperandOps.some(op => op === operator) && operator && (
            <Input
              value={firstOperand}
              onChange={handleFirstOperand}
              placeholder="Operand 1"
              maxLength={10}
            />
          )}
        </Col>
        <Col span={3}>
          {twoOperandOps.some(op => op === operator) && (
            <Input
              value={secondOperand}
              onChange={handleSecondOperand}
              placeholder="Operand 2"
              maxLength={10}
            />
          )}
        </Col>
        <Col span={4}>
          <Form>
          <Form.Item
            name="addition"
            valuePropName="value"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            style={{ marginBottom: 0 }}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Select an operation"
              value={operator}
              onChange={handleOperatorChange}>
              {incomingOperations.map( op => 
                (<Option key={op.id} value={op.operation}>{op.value}</Option>))}
            </Select>
          </Form.Item>
          </Form>
          
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={handleOperation}>
            Calculate
          </Button>
          
        </Col>
        <Col span={6} >
        {response !== '' && (
          <div style={{ backgroundColor: 'lightblue', borderRadius: '5px', padding: '5px', display: 'flex', alignItems: 'left', justifyContent: 'center', height: '100%' }}>
            <Text strong>Response: {response}</Text>
          </div>
        )}
        </Col>
        <Col span={4}  style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleLogout}>
            Sign Out
          </Button>
          
        </Col>
      </Row>
      <Row gutter={16} align="middle">
        <Col span={24}>
          {warningMessage && (
            <Text type="danger">{warningMessage}</Text>
          )}
        </Col>
      </Row>
    </div>
  );
};