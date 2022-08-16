import {useEffect, useState} from 'react'
import './App.css'

import { KeyringProvider, KeyringAccount } from '@unique-nft/accounts/keyring';

function useAccounts(): [KeyringProvider, boolean, KeyringAccount[]] {
    const [accounts, setAccounts] = useState<KeyringAccount[]>([]);
    const [isReady, setIsReady] = useState(false);
    const provider = new KeyringProvider();
    provider.on("accountsChanged", setAccounts);

    useEffect(() => {
        provider.init().then( async () => {
            const accounts = await provider.getAccounts();

            setAccounts(accounts);
            setIsReady(true);
        })
    }, []);

    return [provider, isReady, accounts];
}

function KeyringSample() {
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

    const [seedToAdd, setSeedToAdd] = useState('//Alice');

    const onSeedChange = (event) => setSeedToAdd(event.target.value);
    const addAccount = () => {
        setSeedToAdd(seedToAdd === '//Alice' ? '' : '//Alice');

        provider.addSeed(seedToAdd);
    }

    return (
        <div className="App">
            <label>Seed <input value={seedToAdd} onChange={onSeedChange}/></label>
            <button disabled={!seedToAdd} onClick={addAccount}>Add account</button>

            <button disabled={!isReady || unsignedTx} onClick={buildTx}>Build Tx</button>
            <button disabled={!isReady || signedTx} onClick={signTx}>Sign Tx</button>

            {accounts.map((account) => <p key={account.instance.address}>{account.instance.address}</p>)}
        </div>
    )
}

export default KeyringSample;
