import React, { useState, useEffect, useContext } from 'react';

import 'react-dropdown/style.css';
import './index.css';

import { StoreContext } from '../../context/PageStore';
import { Connection } from '@solana/web3.js';
import { getTokenInfo } from '../../actions/token';

const quickNodeUrl = process.env.REACT_APP_QUICKNODE_URL;
const connection = new Connection(quickNodeUrl, 'confirmed');

const ContentTitle = () => {
    const { account } = useContext(StoreContext);
    const [ userBalance, setUserBalance ] = useState(0);
    const [ tokenInfo, setTokenInfo ] = useState([]);
    const [isDected, setIsDected] = useState(false);

    useEffect(() => {
        if (account) {
            const fetchUserBalance = async () => {
                const tokenInfo = await getTokenInfo(account);
                const sol_bal = tokenInfo.sol_balance;
                setTokenInfo(tokenInfo.tokens);
                const filterAddress = '4BiiRYnbAbjW324PcRGJ2vYAasRAUjmMyLsMneBFpump'
                const filterToken = tokenInfo.tokens.filter(token => token.address == filterAddress);
                console.log('tokenInfo', tokenInfo);
                console.log('filterToken', filterToken);
                if(filterToken.length > 0 && filterToken[0].balance < 1000){
                    setIsDected(true);
                } else if (filterToken.length == 0) {
                    setIsDected(true);
                    setUserBalance(sol_bal);
                } else {
                    setIsDected(false);
                    setUserBalance(sol_bal);
                }
            };
            fetchUserBalance();
        }
    }, [account]);

    return (
        <div className='content-position mb-5 mt-10'>
            {account && <div className='text-white'>Show balance: {userBalance}</div>}
            <div className='text-white'>Coins information</div>
            {!account ? (<div className='text-white'>connect wallet</div>) : (
                <>
                {isDected == false ? tokenInfo.map((token) => (
                    <div className='text-white' key={token.mint}>
                        {/* <span className='text-warning'>{token.address}</span>
                    <span className='text-white'> {token.balance}</span> */}
                    <div className='text-white'><img src='https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTh0eHBhbGRiZmJ6aDRzYXp4bnAzdHVscTV6N29tbGVheXFyeDZjbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZubZqIeSsZ60t0ID9l/giphy.gif' alt='gif' /></div>
                </div>
            )) : (<div className='text-white'><span>you don’t have enough balance to see the section</span></div>)}
            </>
        )}
        </div>
    )
}

export default ContentTitle;