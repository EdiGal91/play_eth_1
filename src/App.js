import './App.css';
import { useEffect, useRef, useState } from 'react';
import { ethers, providers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';

const greeterAddress = process.env.REACT_APP_GREETER_ADDRESS
const tokenAddress = process.env.REACT_APP_EGD_ADDRESS

function App() {
  const [greetingValue, setGreetingValue] = useState('')
  const [newGreetingValue, setNewGreetingValue] = useState('')
  const [connectedAccount, setConnectedAccount] = useState('')
  const [balances, setBalances] = useState({ ETH: 0, EGD: 0 })
  const [connectedAddressDisplay, setConnectedAddressDisplay] = useState('')
  const [toSendAmount, setToSendAmount] = useState(0)
  const [toSendAddress, setToSendAddress] = useState(0)

  const providerRef = useRef(null)

  useEffect(() => {
    providerRef.current = new providers.Web3Provider(window.ethereum);
    window.ethereum.on('accountsChanged', accountChangedHandler)
    checkIsConnected()
    fetchGreeting()
  }, [])

  useEffect(() => {
    setConnectedAddressDisplay(`${connectedAccount.slice(0, 6)}...${connectedAccount.slice(connectedAccount.length - 4)}`)
    if(!connectedAccount) {

    } else {
      setBalanceOfETH(connectedAccount)
      setBalanceOfEGD(connectedAccount)
    }
  }, [connectedAccount])

  async function setBalanceOfETH(connectedAccount) {
    const balance = await providerRef.current.getBalance(connectedAccount)
    
    setBalances(state => ({...state, ETH: ethers.utils.formatEther(balance) }))
  }

  async function setBalanceOfEGD(connectedAccount) {
    const contract = new ethers.Contract(tokenAddress, Token.abi, providerRef.current);
    const balance = await contract.balanceOf(connectedAccount);
    setBalances(state => ({...state, EGD: balance.toString() }))
  }

  function accountChangedHandler([account = '']) {
    if (account === connectedAccount) return;
    setConnectedAccount(account)
  }

  async function checkIsConnected() {
    const [connectedAccount = ''] = await window.ethereum.request({ method: 'eth_accounts' })
    setConnectedAccount(connectedAccount)
  }

  async function connectToMMask() {
    try {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setConnectedAccount(account)
    } catch (err) {
      setConnectedAccount('')
    }
  }

  async function fetchGreeting() {
    if (typeof window.ethereum === 'undefined') {
      console.error('window.ethereum is not defined!')
      return
    }
    try {
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, providerRef.current);
      const data = await contract.greet();
      setGreetingValue(data)
      setNewGreetingValue(data)
    } catch (err) {
    }
  }

  async function setGreeting() {
    if (!newGreetingValue) return

    if (typeof window.ethereum === 'undefined') {
      console.error('window.ethereum is not defined!')
      return
    }
    await connectToMMask()
    const signer = providerRef.current.getSigner();
    const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
    const transaction = await contract.setGreeting(newGreetingValue)
    await transaction.wait();
    fetchGreeting()
  }

  async function sendAmount() {
    debugger
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{maxWidth: '50%'}}>
          {
            connectedAccount
              ? <h1>
                  <span className="badge bg-primary">
                    {connectedAddressDisplay}
                  </span>
                </h1>
              : <button onClick={connectToMMask} >Connect</button>
          }

          <div className="input-group mb-3">
            <input
              onChange={e => setNewGreetingValue(e.target.value)}
              className="form-control" aria-label="Recipient's username" aria-describedby="refresh"
              value={newGreetingValue}
            />
            { greetingValue !== newGreetingValue &&
              <button onClick={fetchGreeting} className="btn btn-outline-primary" id="refresh">Referesh</button>
            }
            { greetingValue !== newGreetingValue &&
              <button onClick={setGreeting} className="btn btn-outline-success" id="refresh">Set</button>
            }
          </div>

          <h3>Balances: </h3>
          <ul className="list-group">
            {Object.entries(balances).map(([token, balance]) => <li key={`${token}-${balance}`} className="list-group-item">{balance} {token}</li>)}
          </ul>
          
          <div className="input-group mb-3">
            <input className="form-control" placeholder="amount" onChange={e => setToSendAmount(e.target.value)} />
            <input className="form-control" placeholder="address"  onChange={e => setToSendAddress(e.target.value)} />
            <button className="btn btn-success" onClick={sendAmount} >Send</button>
          </div>
        </div>


      </header>
    </div>
  );
}

        export default App;
