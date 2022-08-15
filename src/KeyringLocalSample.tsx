import {useEffect, useState} from 'react'
import './App.css'

import { KeyringLocalProvider, KeyringLocalAccount } from '@unique-nft/accounts/keyring-local';

function useAccounts(): [KeyringLocalProvider, boolean, KeyringLocalAccount[]] {
    const [accounts, setAccounts] = useState<KeyringLocalAccount[]>([]);
    const [isReady, setIsReady] = useState(false);
    const provider = new KeyringLocalProvider();
    provider.on("accountsChanged", setAccounts);

    useEffect(() => {
        provider.init().then( async () => {
            const accounts = await provider.getAccounts();
debugger;

            setAccounts(accounts);
            setIsReady(true);
        })
    }, []);

    return [provider, isReady, accounts];
}

function KeyringLocalSample() {
    const [provider, isReady, accounts] = useAccounts();
    const [unsignedTx, setUnsignedTx] = useState<any>(null);
    const [signedTx, setSignedTx] = useState<any>(null);

    const buildTx = async () => {
        const account = await provider.first();

        const body = {
            "address": account.instance.address,
            "destination": 'unjKJQJrRd238pkUZZvzDQrfKuM39zBSnQ5zjAGAGcdRhaJTx',
            "amount": 0.01
        }

        const unsignedTx = await fetch(
            'https://web.uniquenetwork.dev/balance/transfer?use=Build',
            {
                method: 'post',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            },
        ).then((res) => res.json());

        setUnsignedTx(unsignedTx);
    }

    const signTx = async () => {
        const account = await provider.first();

        const signed = await account!.getSigner().sign(unsignedTx);

        setSignedTx(signed);
    }

    return (
        <div className="App">
            <button disabled={!isReady || unsignedTx} onClick={buildTx}>Build Tx</button>
            <button disabled={!isReady || signedTx} onClick={signTx}>Sign Tx</button>

            {accounts.map((account) => <p key={account.instance}>{account.instance}</p>)}
        </div>
    )
}

export default KeyringLocalSample;
