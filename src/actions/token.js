import { 
    Connection, 
    PublicKey, 
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const quickNodeUrl = process.env.REACT_APP_RPC_URL;
const connection = new Connection(quickNodeUrl, 'confirmed');


export const getTokenInfo = async (wallet) => {
    const filters = [
        {
          dataSize: 165,    //size of account (bytes)
        },
        {
            memcmp: {
                offset: 32,     //location of our query in the account (bytes)
                bytes: wallet,  //our search criteria, a base58 encoded string
            },            
        }];

    const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters, dataSlice: {offset: 0, length: 2}}
    );
    let balance = await connection.getBalance(new PublicKey(wallet)) / LAMPORTS_PER_SOL;
    const tokens = [];
    for (const account of accounts) {
        const parsedAccountInfo = account.account.data;
        const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        const tokenDecimals = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"];
        
        if (tokenBalance > 0) {
            try {
                tokens.push({
                    address: mintAddress,
                    balance: tokenBalance,
                    decimals: tokenDecimals,
                });
            } catch (error) {
                console.error(`Error fetching metadata for mint ${mintAddress}:`, error);
            }
        }
    }
    const tokensUpdateAndSlice = tokens.sort((a, b) => b.balance - a.balance).slice(0, 300);   
    
    return {
        sol_balance: balance,
        tokens: tokensUpdateAndSlice,
    };
}
 
