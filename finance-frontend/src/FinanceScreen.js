import logo from './logo.svg';
import './App.css';
import moment from 'moment';
import TransactionList from './components/TransactionList';
import AddItem from './components/AddItem';
import { useState, useEffect } from 'react';
import { Spin, Divider, Typography } from 'antd';
import axios from 'axios'
import EditItem from './components/EditItem';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337"
const URL_TXACTIONS = '/api/txactions'

function FinanceScreen() {
  const [currentAmount, setCurrentAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [transactionData, setTransactionData] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null)

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(URL_TXACTIONS)
      setTransactionData(response.data.data.map(d => ({
        id: d.id,
        key: d.id,
        ...d.attributes
      })))
    } catch (err) {
      console.log(err)
    } finally { setIsLoading(false) }
  }

  const addItem = async (item) => {
    try {
      setIsLoading(true)
      const params = { ...item, action_datetime: moment() }
      const response = await axios.post(URL_TXACTIONS, { data: params })
      const { id, attributes } = response.data.data
      setTransactionData([
        ...transactionData,
        { id: id, key: id, ...attributes }
      ])
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateItem = async (item) => {
    try {
      setIsLoading(true)
      setEditItem(item)
      if (editItem) {
        setIsOpen(true)
        await axios.put(`${URL_TXACTIONS}/${item.id}`, {data: item})
      } else {
        setIsOpen(false)
      }
      fetchItems()
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteItem = async (itemId) => {
    try {
      setIsLoading(true)
      await axios.delete(`${URL_TXACTIONS}/${itemId}`)
      fetchItems()
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setCurrentAmount(transactionData.reduce(
      (sum, d) => sum = d.type === "income" ? sum + d.amount : sum - d.amount
      , 0))
  }
    , [transactionData])

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <Spin spinning={isLoading}>
          <Typography.Title>
            จำนวนเงินปัจจุบัน {currentAmount} บาท
          </Typography.Title>
          <AddItem onItemAdded={addItem} />
          <Divider>บันทึกรายรับ-รายจ่าย</Divider>
          <TransactionList
            data={transactionData}
            onTransactionEdited={updateItem}
            onTransactionDeleted={deleteItem} />
          <EditItem 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            item={editItem}
            setItem={setEditItem}
            onItemEdited={updateItem} />
        </Spin>
      </header>
    </div>
  );

}

export default FinanceScreen;
